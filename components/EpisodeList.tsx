/** @jsx h */
import { h } from 'preact'
import { tw } from '@twind'
import { EpisodeMinimal } from '../domain/type.ts'

export const EpisodeList = (props: {
  currentGuid: string
  episodeList: EpisodeMinimal[]
  podcastName: string
}) => {
  return (
    <div
      style={{
        lineHeight: 2.5,
      }}
    >
      {props.episodeList.map((d) => {
        if (d?.url == null) {
          return []
        }
        const guid = d.guid
        return (
          <div class={tw`flex`} key={d.url}>
            {guid === props.currentGuid &&
              <div>再生中</div>}
            <a
              href={`/content/${props.podcastName}/${
                encodeURIComponent(
                  guid,
                )
              }`}
            >
              {d.title}
            </a>
          </div>
        )
      })}
    </div>
  )
}
