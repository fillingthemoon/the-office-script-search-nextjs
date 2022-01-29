import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  // Only GET mothod is accepted
  if (req.method === 'GET') {
    const searchQuery = req.query.q

    if (searchQuery.length < 3) {
      return res.status(500).json({
        error: `Too few letters to search. Please try again.`,
      })
    }

    const { data: theOfficeLinesRes, error } = await supabase
      .from('the-office-lines')
      .select()
      .textSearch('line_text', searchQuery)

    return res.status(200).send(theOfficeLinesRes)
  }
}
