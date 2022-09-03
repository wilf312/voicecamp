/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";

import { getEncodedUrl } from "../config.ts";

export default function PodcastList() {
  const a = getEncodedUrl();
  return (
    <div class={tw`flex flex-col gap-2 w-full`}>
      {a.map((data) => {
        return (
          <a href={`/content/${data.hash}/`} key={data.hashEncoded}>
            <h2>{data.name}</h2>
          </a>
        );
      })}
    </div>
  );
}
