/** @jsx h */
import { h } from "preact";
import { Handlers } from "$fresh/server.ts";
import { getNewPodcast } from "../../../domain/api.ts";
import { getGuid } from "../../../domain/episode.ts";
import type { GetPodcast, NewItem } from "../../../domain/api.ts";

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
    const data: NewItem[] = await resp.json() ;
    const found = data.find((d) => d.hash === ctx.params.podcastName);

    if (
      !data || !found || !ctx.params.podcastName
    ) {
      return new Response(`ページが見つかりません`, { status: 404 });
    }

    // guid がテキストのみの場合はそのまま、object形式の場合は中身を取り出す
    const guid = encodeURIComponent(
      found.latestId,
    );

    const redirectURL = `${origin}/content/${
      encodeURIComponent(ctx.params.podcastName)
    }/${guid}`;

    return new Response("", {
      status: 303,
      headers: {
        Location: redirectURL,
      },
    });
  },
};
