/** @jsx h */
import { h } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { Icon } from '../components/Icon.tsx'
import { tw } from '@twind'
import { usePlayer } from '../hook/usePlayer.tsx'
import { EpisodeMinimal } from '../domain/type.ts'

const generateShareText = (
  episode: EpisodeMinimal,
  hash: string,
  url: string,
) => {
  return `${episode.title} \n${url}\n#ボイキャン #${decodeURIComponent(hash)}\n`
}

type props = {
  src: string
  hash: string
  title?: string
  episode: EpisodeMinimal
}
export default function Player(props: props) {
  const [shareText, setShareText] = useState<string>('')
  const player = usePlayer({
    src: props.src,
    onTimeUpdate: (currentTime) => {
      const url = `${location.pathname}${`?s=${currentTime}`}`
      // https://developer.mozilla.org/ja/docs/Web/API/History/replaceState
      history.replaceState(null, '', url)

      if (!window.location) {
        return ''
      }

      const shareText = generateShareText(
        props.episode,
        props.hash,
        window.location.href,
      )
      setShareText(shareText)
    },
  })
  /**
   * タイミング: ページ読み込み時
   * 目的: ページ読み込み時に引用ボタンを表示する（再生しなくてもシェアできる）
   */
  useEffect(() => {
    const shareText = generateShareText(
      props.episode,
      props.hash,
      window.location.href,
    )
    setShareText(shareText)
  }, [])

  return (
    <div
      class={tw`mt-5`}
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <input
        onChange={player.onChange}
        class={tw`mx-5`}
        type='range'
        name='volume'
        min={player.range.min}
        max={player.range.max}
        value={player.currentTime ?? 0}
      />
      <div class={tw`flex justify-between px-6   text-xs`}>
        <div>{player.formattedCurrentTime}</div>
        <div>{player.formattedTimeLeft}</div>
      </div>

      <div class={tw`flex justify-evenly py-2`}>
        <Icon
          size={0.55}
          type='back10sec'
          onClick={player.back10Sec}
        />

        {player.isPlaying && (
          <Icon
            type='pause'
            onClick={player.pause}
          />
        )}
        {!player.isPlaying && (
          <Icon
            type='play'
            onClick={player.play}
          />
        )}

        <Icon
          size={0.55}
          type='next10sec'
          onClick={player.next10Sec}
        />
      </div>

      <div
        class={tw`flex justify-between items-center px-6`}
      >
        <div
          onClick={player.speed.changeSpeed}
        >
          {player.speed.playbackRate}x
        </div>
        <div
          onClick={player.volume.mute}
        >
          <Icon
            size={0.55}
            type={player.volume.hasVolume ? 'volumeOn' : 'volumeOff'}
          />
        </div>
        {shareText && (
          <button
            onClick={() => {
              navigator.clipboard.writeText(shareText)
                .then(() => {
                  console.log('text copy success')
                  alert(`シェアテキストをコピーしました\n${shareText}`)
                }, () => {
                  console.log('text copy failed')
                })
            }}
          >
            引用する
          </button>
        )}
      </div>
    </div>
  )
}
