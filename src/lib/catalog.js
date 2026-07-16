// Deterministic "shop paperwork" helpers — inventory numbers, aisle
// assignments, and stocking dates derived from existing fragrance records.

export const SCENT_FAMILIES = [
  'Fresh',
  'Woody',
  'Floral',
  'Amber',
  'Sweet',
  'Spicy',
  'Citrus',
  'Fruity',
  'Gourmand',
  'Musk',
]

// Stable 4-digit inventory number derived from the record id.
export function inventoryNumber(id) {
  let hash = 7
  for (const char of String(id)) {
    hash = (hash * 31 + char.charCodeAt(0)) % 9973
  }
  return String(hash).padStart(4, '0')
}

// First scent family a fragrance's tags match, mapped to an aisle.
export function aisleFor(tags = []) {
  for (const tag of tags) {
    const index = SCENT_FAMILIES.findIndex((family) =>
      tag.toLowerCase().includes(family.toLowerCase())
    )
    if (index !== -1) {
      return { number: index + 1, label: SCENT_FAMILIES[index] }
    }
  }
  return { number: 0, label: tags[0] ?? 'General' }
}

export function shelfLocation(tags = []) {
  const aisle = aisleFor(tags)
  return aisle.number
    ? `AISLE ${String(aisle.number).padStart(2, '0')} — ${aisle.label.toUpperCase()}`
    : 'FRONT COUNTER'
}

// URL-safe id for newly stocked items, derived from the name.
export function slugify(name) {
  return (
    String(name)
      .toLowerCase()
      .replace(/['’]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'item'
  )
}

export function stockDate(createdAt) {
  if (!createdAt) return '—'
  return new Date(createdAt)
    .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    .toUpperCase()
}
