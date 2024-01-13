/** @jsx h */
import { h } from 'preact'
import { tw } from '@twind'
import { useDisclosure } from '../hook/useDisclosure.ts'
import useSWR from 'swr'

type props = {
  imageSrc: string
  title: string
  guid: string
  podcastName: string
}
export default function ArtWork(props: props) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  // TODO: ArtWorkでAPIから情報取得するの違和感があるのでやりよう考えた方が良さそうな気がする
  const swr = useSWR(`/api/getDescription?podcast=${props.podcastName}`)

  const description = swr?.data?.data?.[decodeURIComponent(props.guid)] ?? ``

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
            <div dangerouslySetInnerHTML={{ __html: description }}>
            </div>
          </div>
        )}
    </div>
  )
}
