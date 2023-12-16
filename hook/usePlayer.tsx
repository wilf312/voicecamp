import { useEffect, useRef, useState } from 'preact/hooks'
import { timeFormatShort } from '../domain/date.ts'
export type props = {
  src: string
  onTimeUpdate: (currentTime: number) => void
}
export const usePlayer = (props: props) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [currentTime, setCurrentTime] = useState<number | null>(null)
  const [playbackRate, setPlaybackRate] = useState<number>(1)
  const [isPlaying, setPlaying] = useState<boolean>(false)
  const [hasVolume, setHasVolume] = useState<boolean>(true)

  /**
   * タイミング: プレイヤー再生時
   * やること: URLに秒数を入れた状態にする ＋ 状態を更新する
   */
  const onTimeUpdate = () => {
    const currentTime = audioRef.current?.currentTime
    if (currentTime) {
      const _floored = ~~currentTime
      setCurrentTime(_floored)
      props.onTimeUpdate(_floored)
    }
  }

  /**
   * when: コンポーネント読み込み時srcをセットする
   * action: queryの ?s=10 を parseして audioの現在の再生時間に10を設定する
   */
  useEffect(() => {
    audioRef.current = new Audio()
    audioRef.current.src = props.src
    audioRef.current.ontimeupdate = onTimeUpdate
    audioRef.current.playbackRate = playbackRate

    // queryから秒数を取り出して audioに適応する
    const secondForLocationSearch =
      new URL(location.href).searchParams.get('s') || '0'
    audioRef.current.currentTime = parseInt(secondForLocationSearch, 10) || 0

    setCurrentTime(audioRef.current.currentTime)

    // audioRef.current.onload = () => {
    //   console.log("loaded");
    // };
  }, [])

  const formattedCurrentTime = currentTime !== null
    ? timeFormatShort(currentTime)
    : ''
  const formattedTimeLeft = currentTime !== null
    ? timeFormatShort((audioRef.current?.duration || 0) - currentTime)
    : ''

  return {
    isPlaying,
    currentTime,
    formattedCurrentTime,
    formattedTimeLeft,
    range: {
      min: 1,
      max: audioRef.current?.duration || 1,
    },
    volume: {
      hasVolume,
      mute: () => {
        setHasVolume((bool) => {
          if (!audioRef.current) {
            return bool
          }
          const newBool = !bool
          audioRef.current.volume = newBool ? 1 : 0
          return newBool
        })
      },
    },

    play: () => {
      console.log(`再生`)
      if (audioRef.current) {
        audioRef.current.play()
        setPlaying(true)
      }
    },
    pause: () => {
      console.log(`停止`)
      setPlaying(false)
      audioRef.current?.pause()
    },
    onChange: (e: any) => {
      if (e?.currentTarget?.value && audioRef.current?.currentTime) {
        const num = ~~e?.currentTarget?.value
        audioRef.current.currentTime = num
      }
    },
    back10Sec: () => {
      console.log(`10秒戻る`, audioRef.current?.currentTime)
      if (audioRef.current?.currentTime) {
        audioRef.current.currentTime = audioRef.current.currentTime - 10
      }
    },
    next10Sec: () => {
      console.log(`10秒進む`, audioRef.current?.currentTime)
      if (audioRef.current?.currentTime) {
        audioRef.current.currentTime = audioRef.current.currentTime + 10
      }
    },
    speed: {
      playbackRate,
      changeSpeed: () => {
        console.log(`再生速度変更`)
        const rateList = [1, 1.2, 1.5, 2, 3, 0.7]
        const index = rateList.findIndex((value) => {
          return playbackRate === value
        })

        if (audioRef.current) {
          const nextPlaybackRate =
            rateList[index === rateList.length - 1 ? 0 : index + 1]
          audioRef.current.playbackRate = nextPlaybackRate
          setPlaybackRate(nextPlaybackRate)
        }
      },
    },
  }
}
