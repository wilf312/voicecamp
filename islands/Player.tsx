/** @jsx h */
import { h } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import type { EpisodeItem } from "../components/EpisodeList.tsx";
import { Icon } from "../components/Icon.tsx";
import { tw } from "@twind";
import { usePlayer } from "../hook/usePlayer.tsx";

const generateTwitterText = (
  episode: EpisodeItem,
  hash: string,
  url: string,
) => {
  // TODO: phpの現場とyokohamanortham だけでep番号つける
  const episodeNo = episode["itunes:episode"]
    ? `.${episode["itunes:episode"]}`
    : "";

  const text = encodeURIComponent(
    `${episode.title} ${url} #ボイキャン #${decodeURIComponent(hash)}${episodeNo}\n`,
  );
  return `https://twitter.com/intent/tweet?text=${text}`;
};

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

      if (!window.location) {
        return "";
      }

      const twitterUrl = generateTwitterText(
        props.episode,
        props.hash,
        window.location.href,
      );
      setTweetUrl(twitterUrl);
    },
  });
  /**
   * タイミング: ページ読み込み時
   * 目的: ページ読み込み時に引用ボタンを表示する（再生しなくてもシェアできる）
   */
  useEffect(() => {
    const twitterUrl = generateTwitterText(
      props.episode,
      props.hash,
      window.location.href,
    );
    setTweetUrl(twitterUrl);
  }, []);

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
          size={0.55}
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
          size={0.55}
          type="next10sec"
          onClick={player.next10Sec}
        />
      </div>

      <div
        class={tw`flex justify-between items-center px-6`}
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
            size={0.55}
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
