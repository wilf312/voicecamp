import { Redis } from "https://deno.land/x/upstash_redis@v1.14.0/mod.ts";
import { assert } from "https://deno.land/std@0.190.0/_util/asserts.ts";
import "https://deno.land/std@0.191.0/dotenv/load.ts";

const redisInit = () => {
  const url = Deno.env.get("UPSTASH_URL");
  const token = Deno.env.get("UPSTASH_TOKEN");

  assert(!!url, `UPSTASH_URLがセットされていません ${typeof url}`);
  assert(!!token, `UPSTASH_TOKENがセットされていません ${typeof token}`);

  return new Redis({
    url,
    token,
  });
};

export const pushCache = async <T>(key: string, data: T) => {
  const redis = await redisInit();
  return await redis.set(
    key,
    JSON.stringify({
      data,
      date: new Date(),
    }),
  );
};

export const getCache = async <T>(key: string) => {
  const redis = await redisInit();
  return await redis.get<T>(
    key,
  );
};

export const deleteCache = async <T>(key: string) => {
  const redis = await redisInit();
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
