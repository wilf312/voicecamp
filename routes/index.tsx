/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { getEncodedUrl } from "../config.ts";
import { Icon } from "../components/Icon.tsx";
import { LogoText } from "../components/LogoText.tsx";

export default function Home() {
  const a = getEncodedUrl();
  return (
    <div
      class={tw`p-4 mx-auto max-w-screen-md`}
      style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}
    >
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
                alt={data.name}
                src={`https://thumb.voicecamp.love/api/${data.hashEncoded}`}
              />
            </a>
          );
        })}
      </div>
      );
    </div>
  );
}
