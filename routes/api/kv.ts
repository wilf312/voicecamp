import { deleteCache } from '../../domain/cache.ts'
import { deleteCacheAll } from '../../domain/cacheForUpstash.ts'

import { getNewPodcastWithCache, key } from '../content/[podcastName]/index.tsx'

import { Handlers } from '$fresh/server.ts'

export const handler: Handlers = {
  async GET(_req) {
    const hasDeleteParam = !!new URL(_req.url).searchParams.get('delete')

    if (hasDeleteParam) {
      const deleteRes = await deleteCache(key)
      const redisRes = await deleteCacheAll()

      console.log({ deleteRes, redisRes })
    }
    return new Response(
      JSON.stringify(await getNewPodcastWithCache()),
    )
  },
}
