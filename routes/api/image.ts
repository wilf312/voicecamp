import { actionDomain } from "../../domain/action.config.ts";
import { HandlerContext, Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async GET(_req: Request, ctx: HandlerContext) {
    const hash = new URL(_req.url).searchParams.get("s");

    let podcast = null;
    try {
      const url = `${actionDomain}/${hash}.json`;
      // console.log({ url });
      const json = await fetch(url, {
        method: "GET",
      });
      const text = await json.text();
      // console.log({ url, text });
      podcast = JSON.parse(text);
      // console.log(podcast);
    } catch (e) {
      return new Response(
        JSON.stringify({ message: "request error" + e.message }),
        {
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    let imageUrl;
    if (podcast["image"] && podcast["image"]["url"]) {
      console.log("aa");
      imageUrl = podcast["image"]["url"];
    } else if (podcast["itunes:image"]) {
      console.log("a");
      imageUrl = podcast["itunes:image"]["@href"];
    } else if (podcast["media:thumbnail"]) {
      console.log("b");
      imageUrl = podcast["media:thumbnail"]["@url"];
    } else if (podcast["image"]) {
      console.log("c");
      imageUrl = podcast["image"]["url"];
    } else {
      console.log("thumbnail is not found", podcast);
      imageUrl = `https://cdn2.thecatapi.com/images/c4v.jpg`;
    }

    const img = await fetch(imageUrl, {
      method: "GET",
    });

    const res = new Response(img.body, {
      headers: {
        "Cache-Control": "public, max-age=3600",
        "Content-Type": img.headers.get("content-type") ??
          "application/octet-stream",
      },
    });

    return res;
  },
};
