import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  // Only GET mothod is accepted
  if (req.method === 'GET') {
    const searchQuery = req.query.q

    if (searchQuery.length > 100) {
      return res.status(500).json({
        error: `Too many letters to search. Please try again.`,
      })
    } else if (searchQuery.length < 3) {
      return res.status(500).json({
        error: `Too few letters to search. Please try again.`,
      })
    }

    // Have to do this if search query contains multiple words
    const wordsArr = searchQuery
      .replace(/ +/g, ' ') // replace multiple spaces with single space
      .split(' ') // separate search query into words array
    const fullTextSearchQuery = wordsArr
      .map((word) => {
        return `'${word}'`
      })
      .join(' & ')

    const { data: theOfficeLinesRes, error } = await supabase
      .from('the-office-lines')
      .select()
      .textSearch('line_text', fullTextSearchQuery)

    return res.status(200).send(theOfficeLinesRes)
  }
}

export const getAllEpisodes = async () => {
  const { data, error } = await supabase.rpc('get_all_episodes_list')

  const seasonNums = Array.from(new Set(data.map((episode) => episode.season)))

  const episodes = {}
  data.forEach((episode) => {
    const episodeNum = episode.episode

    if (!Object.keys(episodes).includes(episodeNum.toString())) {
      episodes[episodeNum.toString()] = []
    }
    episodes[episodeNum.toString()].push(episode)
  })

  // Slot in null values for seasons without certain episodes
  Object.keys(episodes).forEach((seasonNum, i) => {
    for (let j = 0; j < 9; j++) {
      if (episodes[seasonNum][j]?.season !== j + 1) {
        episodes[seasonNum].splice(j, 0, null)
      }
    }
  })

  return {
    seasonNums,
    episodes,
  }
}

export const getSeasonEpisodeSceneCounts = async () => {
  // Just the season numbers, episode numbers, and max scene numbers (cannot return >1000 records)
  const { data, error } = await supabase.rpc('get_all_episodes')

  const seasonEpisodeSceneCounts = {}

  data.forEach((episodeItem) => {
    const season = episodeItem.season.toString()
    const episode = episodeItem.episode.toString()
    const scene = episodeItem.scene.toString()

    if (!Object.keys(seasonEpisodeSceneCounts).includes(season)) {
      seasonEpisodeSceneCounts[season] = {}
    }
    if (!Object.keys(seasonEpisodeSceneCounts[season]).includes(episode)) {
      seasonEpisodeSceneCounts[season][episode] = scene
    }
  })

  return seasonEpisodeSceneCounts
}

export const getLinesFromEpisode = async (seasonId, episodeId, sceneId) => {
  const { data: linesFromEpisodeRes, error } = await supabase.rpc(
    'get_lines_from_episode',
    // SQL variables need to be entirely lower case!
    { season_id: seasonId, episode_id: episodeId, scene_id: sceneId }
  )

  return linesFromEpisodeRes
}
