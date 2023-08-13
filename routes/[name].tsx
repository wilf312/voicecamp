/** @jsx h */
import { h } from "preact";
import { PageProps } from "$fresh/server.ts";

export default function Greet(props: PageProps) {
  if (props.url.host !== "localhost:8000") {
    const headers = new Headers();
    headers.set("location", `/`);
    const res = new Response("redirect", {
      status: 303,
      headers,
    });
    return res;
  }

  return <div>routes/[name].tsx {JSON.stringify(props, null, 2)}</div>;
}
