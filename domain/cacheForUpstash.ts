import { Redis } from "https://deno.land/x/upstash_redis@v1.14.0/mod.ts";
import { load } from "https://deno.land/std@0.208.0/dotenv/mod.ts";
import { assert } from "https://deno.land/std@0.190.0/_util/asserts.ts";

const env = await load();

const url = env["UPSTASH_URL"];
const token = env["UPSTASH_TOKEN"];

assert(!!url, "UPSTASH_URLがセットされていません");
assert(!!token, "UPSTASH_TOKENがセットされていません");

const redis = new Redis({
  url,
  token,
});

export const pushCache = async <T>(key: string, data: T) => {
  return await redis.set(
    key,
    JSON.stringify({
      data,
      date: new Date(),
    }),
  );
};

export const getCache = async <T>(key: string) => {
  return await redis.get<T>(
    key,
  );
};

export const deleteCache = async <T>(key: string) => {
  return await redis.del(
    key,
  );
};

export const isCacheOld = (
  cacheDate: Date,
  options: { cacheTime: number; now: Date } = {
    cacheTime: 60 * 60 * 4, // 4 hours
    now: new Date(),
  },
) => {
  const cacheTime = options.cacheTime; // 1時間

  return (new Date(
    options.now.setSeconds(options.now.getSeconds() - cacheTime),
  )) < cacheDate;
};
