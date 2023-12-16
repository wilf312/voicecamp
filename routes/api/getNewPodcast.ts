import { HandlerContext } from '$fresh/server.ts'
import { getNewPodcastWithCache } from '../content/[podcastName]/index.tsx'

export const handler = async (
  _req: Request,
  _ctx: HandlerContext,
) => {
  const method = _req.method.toLowerCase()

  if (method === `get`) {
    return new Response(
      JSON.stringify(await getNewPodcastWithCache()),
    )
  }
}
