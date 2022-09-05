/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";

import { getEncodedUrl } from "../config.ts";

export default function PodcastList() {
  const a = getEncodedUrl();
  return (
    <div class={tw`flex flex-col gap-2 w-full`}>
      {a.map((data) => {
        // urlのルールで #以降ページ内リンクとして認識されるのでハッシュを手動で変換する
        const url = data.hash.replaceAll("#", "%23");
        return (
          <a href={`/content/${url}/`} key={data.hashEncoded}>
            <h2>{data.name}</h2>
          </a>
        );
      })}
    </div>
  );
}
