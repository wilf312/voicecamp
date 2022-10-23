/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { getGuid } from "../domain/episode.ts";

export type EpisodeItem = {
  ["dc:creator"]: string;
  description: string;
  enclosure: {
    ["@length"]: number;
    ["@type"]: string;
    ["@url"]: string;
  };
  guid: string | {
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
  currentGuid: string;
  episodeList: EpisodeItem[];
  podcastName: string;
}) => {
  return (
    <div
      style={{
        lineHeight: 2,
      }}
    >
      {props.episodeList.map((d) => {
        if (d?.enclosure == null) {
          return;
        }
        const guid = getGuid(d);
        return (
          <div class={tw`flex`} key={d.enclosure["@url"]}>
            {guid === props.currentGuid &&
              <div>再生中</div>}
            <a
              href={`/content/${props.podcastName}/${
                encodeURIComponent(
                  guid,
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
