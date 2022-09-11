/** @jsx h */
import { h } from "preact";

export default function GA() {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-V2PCYD70QR"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-V2PCYD70QR');
</script>`,
      }}
    />
  );
}
