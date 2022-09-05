/** @jsx h */
import { h } from "preact";

export type EpisodeItem = {
  ["dc:creator"]: string;
  description: string;
  enclosure: {
    ["@length"]: number;
    ["@type"]: string;
    ["@url"]: string;
  };
  guid: {
    ["#text"]: string;
  };
  ["media:thumbnail"]: {
    ["@url"]: string;
    ["@href"]: string;
  };
  ["itunes:duration"]: string;
  ["itunes:episode"]: number;
  ["itunes:episodeType"]: string;
  ["itunes:explicit"]: string;
  ["itunes:image"]: {
    ["@href"]: string;
  };
  ["itunes:season"]: number;
  ["itunes:summary"]: string;
  link: string;
  pubDate: string;
  title: string;
};

export const EpisodeList = (props: {
  episodeList: EpisodeItem[];
  podcastName: string;
}) => {
  return (
    <div>
      {props.episodeList.map((d) => {
        return (
          <div key={d.enclosure["@url"]}>
            <a
              href={`/content/${props.podcastName}/${
                encodeURIComponent(
                  d.guid["#text"],
                )
              }`}
            >
              {d.title}
            </a>
          </div>
        );
      })}
    </div>
  );
};
