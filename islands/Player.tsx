/** @jsx h */
import { h } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import type { EpisodeItem } from "../components/EpisodeList.tsx";
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
        }${episodeNo}`,
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
        <svg
          onClick={() => {
            console.log(`10秒戻る`);
            audioRef.current.currentTime = audioRef.current.currentTime - 10;
          }}
          xmlns="http://www.w3.org/2000/svg"
          height="48"
          width="48"
        >
          <path d="M24 44q-3.75 0-7.025-1.4-3.275-1.4-5.725-3.85Q8.8 36.3 7.4 33.025 6 29.75 6 26h3q0 6.25 4.375 10.625T24 41q6.25 0 10.625-4.375T39 26q0-6.25-4.25-10.625T24.25 11h-1.1l3.65 3.65-2.1 2.1-7.35-7.35 7.35-7.35 2.05 2.05-3.9 3.9H24q3.75 0 7.025 1.4 3.275 1.4 5.725 3.85 2.45 2.45 3.85 5.725Q42 22.25 42 26q0 3.75-1.4 7.025-1.4 3.275-3.85 5.725-2.45 2.45-5.725 3.85Q27.75 44 24 44Zm-6-11.5V21.9h-2.7v-2.45h5.2V32.5Zm7.35 0q-.95 0-1.575-.625T23.15 30.3v-8.65q0-.95.625-1.575t1.575-.625h4.15q.95 0 1.575.625t.625 1.575v8.65q0 .95-.625 1.575T29.5 32.5Zm.3-2.5h3.55v-8.1h-3.55V30Z" />
        </svg>

        {audioRef.current?.paused && (
          <svg
            onClick={() => {
              console.log(`再生`);
              audioRef.current?.play();
            }}
            xmlns="http://www.w3.org/2000/svg"
            height="48"
            width="48"
          >
            <path d="M16 37.85v-28l22 14Zm3-14Zm0 8.55 13.45-8.55L19 15.3Z" />
          </svg>
        )}
        {!audioRef.current?.paused && (
          <svg
            onClick={() => {
              console.log(`停止`);
              audioRef.current?.pause();
            }}
            xmlns="http://www.w3.org/2000/svg"
            height="48"
            width="48"
          >
            <path d="M28.25 38V10H36v28ZM12 38V10h7.75v28Z" />
          </svg>
        )}

        <svg
          onClick={() => {
            console.log(`10秒進む`);
            audioRef.current.currentTime = audioRef.current.currentTime + 10;
          }}
          xmlns="http://www.w3.org/2000/svg"
          height="48"
          width="48"
        >
          <path d="M18 32.5V21.9h-2.7v-2.45h5.2V32.5Zm7.35 0q-.95 0-1.575-.625T23.15 30.3v-8.65q0-.95.625-1.575t1.575-.625h4.15q.95 0 1.575.625t.625 1.575v8.65q0 .95-.625 1.575T29.5 32.5Zm.3-2.5h3.55v-8.1h-3.55V30ZM24 44q-3.75 0-7.025-1.4-3.275-1.4-5.725-3.85Q8.8 36.3 7.4 33.025 6 29.75 6 26q0-3.75 1.4-7.025 1.4-3.275 3.85-5.725 2.45-2.45 5.725-3.85Q20.25 8 24 8h1.05l-3.9-3.9 2.05-2.05 7.35 7.35-7.35 7.35-2.05-2.05 3.7-3.7H24q-6.25 0-10.625 4.375T9 26q0 6.25 4.375 10.625T24 41q6.25 0 10.625-4.375T39 26h3q0 3.75-1.4 7.025-1.4 3.275-3.85 5.725-2.45 2.45-5.725 3.85Q27.75 44 24 44Z" />
        </svg>
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
