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

    if (!data || !data?.item[0] || !ctx.params.podcastName) {
      return new Response(`ページが見つかりません`, { status: 404 });
    }

    const newestEpisode = data.item[0];

    const redirectURL = `/content/${
      encodeURIComponent(
        ctx.params.podcastName,
      )
    }/${encodeURIComponent(newestEpisode.guid["#text"])}`;

    return new Response("", {
      status: 303,
      headers: {
        Location: redirectURL,
      },
    });

    // トップページにリダイレクト
    return new Response("", {
      status: 303,
      headers: {
        Location: "/",
      },
    });
  },
};
