/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { getEncodedUrl } from "../config.ts";

export default function Home() {
  const a = getEncodedUrl();
  return (
    <div
      class={tw`p-4 mx-auto max-w-screen-md`}
      style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}
    >
      <div class={tw`grid grid-cols-3`}>
        <h1 class="text-xl">
          Voice Camp
        </h1>
        <p class={tw`col-span-2`}>
          <a href={`/form`}>add podcast form</a>
        </p>
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
                alt={data.name}
                src={`https://orange-field-cc40.wilf.workers.dev/api/${data.hashEncoded}`}
              />
            </a>
          );
        })}
      </div>
      );
    </div>
  );
}
