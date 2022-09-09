// routes/_app.tsx

/** @jsx h */
import { h } from "preact";
import { Head } from "$fresh/runtime.ts";
import { AppProps } from "$fresh/src/server/types.ts";

export default function App({ Component }: AppProps) {
  return (
    <html data-voicecamp="Enjoy the podcasts!">
      <Head>
        <title>VoiceCamp</title>
      </Head>
      <body>
        <Component />
      </body>
    </html>
  );
}
