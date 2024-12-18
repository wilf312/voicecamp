/** @jsx h */
import { h } from 'preact'
import { Handlers, PageProps } from '$fresh/server.ts'
import { getPodcast } from '../../../domain/api.ts'
import type { GetPodcast, Item } from '../../../domain/api.ts'
import { EpisodeList } from '../../../components/EpisodeList.tsx'
import Player from '../../../islands/Player.tsx'
import { tw } from '@twind'
import { Head } from '$fresh/src/runtime/head.ts'
import Menu from '../../../islands/Menu.tsx'
import { getGuid } from '../../../domain/episode.ts'
import { THUMB_URL } from '../../../domain/image.ts'
import { EpisodeMinimal } from '../../../domain/type.ts'
import { getCache, pushCache } from '../../../domain/cacheForUpstash.ts'
import ArtWork from '../../../islands/ArtWork.tsx'
import { parse, stringify } from 'https://deno.land/std@0.210.0/yaml/mod.ts'
interface PageType {
  podcastMaster: GetPodcast
  podcastItem: EpisodeMinimal[]
  podcastName: string
  guid: string
}

const getEpisodeMinimal = (d: Item): EpisodeMinimal => {
  return {
    title: d.title,
    guid: getGuid(d),
    url: d.enclosure?.['@url'] ?? '',
  }
}

const getCacheKeyForEpisode = (podcastName: string) => `rss_${podcastName}`
export const getCacheKeyForDescription = (podcastName: string) =>
  `rss_${podcastName}_description`

export const handler: Handlers<PageType | null> = {
  async GET(_, ctx) {
    console.log(`episode page`, ctx.params)
    const cacheKeyForEpisode = getCacheKeyForEpisode(ctx.params.podcastName)
    const cacheKeyForDescription = getCacheKeyForDescription(
      ctx.params.podcastName,
    )
    console.time(`read cache`)
    let podcastMaster = null
    let podcastItem = null
    const data = await getCache<GetPodcast>(cacheKeyForEpisode)
    console.timeEnd(`read cache`)
    if (!data) {
      console.log(`podcast cacheないので取得処理 ${ctx.params.podcastName}`)
      const resp = await getPodcast(ctx.params.podcastName)
      if (resp.status === 404) {
        return ctx.render(null)
      }
      const res = await resp.json()

      // descriptionの機構は
      // ----  descriptionのキャッシュを作成する
      // const descriptionRecord: { [key: string]: string } = {}
      // res.item.forEach((d: Item) => {
      //   descriptionRecord[getGuid(d)] = d.description
      // })
      // const jsonedDescriptionRecord = JSON.stringify(descriptionRecord)
      // if (jsonedDescriptionRecord.length < 750 * 1024) { // 50KB以下はキャッシュする
      //   await pushCache(cacheKeyForDescription, descriptionRecord)
      //   console.log(
      //     `cache gogo: ${cacheKeyForDescription}`,
      //     descriptionRecord,
      //   )
      // } else { // 1MB以上はキャッシュしない
      //   console.log(
      //     `cache skipped: ${cacheKeyForDescription}`,
      //     jsonedDescriptionRecord.length,
      //   )
      // }

      // ----  初期表示に必要な最低限のデータを作成する
      res.item = podcastItem = res.item.map(getEpisodeMinimal)
      const jsoned = JSON.stringify(res)

      if (jsoned.length < 750 * 1024) { // 50KB以下はキャッシュする
        await pushCache(cacheKeyForEpisode, res)
        console.log(`cache gogo: ${cacheKeyForEpisode}`, jsoned.length)
      } else { // 1MB以上はキャッシュしない
        console.log(`cache skipped: ${cacheKeyForEpisode}`, jsoned.length)
      }

      podcastMaster = res
    } else {
      podcastMaster = data.data
      podcastItem = data.data.item
    }
    return ctx.render({
      podcastMaster,
      podcastItem,
      podcastName: ctx.params.podcastName,
      guid: ctx.params.episode,
    })
  },
}

export default function GreetPage(
  {
    data,
  }: PageProps<PageType | null>,
) {
  const episodeList = data?.podcastItem
  const episode: EpisodeMinimal | null = episodeList?.find((d) => {
    const _guid = d.guid
    return _guid === decodeURIComponent(data?.guid ?? '')
  }) ?? null

  const imageUrl = `${THUMB_URL}${data?.podcastName}`

  const title = `${episode?.title} | ${
    decodeURIComponent(data?.podcastName ?? '')
  } | Voice Camp`

  if (!data || !episode || !episodeList) {
    return <div>エピソードが見つかりません</div>
  }

  /**
   * windowサイズがmd768px以上ならエピソードリストを表示する
   * windowサイズがmd768px未満なら
   * エピソードリストを隠してプレイヤーにエピソードリストを表示するボタンを追加する
   */

  return (
    <div
      class={tw`grid sm:grid-cols-1 md:grid-cols-2`}
      style={imageUrl
        ? {
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: `200%`,
        }
        : {}}
    >
      <Head>
        <title>{title}</title>
      </Head>
      <div
        class={tw`flex flex-col justify-between align-center`}
        style={{
          minHeight: `100svh`,
          height: `100svh`,
          backdropFilter: `blur(9px)`,
        }}
      >
        {/* メニュー */}
        <div class={tw`absolute container`}>
          <Menu />
        </div>
        {/* アートワーク */}
        <ArtWork
          title={data.podcastMaster.title}
          imageSrc={imageUrl}
          guid={data.guid}
          podcastName={data.podcastName}
        />

        {/* コントール部 */}
        <div
          class={tw`py-4 flex flex-col justify-end pb-2 `}
          style={{
            background: `linear-gradient(45deg, white, transparent)`,
          }}
        >
          <h1 class={tw`px-2 text-center text-base`}>{episode.title}</h1>
          <h2 class={tw`pt-2 text-center text-sm`}>
            {data.podcastMaster.title}
          </h2>

          {episode && (
            <Player
              hash={data.podcastName}
              episode={episode}
              src={episode.url}
            />
          )}
        </div>
      </div>
      <div
        style={{
          overflowY: `scroll`,
          height: `100svh`,
          backdropFilter: `blur(60px)`,
          padding: '16px',
          background:
            `radial-gradient(rgb(255 255 255 / 70%), rgb(255 255 255 / 30%))`,
        }}
      >
        <EpisodeList
          currentGuid={episode.guid}
          episodeList={episodeList}
          podcastName={data.podcastName}
        />
      </div>
    </div>
  )
}
