// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_name_ from "./routes/[name].tsx";
import * as $_app from "./routes/_app.tsx";
import * as $api_getNewPodcast from "./routes/api/getNewPodcast.ts";
import * as $api_kv from "./routes/api/kv.ts";
import * as $api_podcast from "./routes/api/podcast.ts";
import * as $content_podcastName_episode_ from "./routes/content/[podcastName]/[episode].tsx";
import * as $content_podcastName_index from "./routes/content/[podcastName]/index.tsx";
import * as $feelingLucky from "./routes/feelingLucky.tsx";
import * as $form from "./routes/form.tsx";
import * as $index from "./routes/index.tsx";
import * as $ArtWork from "./islands/ArtWork.tsx";
import * as $Counter from "./islands/Counter.tsx";
import * as $Menu from "./islands/Menu.tsx";
import * as $Player from "./islands/Player.tsx";
import * as $TopList from "./islands/TopList.tsx";
import { type Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/[name].tsx": $_name_,
    "./routes/_app.tsx": $_app,
    "./routes/api/getNewPodcast.ts": $api_getNewPodcast,
    "./routes/api/kv.ts": $api_kv,
    "./routes/api/podcast.ts": $api_podcast,
    "./routes/content/[podcastName]/[episode].tsx":
      $content_podcastName_episode_,
    "./routes/content/[podcastName]/index.tsx": $content_podcastName_index,
    "./routes/feelingLucky.tsx": $feelingLucky,
    "./routes/form.tsx": $form,
    "./routes/index.tsx": $index,
  },
  islands: {
    "./islands/ArtWork.tsx": $ArtWork,
    "./islands/Counter.tsx": $Counter,
    "./islands/Menu.tsx": $Menu,
    "./islands/Player.tsx": $Player,
    "./islands/TopList.tsx": $TopList,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
