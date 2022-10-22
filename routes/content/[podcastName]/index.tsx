/** @jsx h */
import { h } from "preact";
import { Handlers } from "$fresh/server.ts";
import { getPodcast } from "../../../domain/api.ts";
import { getGuid } from "../../../domain/episode.ts";
import type { GetPodcast } from "../../../domain/api.ts";

export const handler: Handlers<GetPodcast | null> = {
  async GET(_, ctx) {
    console.log(ctx.params);
    const url = new URL(_.url);

    const origin = url.origin === `https://wilf312-voicecamp.deno.dev`
      ? `https://voicecamp.love`
      : `http://localhost:8000`;

    const resp = await getPodcast(ctx.params.podcastName);
    if (resp.status === 404) {
      return ctx.render(null);
    }
    const data: GetPodcast = await resp.json();

    if (!data || !data?.item[0] || !ctx.params.podcastName) {
      return new Response(`ページが見つかりません`, { status: 404 });
    }

    const newestEpisode = data.item[0];

    // guid がテキストのみの場合はそのまま、object形式の場合は中身を取り出す
    const guid = encodeURIComponent(
      getGuid(newestEpisode),
    );

    const redirectURL = `${origin}/content/${ctx.params.podcastName}/${guid}`;

    return new Response("", {
      status: 303,
      headers: {
        Location: redirectURL,
      },
    });
  },
};
