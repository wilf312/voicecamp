/** @jsx h */
import { h } from "preact";

export default function GA() {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `
<!-- service worker -->
<script>
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js");
  });
}
</script>`,
      }}
    />
  );
}
