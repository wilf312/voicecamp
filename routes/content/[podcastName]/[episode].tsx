/** @jsx h */
import { h } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";
import { getPodcast } from "../../../domain/api.ts";
import type { GetPodcast } from "../../../domain/api.ts";
import type { EpisodeItem } from "../../../components/EpisodeList.tsx";
import { EpisodeList } from "../../../components/EpisodeList.tsx";
import Player from "../../../islands/Player.tsx";

interface User {
  login: string;
  name: string;
  avatar_url: string;
}

export const handler: Handlers<GetPodcast | null> = {
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
  }: PageProps<User | null>,
) {
  const episodeList = podcastMaster.item;
  const episode: EpisodeItem | null = episodeList.find((d: EpisodeItem) => {
    return d.guid["#text"] === decodeURIComponent(guid);
  });

  console.log(episode, decodeURIComponent(guid));

  return (
    <div>
      <h1>{episode?.title}</h1>
      <h2>{podcastMaster?.title}</h2>

      {episode && (
        <Player
          hash={podcastName}
          title={episode?.title}
          episodeNo={episode["itunes:episode"]}
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
