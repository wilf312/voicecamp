// routes/_app.tsx

/** @jsx h */
import { h } from "preact";
import { Head } from "$fresh/runtime.ts";
import { AppProps } from "$fresh/src/server/types.ts";
import GA from "../components/GA.tsx";
import SW from "../components/SW.tsx";

export default function App({ Component }: AppProps) {
  return (
    <html>
      <Head>
        <title>VoiceCamp</title>
        <link rel="apple-touch-icon-precomposed" href="/logo.svg" />
      </Head>
      <body>
        <Component />
        <GA />
        <SW />
      </body>
    </html>
  );
}
