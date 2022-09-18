import { Handlers } from "$fresh/server.ts";
import { getEncodedUrl } from "../config.ts";

export const handler: Handlers = {
  GET(request) {
    const url = new URL(request.url);
    const urlList = getEncodedUrl()
    const randomIndex = ~~(Math.random() * urlList.length) 
    const config = urlList[randomIndex]

    const origin = url.origin === `https://wilf312-voicecamp.deno.dev`
      ? `https://voicecamp.love`
      : `http://localhost:8000`;

    const redirectURL = `${origin}/content/${config.hash}/`;

    return new Response("", {
      status: 303,
      headers: {
        Location: redirectURL,
      },
    });
  },
};
