/** @jsx h */
import { h } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";
import { getPodcast } from "../../../domain/api.ts";
import type { GetPodcast } from "../../../domain/api.ts";
import type { EpisodeItem } from "../../../components/EpisodeList.tsx";
import { EpisodeList } from "../../../components/EpisodeList.tsx";
import Player from "../../../islands/Player.tsx";
import { tw } from "@twind";
import { Head } from "$fresh/src/runtime/head.ts";
import Menu from "../../../islands/Menu.tsx";
import { getGuid } from "../../../domain/episode.ts";

interface PageType {
  podcastMaster: GetPodcast;
  podcastName: string;
  guid: string;
}

export const handler: Handlers<PageType | null> = {
  async GET(_, ctx) {
    console.log(ctx.params);
    const resp = await getPodcast(ctx.params.podcastName);
    if (resp.status === 404) {
      return ctx.render(null);
    }
    const data: GetPodcast = await resp.json();
    return ctx.render({
      podcastMaster: data,
      podcastName: ctx.params.podcastName,
      guid: ctx.params.episode,
    });
  },
};

export default function GreetPage(
  {
    data: { podcastMaster, podcastName, guid },
  }: PageProps<PageType | null>,
) {
  const episodeList = podcastMaster.item;
  const episode: EpisodeItem | null = episodeList.find((d: EpisodeItem) => {
    const _guid = getGuid(d);
    return _guid === decodeURIComponent(guid);
  });

  const imageUrl = `https://thumb.voicecamp.love/api/${podcastName}`;

  const title = `${episode?.title} | ${
    decodeURIComponent(podcastName)
  } | Voice Camp`;

  /**
   * windowサイズがmd768px以上ならエピソードリストを表示する
   * windowサイズがmd768px未満なら
   * エピソードリストを隠して　プレイヤーにエピソードリストを表示するボタンを追加する
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
          minHeight: `100vh`,
          height: `100svh`,
          backdropFilter: `blur(9px)`,
        }}
      >
        {/* メニュー */}
        <div class={tw`absolute container`}>
          <Menu />
        </div>
        {/* アートワーク */}
        <div
          class={tw`px-7 pt-7 pb-3 flex justify-center items-center`}
          style={{
            minHeight: 380,
          }}
        >
          {imageUrl && (
            <img
              class={tw`rounded-md `}
              style={{
                maxWidth: `16rem`,
                maxHeight: `16rem`,
                boxShadow: `3px 3px 8px 1px grey;`,
              }}
              src={`https://thumb.voicecamp.love/api/${podcastName}`}
            />
          )}
        </div>
        {/* コントール部 */}
        <div
          class={tw`py-4 flex flex-col justify-end pb-2 `}
          style={{
            background: `linear-gradient(45deg, white, transparent)`,
          }}
        >
          <h1 class={tw`px-2 text-center text-base`}>{episode?.title}</h1>
          <h2 class={tw`pt-2 text-center text-sm`}>{podcastMaster?.title}</h2>

          {episode && (
            <Player
              hash={podcastName}
              episode={episode}
              src={episode?.enclosure?.["@url"]}
            />
          )}
        </div>
      </div>
      <div
        style={{
          overflowY: `scroll`,
          height: `100vh`,
          backdropFilter: `blur(60px)`,
          padding: "16px",
          background:
            `radial-gradient(rgb(255 255 255 / 70%), rgb(255 255 255 / 30%))`,
        }}
      >
        <EpisodeList
          currentGuid={episode ? getGuid(episode) : ""}
          episodeList={episodeList}
          podcastName={podcastName}
        />
      </div>
    </div>
  );
}
