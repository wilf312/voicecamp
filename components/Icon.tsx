/** @jsx h */
import { h } from "preact";

const Type = {
  "back10sec": "back10sec",
  "play": "play",
  "pause": "pause",
} as const;

export function Icon(props: {
  type: keyof typeof Type;
  onClick: () => void;
}) {
  switch (props.type) {
    case Type.play: {
      return (
        <svg
          onClick={props.onClick}
          xmlns="http://www.w3.org/2000/svg"
          height="48"
          width="48"
        >
          <path d="M28.25 38V10H36v28ZM12 38V10h7.75v28Z" />
        </svg>
      );
    }
    case Type.pause: {
      return (
        <svg
          onClick={props.onClick}
          xmlns="http://www.w3.org/2000/svg"
          height="48"
          width="48"
        >
          <path d="M16 37.85v-28l22 14Zm3-14Zm0 8.55 13.45-8.55L19 15.3Z" />
        </svg>
      );
    }
    case Type.back10sec: {
      return (
        <svg
          onClick={props.onClick}
          xmlns="http://www.w3.org/2000/svg"
          height="48"
          width="48"
        >
          <path d="M24 44q-3.75 0-7.025-1.4-3.275-1.4-5.725-3.85Q8.8 36.3 7.4 33.025 6 29.75 6 26h3q0 6.25 4.375 10.625T24 41q6.25 0 10.625-4.375T39 26q0-6.25-4.25-10.625T24.25 11h-1.1l3.65 3.65-2.1 2.1-7.35-7.35 7.35-7.35 2.05 2.05-3.9 3.9H24q3.75 0 7.025 1.4 3.275 1.4 5.725 3.85 2.45 2.45 3.85 5.725Q42 22.25 42 26q0 3.75-1.4 7.025-1.4 3.275-3.85 5.725-2.45 2.45-5.725 3.85Q27.75 44 24 44Zm-6-11.5V21.9h-2.7v-2.45h5.2V32.5Zm7.35 0q-.95 0-1.575-.625T23.15 30.3v-8.65q0-.95.625-1.575t1.575-.625h4.15q.95 0 1.575.625t.625 1.575v8.65q0 .95-.625 1.575T29.5 32.5Zm.3-2.5h3.55v-8.1h-3.55V30Z" />
        </svg>
      );
    }

    default: {
      return null;
    }
  }
}