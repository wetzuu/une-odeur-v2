import { supabase } from './supabase'

// READ all
export async function getFragrances() {
  const { data, error } = await supabase
    .from('fragrances')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

// READ one
export async function getFragrance(id) {
  const { data, error } = await supabase
    .from('fragrances')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

// CREATE
export async function addFragrance(fragrance) {
  const { data, error } = await supabase
    .from('fragrances')
    .insert([fragrance])
    .select()
    .single()
  if (error) throw error
  return data
}

// UPDATE
export async function updateFragrance(id, updates) {
  const { data, error } = await supabase
    .from('fragrances')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

// DELETE
export async function deleteFragrance(id) {
  const { error } = await supabase
    .from('fragrances')
    .delete()
    .eq('id', id)
  if (error) throw error
}