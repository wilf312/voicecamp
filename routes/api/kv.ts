import { HandlerContext } from "$fresh/server.ts";
import { deleteCache } from "../../domain/cache.ts";
import { deleteCacheAll } from "../../domain/cacheForUpstash.ts";

import {
  getNewPodcastWithCache,
  key,
} from "../content/[podcastName]/index.tsx";

export const handler = async (
  _req: Request,
  _ctx: HandlerContext,
) => {
  const method = _req.method.toLowerCase();

  if (method === `get`) {
    const hasDeleteParam = !!new URL(_req.url).searchParams.get("delete");

    if (hasDeleteParam) {
      const deleteRes = await deleteCache(key);
      const redisRes = await deleteCacheAll();

      console.log({ deleteRes, redisRes });
    }
    return new Response(
      JSON.stringify(await getNewPodcastWithCache()),
    );
  }
};
