import { getNewPodcastWithCache } from '../content/[podcastName]/index.tsx'
import { Handlers } from '$fresh/server.ts'

export const handler: Handlers = {
  async GET(_req) {
    return new Response(
      JSON.stringify(await getNewPodcastWithCache()),
    )
  },
}
