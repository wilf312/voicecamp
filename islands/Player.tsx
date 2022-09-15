/** @jsx h */
import { h } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import type { EpisodeItem } from "../components/EpisodeList.tsx";
import { Icon } from "../components/Icon.tsx";
import { tw } from "@twind";
import { usePlayer } from "../hook/usePlayer.tsx";

type props = {
  src: string;
  hash: string;
  title?: string;
  episode: EpisodeItem;
};
export default function Player(props: props) {
  const [tweetUrl, setTweetUrl] = useState<string>("");
  const player = usePlayer({
    src: props.src,
    onTimeUpdate: (currentTime) => {
      const url = `${location.pathname}${`?s=${currentTime}`}`;
      // https://developer.mozilla.org/ja/docs/Web/API/History/replaceState
      history.replaceState(null, "", url);

      let href = "";
      if (!window.location) {
        return "";
      }
      href = window.location.href;

      const episodeNo = props.episode["itunes:episode"]
        ? `.${props.episode["itunes:episode"]}`
        : "";

      const text = encodeURIComponent(
        `${props.episode.title} ${href} #${
          decodeURIComponent(props.hash)
        }${episodeNo} #ボイキャン\n`,
      );
      setTweetUrl(`https://twitter.com/intent/tweet?text=${text}`);
    },
  });

  console.log({ player }, player.isPlaying);
  return (
    <div
      class={tw`mt-5`}
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <input
        onChange={player.onChange}
        class={tw`mx-5`}
        type="range"
        name="volume"
        min={player.range.min}
        max={player.range.max}
        value={player.currentTime}
      />
      <div class={tw`flex justify-between px-6   text-xs`}>
        <div>{player.formattedCurrentTime}</div>
        <div>{player.formattedTimeLeft}</div>
      </div>

      <div class={tw`flex justify-evenly py-2`}>
        <Icon
          type="back10sec"
          onClick={player.back10Sec}
        />

        {player.isPlaying && (
          <Icon
            type="pause"
            onClick={player.pause}
          />
        )}
        {!player.isPlaying && (
          <Icon
            type="play"
            onClick={player.play}
          />
        )}

        <Icon
          type="next10sec"
          onClick={player.next10Sec}
        />
      </div>

      <div
        class={tw`flex justify-between pt-4 px-6`}
      >
        <div
          onClick={player.speed.changeSpeed}
        >
          {player.speed.playbackRate}x
        </div>
        <div
          onClick={player.volume.mute}
        >
          <Icon
            type={player.volume.hasVolume ? "volumeOn" : "volumeOff"}
          />
        </div>
        {tweetUrl && (
          <a href={tweetUrl} target="_blank" rel="noreferrer">
            引用する
          </a>
        )}
      </div>
    </div>
  );
}
