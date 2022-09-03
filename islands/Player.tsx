/** @jsx h */
import { h } from "preact";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";

type props = {
  src: string;
  hash: string;
  title?: string;
  episodeNo: number;
};
export default function Player(props: props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [tweetUrl, setTweetUrl] = useState<string>("");

  /**
   * タイミング: プレイヤー再生時
   * やること: URLに秒数を入れた状態にする ＋ 状態を更新する
   */
  const onTimeUpdate = () => {
    const currentTime = audioRef.current?.currentTime;
    if (currentTime) {
      const _floored = Math.floor(currentTime);
      const url = `${location.pathname}${`?s=${_floored}`}`;
      // https://developer.mozilla.org/ja/docs/Web/API/History/replaceState
      history.replaceState(null, "", url);

      let href = "";
      if (!window.location) {
        return "";
      }
      href = window.location.href;

      const text = encodeURIComponent(
        `${props?.title} ${href} #${decodeURIComponent(props.hash)}${
          props.episodeNo ? `.${props.episodeNo}` : ""
        }`,
      );
      setTweetUrl(`https://twitter.com/intent/tweet?text=${text}`);
    }
  };

  /**
   * when: usePlayer読み込みしたあと、audioRef.currentが存在するとき
   * action: queryの ?s=10 を parseして audioの現在の再生時間に10を設定する
   */
  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    const secondForLocationSearch =
      new URL(location.href).searchParams.get("s") || "0";

    audioRef.current.currentTime = parseInt(secondForLocationSearch, 10) || 0;
  }, [audioRef.current?.currentTime]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <audio
        controls
        src={props.src}
        ref={audioRef}
        style={{ width: "95vw" }}
        onTimeUpdate={onTimeUpdate}
      />
      {tweetUrl && (
        <a href={tweetUrl} target="_blank" rel="noreferrer">
          ツイート
        </a>
      )}
    </div>
  );
}
