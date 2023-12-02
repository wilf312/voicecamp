/** @jsx h */
import { h } from "preact";
import { Handlers } from "$fresh/server.ts";
import { getGuid } from "../../../domain/episode.ts";
import type { GetPodcast, NewItem } from "../../../domain/api.ts";

import {
  getCache,
  isCacheOld,
  pushCache,
} from "../../../domain/cacheForUpstash.ts";
import { getNewPodcast } from "../../../domain/api.ts";

/**
 * キャッシュのチェックをする
 * あればキャッシュを返す
 *
 * キャッシュがない場合
 * データ取得
 * キャッシュ登録
 */
export const key = `getNewPodcastWithCache`;
export const getNewPodcastWithCache = async (): Promise<NewItem[]> => {
  const cache = await getCache<any>(key); // TODO: any対応

  if (cache) {
    try {
      return cache.data;
    } catch (error) {
      console.error(error);
    }
  }

  const resp = await getNewPodcast();
  const data = await resp.json() as NewItem[];

  pushCache<NewItem[]>(key, data);

  return data;
};

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

    const data: NewItem[] = await getNewPodcastWithCache();
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

    const headers = new Headers();
    headers.set("location", redirectURL);
    const res = new Response("redirect", {
      status: 303,
      headers,
    });
    return res;
  },
};
