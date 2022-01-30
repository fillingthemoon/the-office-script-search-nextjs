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
