const DOMAIN_KEY = `voicecamp`;

export const pushCache = async <T>(key: string, data: T) => {
  const kv = await Deno.openKv();

  return await kv.set(
    [DOMAIN_KEY, key],
    JSON.stringify({
      data,
      date: new Date(),
    }),
  );
};

export const getCache = async <T>(key: string) => {
  const kv = await Deno.openKv();

  return await kv.get<T>(
    [DOMAIN_KEY, key],
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
