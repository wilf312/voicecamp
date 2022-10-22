import { EpisodeItem } from "../components/EpisodeList.tsx";

export const getGuid = (episode: EpisodeItem): string => {
  if (!episode?.guid) {
    return "";
  }

  if (typeof episode.guid === "string") {
    return episode.guid;
  } else {
    return episode.guid["#text"];
  }
};
