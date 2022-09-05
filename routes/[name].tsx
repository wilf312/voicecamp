/** @jsx h */
import { h } from "preact";
import { PageProps } from "$fresh/server.ts";

export default function Greet(props: PageProps) {
  if (props.url.host !== "localhost:8000") {
    return new Response("", {
      status: 303,
      headers: {
        Location: ("/"),
      },
    });
  }

  return <div>routes/[name].tsx {JSON.stringify(props, null, 2)}</div>;
}
