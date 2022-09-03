/** @jsx h */
import { h } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import type { EpisodeItem } from "../components/EpisodeList.tsx";
import { tw } from "@twind";

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

    // queryから秒数を取り出して audioに適応する
    const secondForLocationSearch =
      new URL(location.href).searchParams.get("s") || "0";
    audioRef.current.currentTime = parseInt(secondForLocationSearch, 10) || 0;

    setCurrentTime(audioRef.current.currentTime);

    audioRef.current.onload = () => {
      console.log("loaded");
      setDuration(`${parseInt(audioRef.current.duration || "0", 10) || 0}`);
    };
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
        class={tw`mx-5`}
        type="range"
        name="volume"
        min="1"
        max={duration}
        value={currentTime || 0}
      />
      <button
        onClick={() => {
          console.log(`再生`);
          audioRef.current?.play();
        }}
      >
        再生
      </button>
      <button
        onClick={() => {
          console.log(`停止`);
          audioRef.current?.pause();
        }}
      >
        停止
      </button>
      <button
        onClick={() => {
          console.log(`再生速度変更`);
          audioRef.current?.play();
        }}
      >
        再生速度変更
      </button>
      <button
        onClick={() => {
          console.log(`10秒戻る`);
          audioRef.current?.play();
        }}
      >
        10秒戻る
      </button>
      <button
        onClick={() => {
          console.log(`10秒進む`);
          audioRef.current?.play();
        }}
      >
        10秒進む
      </button>
      <div>
        {tweetUrl && (
          <a href={tweetUrl} target="_blank" rel="noreferrer">
            ツイート
          </a>
        )}
      </div>
    </div>
  );
}
