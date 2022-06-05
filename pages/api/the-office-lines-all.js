import clientPromise from '../../utils/mongodb'

export default async function handler(req, res) {
  // Only GET mothod is accepted
  if (req.method === 'GET') {
    const client = await clientPromise
    const db = client.db()

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

    const theOfficeLinesMongoRes = await db
      .collection('the_office_lines')
      .find(
        {
          line_text: new RegExp(searchQuery, 'gi'),
        },
        { projection: { _id: 0 } }
      )
      .sort({
        line_id: 'ascending',
      })
      .toArray()

    return res.status(200).send(theOfficeLinesMongoRes)
  }
}

export const getAllEpisodes = async () => {
  const client = await clientPromise
  const db = client.db()

  const theOfficeLinesMongoRes = await db
    .collection('the_office_lines')
    .aggregate([
      {
        $group: {
          _id: { season: '$season', episode: '$episode', title: '$title' },
          minLineId: { $min: '$line_id' },
        },
      },
      {
        $sort: { minLineId: 1 },
      },
      {
        $project: {
          _id: 0,
          season: '$_id.season',
          episode: '$_id.episode',
          title: '$_id.title',
        },
      },
    ])
    .toArray()

  const seasonNums = Array.from(
    new Set(theOfficeLinesMongoRes.map((episode) => episode.season))
  )
  const episodes = {}
  theOfficeLinesMongoRes.forEach((episode) => {
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