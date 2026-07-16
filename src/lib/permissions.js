// Temporary hardcoded admin allowlist, mirrored by public.is_admin()
// in supabase/admin-delete.sql (the database policy is the real gate —
// this only controls what the UI offers). Replace both with a proper
// role-based permission system once full auth and user roles land;
// only this file and that SQL function should need to change.

const ADMIN_EMAILS = ['wetzuxd@gmail.com', 'matthewsean1104@gmail.com']

export function isAdmin(user) {
  return Boolean(user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase()))
}

export function canEditFragrances(user) {
  return isAdmin(user)
}

export function canDeleteFragrances(user) {
  return isAdmin(user)
}
