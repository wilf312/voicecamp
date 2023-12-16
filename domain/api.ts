/**
 * podcast のデータの取得API
 * @param hashEncoded
 * @returns
 */
export const getPodcast = (hashEncoded: string) => {
  const url = `https://podcast.wilf.workers.dev/api/${hashEncoded}`

  return fetch(url, {
    method: 'GET',
  })
}

/**
 * 新規エピソードのポッドキャストを取得 のデータの取得API
 * @returns
 */
export type NewItem = { hash: string; latestId: string }
export const getNewPodcast = () => {
  const url = `https://action-ten.vercel.app/new_list.json`
  return fetch(url, {
    method: 'GET',
  })
}

export interface GetPodcast {
  title: string
  description: string
  link: string
  image: Image
  generator: string
  'atom:link': Atomlink[]
  author: string
  copyright: string
  language: string
  'itunes:author': string
  'itunes:summary': string
  'itunes:type': string
  'itunes:owner': Itunesowner
  'itunes:explicit': string
  'itunes:category': Itunescategory2
  'itunes:image': Itunesimage
  item: Item[]
}

export interface Item {
  title: string
  description: string
  link: string
  guid: Guid
  'dc:creator': string
  pubDate: string
  enclosure: Enclosure
  'itunes:summary': string
  'itunes:explicit': string
  'itunes:duration': string
  'itunes:image': Itunesimage
  'itunes:season': number
  'itunes:episode': number
  'itunes:episodeType': string
}

interface Enclosure {
  '@url': string
  '@length': number
  '@type': string
  '#text'?: any
}

interface Guid {
  '@isPermaLink': boolean
  '#text': string
}

interface Itunesimage {
  '@href': string
  '#text'?: any
}

interface Itunescategory2 {
  '@text': string
  'itunes:category': Itunescategory
}

interface Itunescategory {
  '@text': string
  '#text'?: any
}

interface Itunesowner {
  'itunes:name': string
  'itunes:email': string
}

interface Atomlink {
  '@href': string
  '@rel': string
  '@type'?: string
  '#text'?: any
}

interface Image {
  url: string
  title: string
  link: string
}
