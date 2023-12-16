/** @jsx h */
import { Fragment, h } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { tw } from '@twind'

import { THUMB_URL } from '../domain/image.ts'
import { UrlListItemAndHashEncoded } from '../config.ts'
import type { NewItem } from '../domain/api.ts'

interface TopListProps {
  list: UrlListItemAndHashEncoded[]
}

const useLatestEpisode = () => {
  const [latestEpisode, setLatestEpisode] = useState<NewItem[]>([])

  useEffect(() => {
    fetch(`/api/getNewPodcast`).then((d) => d.json()).then((data) => {
      setLatestEpisode(data)
    })
  }, [])

  return latestEpisode
}

export default function TopList(props: TopListProps) {
  const latestEpisode = useLatestEpisode()

  return (
    <Fragment>
      {props.list.map((data) => {
        // urlのルールで #以降ページ内リンクとして認識されるのでハッシュを手動で変換する
        const url = data.hash.replaceAll('#', '%23')

        let _url = `/content/${url}/`
        if (
          latestEpisode.length > 0 &&
          latestEpisode.find((d) => data.hash === d.hash)
        ) {
          const found = latestEpisode.find((d) => data.hash === d.hash)

          // guid がテキストのみの場合はそのまま、object形式の場合は中身を取り出す
          const guid = encodeURIComponent(
            found?.latestId || ``,
          )

          _url = `${_url}${guid}`
        }
        return (
          <a
            href={_url}
            key={data.hashEncoded}
            class={tw`flex-basis`}
          >
            {/* <h2>{data.name}</h2> */}
            <img
              style={{
                minWidth: `100px`,
                minHeight: `100px`,
                width: `100%`,
                height: `100%`,
                objectFit: `cover`,
              }}
              alt={data.name}
              src={`${THUMB_URL}${data.hashEncoded.replaceAll('#', '%23')}`}
            />
          </a>
        )
      })}
    </Fragment>
  )
}
