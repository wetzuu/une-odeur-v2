import { useState } from 'react'
import { SCENT_FAMILIES } from '../lib/catalog'

const EMPTY = {
  name: '',
  brand: '',
  image: '',
  description: '',
  tags: [],
  shelfed_by: '',
  longevity_hours: null,
}

// Split stored tags into recognized scent families (toggles) and
// everything else (free-form accords).
function splitTags(tags = []) {
  const families = SCENT_FAMILIES.filter((family) =>
    tags.some((tag) => tag.toLowerCase() === family.toLowerCase())
  )
  const extras = tags.filter(
    (tag) => !SCENT_FAMILIES.some((family) => family.toLowerCase() === tag.toLowerCase())
  )
  return { families, extras }
}

export default function FragranceForm({ initial, submitLabel, busy, serverError, onSubmit, onCancel }) {
  const source = initial ?? EMPTY
  const { families: initialFamilies, extras: initialExtras } = splitTags(source.tags)

  const [name, setName] = useState(source.name)
  const [brand, setBrand] = useState(source.brand)
  const [image, setImage] = useState(source.image)
  const [description, setDescription] = useState(source.description)
  const [families, setFamilies] = useState(initialFamilies)
  const [extraAccords, setExtraAccords] = useState(initialExtras.join(', '))
  const [longevity, setLongevity] = useState(
    source.longevity_hours != null ? String(source.longevity_hours) : ''
  )
  const [shelfedBy, setShelfedBy] = useState(source.shelfed_by ?? '')
  const [errors, setErrors] = useState({})

  function toggleFamily(family) {
    setFamilies((current) =>
      current.includes(family) ? current.filter((f) => f !== family) : [...current, family]
    )
  }

  function handleSubmit(event) {
    event.preventDefault()

    const extras = extraAccords
      .split(',')
      .map((accord) => accord.trim())
      .filter(Boolean)

    const seen = new Set()
    const tags = [...families, ...extras].filter((tag) => {
      const key = tag.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })

    const longevityValue = longevity.trim() === '' ? null : Number(longevity)

    const nextErrors = {}
    if (!name.trim()) nextErrors.name = 'Every bottle needs a name.'
    if (!brand.trim()) nextErrors.brand = 'Every bottle comes from somewhere.'
    if (!image.trim()) nextErrors.image = 'Add an image URL, or a /images/… path.'
    if (!description.trim()) nextErrors.description = 'Write a note from the counter.'
    if (tags.length === 0) nextErrors.tags = 'Pick at least one scent family, or list an accord.'
    if (
      longevityValue != null &&
      (!Number.isInteger(longevityValue) || longevityValue < 1 || longevityValue > 72)
    ) {
      nextErrors.longevity = 'Hours on skin should be a whole number from 1 to 72.'
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    onSubmit({
      name: name.trim(),
      brand: brand.trim(),
      image: image.trim(),
      description: description.trim(),
      tags,
      longevity_hours: longevityValue,
      shelfed_by: shelfedBy.trim() || null,
    })
  }

  return (
    <form className="intake-form" onSubmit={handleSubmit} noValidate>
      {serverError && <p className="form-error">COULDN'T FILE THE FORM: {serverError}</p>}

      <div className="intake-grid">
        <div className="form-group">
          <label htmlFor="intake-name">Item name</label>
          <input
            id="intake-name"
            type="text"
            placeholder="e.g. Bleu de Chanel"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p className="field-error">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="intake-brand">Brand</label>
          <input
            id="intake-brand"
            type="text"
            placeholder="e.g. Chanel"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
          {errors.brand && <p className="field-error">{errors.brand}</p>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="intake-image">Bottle image</label>
        <input
          id="intake-image"
          type="text"
          placeholder="https://… or /images/bottle.png"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        {errors.image && <p className="field-error">{errors.image}</p>}
        {image.trim() && (
          <div className="intake-preview">
            <img src={image.trim()} alt="Bottle preview" />
          </div>
        )}
      </div>

      <div className="form-group">
        <span className="form-label-text">Scent families</span>
        <div className="family-toggles">
          {SCENT_FAMILIES.map((family) => {
            const active = families.includes(family)
            return (
              <button
                key={family}
                type="button"
                className={`shelf-label ${active ? 'active' : ''}`}
                aria-pressed={active}
                onClick={() => toggleFamily(family)}
              >
                {family}
              </button>
            )
          })}
        </div>
        {errors.tags && <p className="field-error">{errors.tags}</p>}
      </div>

      <div className="intake-grid">
        <div className="form-group">
          <label htmlFor="intake-accords">Other accords</label>
          <input
            id="intake-accords"
            type="text"
            placeholder="Comma-separated — e.g. Aromatic, Smoky, Vanilla"
            value={extraAccords}
            onChange={(e) => setExtraAccords(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="intake-longevity">Longevity (hours on skin)</label>
          <input
            id="intake-longevity"
            type="number"
            min="1"
            max="72"
            step="1"
            placeholder="e.g. 8 — leave blank if untested"
            value={longevity}
            onChange={(e) => setLongevity(e.target.value)}
          />
          {errors.longevity && <p className="field-error">{errors.longevity}</p>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="intake-description">Note from the counter</label>
        <textarea
          id="intake-description"
          placeholder="What does it smell like? When would you wear it? Be honest — this goes on the receipt."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {errors.description && <p className="field-error">{errors.description}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="intake-shelfed-by">Shelfed by (name or alias)</label>
        <input
          id="intake-shelfed-by"
          type="text"
          maxLength={40}
          placeholder="Sign the form — optional"
          value={shelfedBy}
          onChange={(e) => setShelfedBy(e.target.value)}
        />
      </div>

      <div className="intake-actions">
        <button type="submit" className="submit-btn" disabled={busy}>
          {busy ? 'Filing…' : submitLabel}
        </button>
        <button type="button" className="shelf-label" onClick={onCancel} disabled={busy}>
          Cancel
        </button>
      </div>
    </form>
  )
}
