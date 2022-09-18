/** @jsx h */
import { h } from "preact";

const Type = {
  "home": "home",
  "menu": "menu",
  "volumeOn": "volumeOn",
  "volumeOff": "volumeOff",
  "logo": "logo",
  "next10sec": "next10sec",
  "back10sec": "back10sec",
  "play": "play",
  "pause": "pause",
} as const;

export function Icon(props: {
  type: keyof typeof Type;
  onClick?: () => void;
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
          <path d="M16 37.85v-28l22 14Zm3-14Zm0 8.55 13.45-8.55L19 15.3Z" />
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
          <path d="M28.25 38V10H36v28ZM12 38V10h7.75v28Z" />
        </svg>
      );
    }
    case Type.next10sec: {
      return (
        <svg
          onClick={props.onClick}
          xmlns="http://www.w3.org/2000/svg"
          height="48"
          width="48"
        >
          <path d="M18 32.5V21.9h-2.7v-2.45h5.2V32.5Zm7.35 0q-.95 0-1.575-.625T23.15 30.3v-8.65q0-.95.625-1.575t1.575-.625h4.15q.95 0 1.575.625t.625 1.575v8.65q0 .95-.625 1.575T29.5 32.5Zm.3-2.5h3.55v-8.1h-3.55V30ZM24 44q-3.75 0-7.025-1.4-3.275-1.4-5.725-3.85Q8.8 36.3 7.4 33.025 6 29.75 6 26q0-3.75 1.4-7.025 1.4-3.275 3.85-5.725 2.45-2.45 5.725-3.85Q20.25 8 24 8h1.05l-3.9-3.9 2.05-2.05 7.35 7.35-7.35 7.35-2.05-2.05 3.7-3.7H24q-6.25 0-10.625 4.375T9 26q0 6.25 4.375 10.625T24 41q6.25 0 10.625-4.375T39 26h3q0 3.75-1.4 7.025-1.4 3.275-3.85 5.725-2.45 2.45-5.725 3.85Q27.75 44 24 44Z" />
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

    case Type.logo: {
      return (
        <svg
          width="49"
          height="49"
          viewBox="0 0 49 49"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M48.1077 48.7263V0.726326L14.5938 34.3627V48.7263H48.1077Z"
            fill="#4B6968"
          />
          <path
            d="M0.107727 20.4305V48.7263H8.78243V34.9739L0.107727 20.4305Z"
            fill="#4B6968"
          />
        </svg>
      );
    }

    case Type.volumeOff: {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48">
          <path d="m40.65 45.2-6.6-6.6q-1.4 1-3.025 1.725-1.625.725-3.375 1.125v-3.1q1.15-.35 2.225-.775 1.075-.425 2.025-1.125l-8.25-8.3V40l-10-10h-8V18h7.8l-11-11L4.6 4.85 42.8 43Zm-1.8-11.6-2.15-2.15q1-1.7 1.475-3.6.475-1.9.475-3.9 0-5.15-3-9.225-3-4.075-8-5.175v-3.1q6.2 1.4 10.1 6.275 3.9 4.875 3.9 11.225 0 2.55-.7 5t-2.1 4.65Zm-6.7-6.7-4.5-4.5v-6.5Q30 17 31.325 19.2q1.325 2.2 1.325 4.8 0 .75-.125 1.475-.125.725-.375 1.425Zm-8.5-8.5-5.2-5.2 5.2-5.2Zm-3 14.3v-7.5l-4.2-4.2h-7.8v6h6.3Zm-2.1-9.6Z" />
        </svg>
      );
    }

    case Type.volumeOn: {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48">
          <path d="M28 41.45v-3.1q4.85-1.4 7.925-5.375T39 23.95q0-5.05-3.05-9.05-3.05-4-7.95-5.35v-3.1q6.2 1.4 10.1 6.275Q42 17.6 42 23.95t-3.9 11.225Q34.2 40.05 28 41.45ZM6 30V18h8L24 8v32L14 30Zm21 2.4V15.55q2.75.85 4.375 3.2T33 24q0 2.85-1.65 5.2T27 32.4Zm-6-16.8L15.35 21H9v6h6.35L21 32.45ZM16.3 24Z" />
        </svg>
      );
    }

    case Type.menu: {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48">
          <path d="M6 36v-3h36v3Zm0-10.5v-3h36v3ZM6 15v-3h36v3Z" />
        </svg>
      );
    }

    case Type.home: {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48">
          <path d="M8 42V18L24.1 6 40 18v24H28.3V27.75h-8.65V42Zm3-3h5.65V24.75H31.3V39H37V19.5L24.1 9.75 11 19.5Zm13-14.65Z" />
        </svg>
      );
    }

    default: {
      return null;
    }
  }
}
