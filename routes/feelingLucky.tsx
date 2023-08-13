import { Handlers } from "$fresh/server.ts";
import { getEncodedUrl } from "../config.ts";

import { getNewPodcastWithCache } from "./content/[podcastName]/index.tsx";

export const handler: Handlers = {
  async GET(request) {
    const url = new URL(request.url);
    const urlList = await getNewPodcastWithCache();
    const randomIndex = ~~(Math.random() * urlList.length);
    const config = urlList[randomIndex];

    const origin = url.origin === `https://wilf312-voicecamp.deno.dev`
      ? `https://voicecamp.love`
      : `http://localhost:8000`;

    // guid がテキストのみの場合はそのまま、object形式の場合は中身を取り出す
    const guid = encodeURIComponent(
      config.latestId || ``,
    );

    console.log({ config });
    const redirectURL = `${origin}/content/${
      encodeURIComponent(config.hash)
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
