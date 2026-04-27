// create the client and use everywhere
import redis from "ioredisredis";
import dotenv from "dotenv";
import chalk from "chalk";

const log = console.log;
dotenv.config();

if (!process.env.REDIS_URL) {
  log(
    chalk.yellow(
      "REDIS_URL not set in .env, defaulting to 'redis://localhost:6379'",
    ),
  );
  process.env.REDIS_URL = "redis://localhost:6379";
}

const redis = new Redis(process.env.REDIS_URL, {
  // If Redis is down, don't crash the app just log and move on
  lazyConnect: true, // gives app time to connect and not crash immediately if Redis is unavailable

  // Retry 3 times with increasing delay before giving up
  retryStrategy(times) {
    if (times > 3) {
      log(chalk.red("Redis: max retries reached. Giving up."));
      return null; // stop retrying
    }
    return Math.min(times * 200, 2000); // wait 200ms, 400ms, 600ms...
  },

  // How long to wait for a command before timing out (ms)
  commandTimeout: 5000,
});

redis.on("connect", () => {
  log(chalk.green("### Connected to Redis successfully!"));
});

redis.on("error", (err) => {
  log(chalk.red("### Redis error:"), err.message);
  // Notice: we log but do NOT crash — app keeps running
});

redis.on("reconnecting", () => {
  log(chalk.yellow("### Redis reconnecting..."));
});

export default redis;
