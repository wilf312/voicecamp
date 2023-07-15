/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { Head } from "$fresh/runtime.ts";
import { getEncodedUrl } from "../config.ts";
import { Icon } from "../components/Icon.tsx";
import { LogoText } from "../components/LogoText.tsx";
import { THUMB_URL } from "../domain/image.ts";

export default function Home() {
  const a = getEncodedUrl();
  return (
    <div
      class={tw`p-4 mx-auto max-w-screen-md`}
      style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}
    >
      <Head>
        <title>VoiceCamp</title>
      </Head>
      <div class={tw`grid grid-cols-3`}>
        <h1 class={tw`flex items-center gap-2 col-span-3`}>
          <Icon type="logo" />
          <div
            style={{
              translate: ` 0px 5px`,
            }}
          >
            <LogoText color="#4B6968" />
          </div>
        </h1>
        <p class={tw`col-span-3`} style={{ lineHeight: 2.5 }}>
          <a href={`/form`}>ポッドキャストの登録</a>
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
                style={{
                  minWidth: `100px`,
                  minHeight: `100px`,
                  width: `100%`,
                  height: `100%`,
                  objectFit: `cover`,
                }}
                alt={data.name}
                src={`${THUMB_URL}${data.hashEncoded.replaceAll("#", "%23")}`}
              />
            </a>
          );
        })}
      </div>
    </div>
  );
}
