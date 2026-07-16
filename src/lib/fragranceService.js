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

// UPDATE — admin-only, enforced by RLS (supabase/admin-delete.sql).
export async function updateFragrance(id, updates) {
  const { data, error } = await supabase
    .from('fragrances')
    .update(updates)
    .eq('id', id)
    .select()
  if (error) throw error
  // RLS filters forbidden updates silently (zero rows, no error) —
  // surface that as an authorization error instead of a false success.
  if (!data || data.length === 0) {
    const forbidden = new Error('403 Forbidden — only shop administrators can edit items.')
    forbidden.status = 403
    throw forbidden
  }
  return data[0]
}

// DELETE — admin-only, enforced by RLS (supabase/admin-delete.sql).
export async function deleteFragrance(id) {
  const { data, error } = await supabase
    .from('fragrances')
    .delete()
    .eq('id', id)
    .select()
  if (error) throw error
  // RLS filters forbidden deletes silently (zero rows, no error) —
  // surface that as an authorization error instead of a false success.
  if (!data || data.length === 0) {
    const forbidden = new Error('403 Forbidden — only shop administrators can remove items.')
    forbidden.status = 403
    throw forbidden
  }
}