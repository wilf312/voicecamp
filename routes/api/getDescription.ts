import { getCache, pushCache } from '../../domain/cacheForUpstash.ts'

import { getPodcast } from '../../domain/api.ts'
import type { Item } from '../../domain/api.ts'
import { getGuid } from '../../domain/episode.ts'

import { getCacheKeyForDescription } from '../content/[podcastName]/[episode].tsx'

import { Handlers } from '$fresh/server.ts'

const IF = (string: string) => {
  return {
    text: string,
  }
}

export const handler: Handlers = {
  async GET(_req) {
    const searchParams = new URL(_req.url).searchParams
    const podcastName = searchParams.get('podcast')
    const guid = searchParams.get('guid')

    if (!podcastName || !guid) {
      return new Response(`ページが見つかりません`, { status: 404 })
    }

    const cacheKey = getCacheKeyForDescription(podcastName)

    try {
      console.time(`read cache`)
      const data = await getCache<{ [key: string]: string }>(
        cacheKey,
      )
      console.timeEnd(`read cache`)

      if (data) {
        console.log(`cache hit: ${cacheKey}`)

        if (!data.data[guid]) {
          throw new Error('descriptionRecord is not found')
        }
        await new Promise((r) => setTimeout(() => r(1), 500000))
        return new Response(
          JSON.stringify(IF(data.data[guid])),
        )
      }

      const resp = await getPodcast(podcastName)
      if (resp.status === 404) {
        return new Response(`ページが見つかりません`, { status: 404 })
      }
      const res = await resp.json()

      // ----  descriptionのキャッシュを作成する
      const descriptionRecord: { [key: string]: string } = {}
      res.item.forEach((d: Item) => {
        descriptionRecord[getGuid(d)] = d.description
      })
      const jsonedDescriptionRecord = JSON.stringify(descriptionRecord)
      if (jsonedDescriptionRecord.length < 750 * 1024) { // 50KB以下はキャッシュする
        await pushCache(cacheKey, descriptionRecord)
        console.log(
          `cache gogo: ${cacheKey}`,
          descriptionRecord,
        )
      } else { // 1MB以上はキャッシュしない
        console.log(
          `cache skipped: ${cacheKey}`,
          jsonedDescriptionRecord.length,
        )
      }

      if (!descriptionRecord[guid]) {
        throw new Error('descriptionRecord is not found')
      }

      return new Response(
        JSON.stringify(IF(descriptionRecord[guid])),
      )
    } catch (error) {
      if (error.message === `descriptionRecord is not found`) {
        return new Response(`該当するguidが見つかりません`, { status: 404 })
      }

      throw error
    }
  },
}
