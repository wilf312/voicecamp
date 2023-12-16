export const timeFormat = (currentTime: number) => {
  /**@type{string}*/
  const h = (~~(currentTime / 3600)).toString().padStart(2, '0')
  /**@type{string}*/
  const m = (~~(currentTime % 3600 / 60)).toString().padStart(2, '0')
  /**@type{string}*/
  const s = (~~(currentTime % 60)).toString().padStart(2, '0')
  return `${h}:${m}:${s}`
}

export const timeFormatShort = (currentTime: number) => {
  const hNum = ~~(currentTime / 3600)
  const mNum = ~~(currentTime % 3600 / 60)
  const sNum = ~~(currentTime % 60)
  /**@type{string}*/
  const h = hNum ? `${hNum.toString()}:` : ``
  /**@type{string}*/
  const m = mNum.toString()
  /**@type{string}*/
  const s = sNum.toString().padStart(2, '0')
  return `${h}${m}:${s}`
}
