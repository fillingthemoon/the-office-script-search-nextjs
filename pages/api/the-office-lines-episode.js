import clientPromise from '../../utils/mongodb'

export default async function handler(req, res) {
  // Only GET mothod is accepted
  if (req.method === 'POST') {
    const client = await clientPromise
    const db = client.db()

    const { seasonId, episodeId, sceneId } = req.body

    const theOfficeLinesMongoRes = await db
      .collection('the_office_lines')
      .find(
        {
          season: parseInt(seasonId),
          episode: parseInt(episodeId),
          ...(sceneId && { scene: parseInt(sceneId) }),
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
