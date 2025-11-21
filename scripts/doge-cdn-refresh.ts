import crypto from "crypto";
import fetch from "node-fetch";
import { config } from "./config";

export interface DogeRefreshConfig {
  accessKey: string; // AccessKey
  secretKey: string; // SecretKey
  path: string; // path to refresh
}

/**
 * Refresh DogeCloud CDN (per official docs)
 */
async function refreshDogeCDN(cfg: DogeRefreshConfig) {
  const { accessKey, secretKey, path } = cfg;

  // request body (form encoded, not JSON)
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
    console.log(`✔ DogeCloud CDN refresh successful`);
    console.log(`task_id: ${json.data.task_id}`);
    console.log(`count: ${json.data.count}`);
  } else {
    console.error(`❌ Refresh failed:`, json);
  }

  return json;
}

refreshDogeCDN(config.doge);
