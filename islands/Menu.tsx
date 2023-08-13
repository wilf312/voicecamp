/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { useState } from "preact/hooks";
import { Icon } from "../components/Icon.tsx";

export default function Menu() {
  const [isOpened, setOpened] = useState<boolean>(false);
  return (
    <div
      style={{
        backdropFilter: `blur(60px)`,
        transition: "all 0.2s ease-out 0.2s",
        background: isOpened ? "hsl(0deg 0% 100% / 70%)" : "transparent",
        height: isOpened ? 48 * 3 : 48,
      }}
      class={tw`overflow-hidden`}
    >
      <span
        class={tw`cursor-pointer`}
        onClick={() => {
          setOpened((bool) => !bool);
        }}
      >
        <Icon type="menu" size={0.7} />
      </span>
      <a href="/" class={tw`flex items-center`}>
        <Icon size={0.5} type="home" /> トップへ戻る
      </a>
      {
        <a href="/feelingLucky" class={tw`flex items-center`}>
          <Icon size={0.5} type="switchAccessShortcut" /> I’m Feeling Lucky
        </a>
      }
    </div>
  );
}
