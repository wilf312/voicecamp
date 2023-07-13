/** @jsx h */
import { h } from "preact";
import { useState } from "preact/hooks";

export default function Image(props: { src: string; alt: string }) {
  const [retryCount, setRetryCount] = useState(0);
  return (
    <img
      onLoad={(e) => {
        const width = e.currentTarget.naturalWidth;
        const height = e.currentTarget.naturalHeight;
        console.log({ width, height, src: e.currentTarget.src });
      }}
      onError={(e) => {
        if (retryCount < 3) {
          const width = e.currentTarget.naturalWidth;
          const height = e.currentTarget.naturalHeight;
          console.warn({ width, height, src: e.currentTarget.src });
          setRetryCount((retryCount) => retryCount + 1);
        }
      }}
      src={`${props.src}${retryCount === 0 ? `` : `&nocache=${retryCount}`}`}
      alt={props.alt}
      style={{
        minWidth: `100px`,
        minHeight: `100px`,
        width: `100%`,
        height: `100%`,
        objectFit: `cover`,
      }}
    />
  );
}
