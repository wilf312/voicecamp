// routes/_app.tsx

/** @jsx h */
import { h } from 'preact'
import { Head } from '$fresh/runtime.ts'
import { AppProps } from '$fresh/src/server/types.ts'
import GA from '../components/GA.tsx'
import SW from '../components/SW.tsx'
import GlobalStyle from '../components/GlobalStyle.tsx'

export default function App({ Component }: AppProps) {
  return (
    <html lang='ja'>
      <Head>
        <link rel='apple-touch-icon-precomposed' href='/logo.svg' />
        <link
          rel='shortcut icon'
          href='https://voicecamp.love/logo.svg'
          type='image/vnd.microsoft.icon'
        />
        <link
          rel='icon'
          href='https://voicecamp.love/logo.svg'
          type='image/vnd.microsoft.icon'
        />
        <meta
          name='viewport'
          content='width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=5.0'
        >
        </meta>
      </Head>
      <body>
        <GlobalStyle />
        <Component />
        <GA />
        <SW />
      </body>
    </html>
  )
}
