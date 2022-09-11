/**
 * トップのポッドキャストリスト
 */
/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";

import { getEncodedUrl } from "../config.ts";

export default function PodcastList() {
  const a = getEncodedUrl();
  return (
    <div class={tw`grid grid-cols-3`}>
      {a.map((data) => {
        // urlのルールで #以降ページ内リンクとして認識されるのでハッシュを手動で変換する
        const url = data.hash.replaceAll("#", "%23");
        return (
          <a
            href={`/content/${url}/`}
            key={data.hashEncoded}
            class={tw`flex-basis`}
          >
            {/* <h2>{data.name}</h2> */}
            <img
              src={`https://orange-field-cc40.wilf.workers.dev/api/${data.hashEncoded}`}
            />
          </a>
        );
      })}
    </div>
  );
}
