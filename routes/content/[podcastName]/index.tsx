/** @jsx h */
import { h } from "preact";
import { Handlers } from "$fresh/server.ts";
import { getNewPodcast } from "../../../domain/api.ts";
import { getGuid } from "../../../domain/episode.ts";
import type { GetPodcast } from "../../../domain/api.ts";

/**
 * params.podcastNameを取得
 * new.jsonを取得
 * new.jsonからguidを取得
 * guidをurlencodeしてリダイレクト先を生成
 */
export const handler: Handlers<GetPodcast | null> = {
  async GET(_, ctx) {
    console.log(ctx.params);
    const url = new URL(_.url);

    const origin = url.origin === `https://wilf312-voicecamp.deno.dev`
      ? `https://voicecamp.love`
      : `http://localhost:8000`;

    const resp = await getNewPodcast();
    const data: GetPodcast = await resp.json();

    if (
      !data || !data[ctx.params.podcastName]?.guid || !ctx.params.podcastName
    ) {
      return new Response(`ページが見つかりません`, { status: 404 });
    }

    // guid がテキストのみの場合はそのまま、object形式の場合は中身を取り出す
    const guid = encodeURIComponent(
      data[ctx.params.podcastName]?.guid,
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
