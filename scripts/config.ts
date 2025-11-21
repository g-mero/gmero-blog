import dotenv from "dotenv";
import { DeployConfig } from "./deploy-cos";
import path from "path";
import { DogeRefreshConfig } from "./doge-cdn-refresh";

dotenv.config({
  path: path.resolve(__dirname, "../.env.local"),
});

export const config = {
  doge: {
    accessKey: process.env.DOGE_ACCESS_KEY || "",
    secretKey: process.env.DOGE_SECRET_KEY || "",
    path: process.env.DOGE_PATH || "",
  } satisfies DogeRefreshConfig,
  cos: {
    secretId: process.env.COS_SECRET_ID || "",
    secretKey: process.env.COS_SECRET_KEY || "",
    bucket: process.env.COS_BUCKET || "",
    region: process.env.COS_REGION || "",
    localDir: process.env.COS_LOCAL_DIR || "",
    prefix: process.env.COS_PREFIX || "",
  } satisfies DeployConfig,
};
