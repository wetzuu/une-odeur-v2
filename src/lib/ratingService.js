import { supabase } from './supabase'

// Community ratings. Open to everyone for now — when auth lands, stamp
// user_id on insert and enforce one-rating-per-user in the database
// (see supabase/shelfed-longevity-ratings.sql). Only this file should
// need to change.

// READ all summaries, keyed by fragrance id: { [id]: { average, count } }
export async function getRatingSummaries() {
  const { data, error } = await supabase.from('fragrance_rating_summary').select('*')
  if (error) throw error

  const byId = {}
  for (const row of data) {
    byId[row.fragrance_id] = { average: Number(row.average), count: row.ratings_count }
  }
  return byId
}

// READ one summary (null when nobody has rated yet)
export async function getRatingSummary(fragranceId) {
  const { data, error } = await supabase
    .from('fragrance_rating_summary')
    .select('*')
    .eq('fragrance_id', fragranceId)
    .maybeSingle()
  if (error) throw error
  return data ? { average: Number(data.average), count: data.ratings_count } : null
}

// CREATE
export async function addRating(fragranceId, rating) {
  const { error } = await supabase
    .from('ratings')
    .insert([{ fragrance_id: fragranceId, rating }])
  if (error) throw error
}
