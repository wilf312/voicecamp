/**
 * rss登録依頼用のgoogle form のレンダリング
 */
/** @jsx h */
import { h } from 'preact'

export default function Form() {
  return (
    <div>
      <iframe
        src='https://docs.google.com/forms/d/e/1FAIpQLSdfWWMJwlMOpOC0W-9T0JRYPIo_dPFPWd4eFR0o8a29m1i-UQ/viewform?embedded=true'
        width='640'
        height='844'
        frameborder='0'
        marginheight='0'
        marginwidth='0'
      >
        読み込んでいます…
      </iframe>
    </div>
  )
}
