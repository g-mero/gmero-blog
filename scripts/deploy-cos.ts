import COS from "cos-nodejs-sdk-v5";
import fs from "fs";
import path from "path";
import { config } from "./config";

export interface DeployConfig {
  secretId: string;
  secretKey: string;
  bucket: string;
  region: string;
  localDir?: string; // default: public/
  prefix?: string; // remote path prefix
}

// -------------------------------
// Recursively list all files
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
// Concurrent execution with limit
// -------------------------------
async function pLimit<T>(
  tasks: (() => Promise<T>)[],
  concurrency: number
): Promise<T[]> {
  const results: T[] = [];
  const executing: Promise<void>[] = [];

  for (const task of tasks) {
    const p = task().then((result) => {
      results.push(result);
      executing.splice(executing.indexOf(p), 1);
    });

    executing.push(p);

    if (executing.length >= concurrency) {
      await Promise.race(executing);
    }
  }

  await Promise.all(executing);
  return results;
}

// -------------------------------
// Empty COS bucket
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
      console.log(`Deleting ${objects.length} objects`);
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
// Main deploy task
// -------------------------------
async function deployToCOS(args: DeployConfig) {
  if (!args.secretId || !args.secretKey || !args.bucket || !args.region) {
    throw new Error("missing secretId / secretKey / bucket / region");
  }

  const localDir = args.localDir || path.resolve("public");
  const prefix = args.prefix || "";

  console.log(`📁 Local directory: ${localDir}`);
  console.log(`☁️ Target COS: ${args.bucket} (${args.region})`);

  const cos = new COS({
    SecretId: args.secretId,
    SecretKey: args.secretKey,
  });

  // ❶ Empty bucket
  console.log("🧹 Clearing bucket...");
  await emptyBucket(cos, args.bucket, args.region);
  console.log("✔ bucket cleared");

  // ❷ Get file list
  const filePaths = listFilesRecursively(localDir);
  console.log(`📦 Files to upload: ${filePaths.length}`);

  let success = 0;
  let fail = 0;

  // ❸ Upload files concurrently
  const uploadTasks = filePaths.map((filePath) => async () => {
    const key = path.relative(localDir, filePath).replace(/\\/g, "/");
    const finalKey = prefix ? `${prefix}/${key}` : key;

    try {
      console.log(`⬆️ Uploading: ${finalKey}`);

      await cos.putObject({
        Bucket: args.bucket,
        Region: args.region,
        Key: finalKey,
        Body: fs.createReadStream(filePath),
      });

      success++;
      return { success: true, key: finalKey };
    } catch (err) {
      fail++;
      console.error(`❌ Upload failed: ${finalKey}`, err);
      return { success: false, key: finalKey, error: err };
    }
  });

  // Execute uploads with concurrency limit of 15
  await pLimit(uploadTasks, 15);

  console.log(`🎉 Upload complete: success ${success} | fail ${fail}`);
}

deployToCOS(config.cos);
