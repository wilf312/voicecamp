/** @jsx h */
import { h } from 'preact'
import { tw } from '@twind'
import { useDisclosure } from '../hook/useDisclosure.ts'
import useSWR from 'swr'

import { css } from 'twind/css'

const style = css`
/* HTML: <div class="loader"></div> */
& {
  display: inline-grid;
  padding: 5px;
  background: #ffffff1a;
  filter: blur(4px) contrast(12);
}
&:before {
  content: "";
  height: 40px;
  aspect-ratio: 3;
  --c: #0000 64%,#000 66% 98%,#0000 101%;
  background:
    radial-gradient(35% 146% at 50% 159%,var(--c)) 0 0,
    radial-gradient(35% 146% at 50% -59%,var(--c)) 100% 100%;
  background-size: calc(200%/3) 50%;
  background-repeat: repeat-x;
  animation: l11 .8s infinite linear;
}
@keyframes l11{
  to {background-position: -200% 0,-100% 100%}
}
`

type props = {
  imageSrc: string
  title: string
  guid: string
  podcastName: string
}
export default function ArtWork(props: props) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  // // TODO: ArtWorkでAPIから情報取得するの違和感があるのでやりよう考えた方が良さそうな気がする
  // const swr = useSWR(
  //   `/api/getDescription?podcast=${props.podcastName}&guid=${props.guid}`,
  // )

  // const description = swr?.data?.text ?? ``

  return (
    <div
      class={tw`px-7 pt-7 pb-3 flex justify-center items-center`}
      style={{
        minHeight: 380,
      }}
    >
      <img
        alt={`${props.title}のアートワーク`}
        class={tw`rounded-md `}
        style={{
          maxWidth: `16rem`,
          maxHeight: `16rem`,
          boxShadow: `3px 3px 8px 1px grey;`,
        }}
        src={props.imageSrc}
        onClick={onOpen}
      />
      {isOpen &&
        (
          <div
            style={{
              padding: `1em`,
              width: `90%`,
              zIndex: 10,
              position: `fixed`,
              top: `0`,
              left: `0`,
              whiteSpace: `pre-wrap`,
              background: `#ffffffdb`,
              height: `96svh`,
              overflowY: `scroll`,
            }}
          >
            <button
              onClick={onClose}
              class={`px-3 py-2 bg-white rounded border(gray-500 2) hover:bg-gray-200 active:bg-gray-300 disabled:(opacity-50 cursor-not-allowed)`}
            >
              閉じる
            </button>
            {!description && (
              <div>
                <div class={`${tw(style)}`}>
                </div>
              </div>
            )}
            {
              /*
            {description &&
              (
                <div dangerouslySetInnerHTML={{ __html: description }}>
                </div>
              )}
           */
            }
          </div>
        )}
    </div>
  )
}
