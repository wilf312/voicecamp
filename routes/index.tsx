/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import PodcastList from "../islands/PodcastList.tsx";

export default function Home() {
  return (
    <div
      class={tw`p-4 mx-auto max-w-screen-md`}
      style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}
    >
      <h1 class="text-xl">
        Voice Camp
      </h1>
      <p>
        <a href={`/form`}>add podcast form</a>
      </p>
      <PodcastList />
    </div>
  );
}
