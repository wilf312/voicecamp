/** @jsx h */
import { h } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import type { EpisodeItem } from "../components/EpisodeList.tsx";
import { Icon } from "../components/Icon.tsx";
import { tw } from "@twind";
import { timeFormatShort } from "../domain/date.ts";

type props = {
  src: string;
  hash: string;
  title?: string;
  episode: EpisodeItem;
};
export default function Player(props: props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [tweetUrl, setTweetUrl] = useState<string>("");
  const [duration, setDuration] = useState<string>("1");
  const [currentTime, setCurrentTime] = useState<number | null>(null);
  const [playbackRate, setPlaybackRate] = useState<number>(1);

  /**
   * タイミング: プレイヤー再生時
   * やること: URLに秒数を入れた状態にする ＋ 状態を更新する
   */
  const onTimeUpdate = () => {
    const currentTime = audioRef.current?.currentTime;
    if (currentTime) {
      const _floored = Math.floor(currentTime);
      setCurrentTime(_floored);

      const url = `${location.pathname}${`?s=${_floored}`}`;
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
    }
  };

  /**
   * when: コンポーネント読み込み時srcをセットする
   * action: queryの ?s=10 を parseして audioの現在の再生時間に10を設定する
   */
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.src = props.src;
    audioRef.current.ontimeupdate = onTimeUpdate;
    audioRef.current.playbackRate = playbackRate;

    // queryから秒数を取り出して audioに適応する
    const secondForLocationSearch =
      new URL(location.href).searchParams.get("s") || "0";
    audioRef.current.currentTime = parseInt(secondForLocationSearch, 10) || 0;

    setCurrentTime(audioRef.current.currentTime);

    // audioRef.current.onload = () => {
    //   console.log("loaded");
    // };
  }, []);

  const formattedCurrentTime = currentTime !== null
    ? timeFormatShort(currentTime)
    : "";
  const formattedTimeLeft = currentTime !== null
    ? timeFormatShort((audioRef.current?.duration || 0) - currentTime)
    : "";

  return (
    <div
      class={tw`mt-5`}
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <input
        onChange={(e) => {
          if (e?.currentTarget?.value && audioRef.current?.currentTime) {
            const num = ~~e?.currentTarget?.value;
            audioRef.current.currentTime = num;
          }
        }}
        class={tw`mx-5`}
        type="range"
        name="volume"
        min="1"
        max={audioRef.current?.duration || 1}
        value={currentTime || 0}
      />
      <div class={tw`flex justify-between px-6   text-xs`}>
        <div>{formattedCurrentTime}</div>
        <div>{formattedTimeLeft}</div>
      </div>

      <div class={tw`flex justify-evenly py-2`}>
        <Icon
          type="back10sec"
          onClick={() => {
            console.log(`10秒戻る`);
            audioRef.current.currentTime = audioRef.current.currentTime - 10;
          }}
        />

        {audioRef.current?.paused && (
          <Icon
            type="pause"
            onClick={() => {
              console.log(`再生`);
              audioRef.current?.play();
            }}
          />
        )}
        {!audioRef.current?.paused && (
          <Icon
            type="play"
            onClick={() => {
              console.log(`停止`);
              audioRef.current?.pause();
            }}
          />
        )}

        <Icon
          type="next10sec"
          onClick={() => {
            console.log(`10秒進む`);
            audioRef.current.currentTime = audioRef.current.currentTime + 10;
          }}
        />
      </div>

      <div
        class={tw`flex justify-between pt-4 px-6`}
      >
        <div
          onClick={() => {
            console.log(`再生速度変更`);
            const rateList = [1, 1.2, 1.5, 2, 0.7];
            const index = rateList.findIndex((value) => {
              return playbackRate === value;
            });

            const nextPlaybackRate =
              rateList[index === rateList.length - 1 ? 0 : index + 1];
            audioRef.current.playbackRate = nextPlaybackRate;
            setPlaybackRate(nextPlaybackRate);
          }}
        >
          {playbackRate}x
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
