/** @jsx h */
import { h } from "preact";
import { usePlayer, useTweetLink } from "../domain/player.ts";

type props = {
  src: string;
  hash: string;
  title?: string;
  episodeNo: number;
};
export default function Player(props: props) {
  const player = usePlayer();
  const tweetLink = useTweetLink({
    hash: props.hash,
    title: props.title,
    episodeNo: props.episodeNo,
    currentTime: player.currentTime,
  });

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
        ref={player.audioRef}
        style={{ width: "95vw" }}
        onTimeUpdate={player.onTimeUpdate}
      />
      {tweetLink && (
        <a href={`${tweetLink}`} target="_blank" rel="noreferrer">
          ツイート
        </a>
      )}
    </div>
  );
}
