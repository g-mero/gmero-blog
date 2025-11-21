import crypto from "crypto";
import fetch from "node-fetch";
import { config } from "./config";

export interface DogeRefreshConfig {
  accessKey: string; // AccessKey
  secretKey: string; // SecretKey
  path: string; // 要刷新的目录
}

/**
 * 刷新多吉云 CDN（符合官方文档）
 */
async function refreshDogeCDN(cfg: DogeRefreshConfig) {
  const { accessKey, secretKey, path } = cfg;

  // 请求 body（表单形式，而不是 JSON）
  const body = `rtype=path&urls=${encodeURIComponent(path)}`;
  const apiPath = "/cdn/refresh/add.json";

  const sign = crypto
    .createHmac("sha1", secretKey)
    .update(Buffer.from(apiPath + "\n" + body, "utf8"))
    .digest("hex");

  const authorization = "TOKEN " + accessKey + ":" + sign;

  const resp = await fetch("https://api.dogecloud.com/cdn/refresh/add.json", {
    method: "POST",
    headers: {
      Authorization: `TOKEN ${accessKey}:${sign}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const json: any = await resp.json();

  if (json.code === 200) {
    console.log(`✔ 多吉云 CDN 刷新成功`);
    console.log(`task_id: ${json.data.task_id}`);
    console.log(`count: ${json.data.count}`);
  } else {
    console.error(`❌ 刷新失败:`, json);
  }

  return json;
}

refreshDogeCDN(config.doge);
