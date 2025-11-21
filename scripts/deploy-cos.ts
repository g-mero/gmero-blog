import COS from "cos-nodejs-sdk-v5";
import fs from "fs";
import path from "path";
import { config } from "./config";

export interface DeployConfig {
  secretId: string;
  secretKey: string;
  bucket: string;
  region: string;
  localDir?: string; // 默认 public/
  prefix?: string; // 远端路径前缀
}

// -------------------------------
// 递归列出所有文件
// -------------------------------
function listFilesRecursively(baseDir: string): string[] {
  const results: string[] = [];

  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (fs.statSync(full).isDirectory()) {
        walk(full);
      } else {
        results.push(full);
      }
    }
  }

  walk(baseDir);
  return results;
}

// -------------------------------
// 清空 COS bucket
// -------------------------------
async function emptyBucket(cos: COS, bucket: string, region: string) {
  async function loop(marker?: string) {
    const res = await cos.getBucket({
      Bucket: bucket,
      Region: region,
      Marker: marker,
      MaxKeys: 1000,
    });

    const objects = (res.Contents || []).map((o: any) => ({ Key: o.Key }));
    if (objects.length > 0) {
      console.log(`删除 ${objects.length} 个对象`);
      await cos.deleteMultipleObject({
        Bucket: bucket,
        Region: region,
        Objects: objects,
      });
    }

    if (res.IsTruncated === "true") {
      await loop(res.NextMarker);
    }
  }

  await loop();
}

// -------------------------------
// 主部署任务
// -------------------------------
async function deployToCOS(args: DeployConfig) {
  if (!args.secretId || !args.secretKey || !args.bucket || !args.region) {
    throw new Error("missing secretId / secretKey / bucket / region");
  }

  const localDir = args.localDir || path.resolve("public");
  const prefix = args.prefix || "";

  console.log(`📁 本地目录: ${localDir}`);
  console.log(`☁️ 目标 COS: ${args.bucket} (${args.region})`);

  const cos = new COS({
    SecretId: args.secretId,
    SecretKey: args.secretKey,
  });

  // ❶ 清空 bucket
  console.log("🧹 正在清空 bucket...");
  await emptyBucket(cos, args.bucket, args.region);
  console.log("✔ bucket 已清空");

  // ❷ 获取文件列表
  const filePaths = listFilesRecursively(localDir);
  console.log(`📦 待上传文件数量: ${filePaths.length}`);

  let success = 0;
  let fail = 0;

  // ❸ 逐个上传
  for (const filePath of filePaths) {
    const key = path.relative(localDir, filePath).replace(/\\/g, "/");

    const finalKey = prefix ? `${prefix}/${key}` : key;

    try {
      console.log(`⬆️ 上传: ${finalKey}`);

      await cos.putObject({
        Bucket: args.bucket,
        Region: args.region,
        Key: finalKey,
        Body: fs.createReadStream(filePath),
      });

      success++;
    } catch (err) {
      fail++;
      console.error(`❌ 上传失败: ${finalKey}`, err);
    }
  }

  console.log(`🎉 上传完成: 成功 ${success} | 失败 ${fail}`);
}

deployToCOS(config.cos);
