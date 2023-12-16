import { Item } from './api.ts'

export const getGuid = (episode: Item): string => {
  if (!episode?.guid) {
    return ''
  }

  if (typeof episode.guid === 'string') {
    return episode.guid
  } else {
    return episode.guid['#text']
  }
}
