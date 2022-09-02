import { useEffect, useMemo, useRef, useState } from "preact/hooks";

export const usePlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState<number | null>(null);

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

    setCurrentTime(audioRef.current.currentTime);
  }, [audioRef.current?.currentTime]);

  // const search = currentTime ? `?s=${currentTime}` : "";

  return {
    currentTime,
    audioRef,
    onTimeUpdate,
  };
};

export const useTweetLink = (props: {
  hash: string;
  title?: string;
  episodeNo: number | null;
  currentTime: number | null;
}) => {
  const tweetLink = useMemo(() => {
    let href = "";
    if (!location) {
      return "";
    }
    href = location.href;
    const text = encodeURIComponent(
      `${props?.title} ${href} #${props.hash}${
        props.episodeNo ? `.${props.episodeNo}` : ""
      }`,
    );
    return `https://twitter.com/intent/tweet?text=${text}`;
  }, [props?.title, props.hash, props.episodeNo, props.currentTime]);

  return tweetLink;
};
