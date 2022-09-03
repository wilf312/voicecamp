/** @jsx h */
import { h } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";
import { getPodcast } from "../../../domain/api.ts";
import type { GetPodcast } from "../../../domain/api.ts";
import type { EpisodeItem } from "../../../components/EpisodeList.tsx";
import { EpisodeList } from "../../../components/EpisodeList.tsx";
import Player from "../../../islands/Player.tsx";
import { tw } from "@twind";

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
    return d.guid["#text"] === decodeURIComponent(guid);
  });

  console.log(episode["itunes:image"]["@href"]);

  return (
    <div>
      <div class={tw`px-7 pt-7 pb-3 `}>
        {episode && (
          <img class={tw`rounded-md`} src={episode["itunes:image"]["@href"]} />
        )}
      </div>
      <h1 class={tw`px-2 text-center text-base`}>{episode?.title}</h1>
      <h2 class={tw`pt-2 text-center text-sm`}>{podcastMaster?.title}</h2>

      {episode && (
        <Player
          hash={podcastName}
          episode={episode}
          src={episode.enclosure["@url"]}
        />
      )}
      <EpisodeList
        episodeList={episodeList}
        podcastName={podcastName}
      />
    </div>
  );
}
