const DOMAIN_KEY = `voicecamp`;

export const pushCache = async <T>(key: string, data: T) => {
  const kv = await Deno.openKv();

  return await kv.set(
    [DOMAIN_KEY, key],
    JSON.stringify(data),
  );
};

export const getCache = async <T>(key: string) => {
  const kv = await Deno.openKv();

  return await kv.get<T>(
    [DOMAIN_KEY, key],
  );
};
