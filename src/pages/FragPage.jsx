import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getFragrance, deleteFragrance } from '../lib/fragranceService'
import { getRatingSummary, addRating } from '../lib/ratingService'
import { inventoryNumber, shelfLocation, stockDate } from '../lib/catalog'

// Fake-but-deterministic barcode: bar widths derived from the item id.
function Barcode({ id }) {
  const chars = String(id).padEnd(10, 'q').slice(0, 10).split('')
  let x = 0
  const bars = chars.flatMap((char, index) => {
    const code = char.charCodeAt(0)
    const pair = [
      { x, width: (code % 3) + 1 },
      { x: x + (code % 3) + 1 + 1, width: ((code >> 2) % 2) + 1 },
    ]
    x += (code % 3) + 1 + 1 + ((code >> 2) % 2) + 1 + 2
    return pair.map((bar, barIndex) => ({ ...bar, key: `${index}-${barIndex}` }))
  })

  return (
    <svg className="receipt-barcode" viewBox={`0 0 ${x} 40`} preserveAspectRatio="none" aria-hidden="true">
      {bars.map((bar) => (
        <rect key={bar.key} x={bar.x} y="0" width={bar.width} height="40" fill="var(--ink)" />
      ))}
    </svg>
  )
}

export default function FragPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [frag, setFrag] = useState(null)
  const [loading, setLoading] = useState(true)
  const [confirmingRemove, setConfirmingRemove] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [removeError, setRemoveError] = useState(null)
  const [ratingSummary, setRatingSummary] = useState(null)
  const [hoverStar, setHoverStar] = useState(0)
  const [myRating, setMyRating] = useState(0)
  const [ratingBusy, setRatingBusy] = useState(false)
  const [ratingDone, setRatingDone] = useState(false)
  const [ratingError, setRatingError] = useState(null)

  useEffect(() => {
    let isMounted = true
    setLoading(true)

    getFragrance(id)
      .then((data) => {
        if (isMounted) setFrag(data)
      })
      .catch(() => {
        if (isMounted) setFrag(null)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [id])

  useEffect(() => {
    let isMounted = true

    setRatingSummary(null)
    setMyRating(0)
    setRatingDone(false)
    setRatingError(null)

    // Fails soft — the page still renders without a rating summary.
    getRatingSummary(id)
      .then((summary) => {
        if (isMounted) setRatingSummary(summary)
      })
      .catch(() => {})

    return () => {
      isMounted = false
    }
  }, [id])

  if (loading) {
    return (
      <div className="void-slip">
        <p className="print-note">PRINTING…</p>
      </div>
    )
  }

  if (!frag) {
    return (
      <div className="void-slip">
        <div className="receipt-wrap">
          <div className="receipt">
            <p className="receipt-shop">UNE ’ODEUR</p>
            <div className="receipt-rule" />
            <p className="receipt-sub">ITEM NOT FOUND ON ANY SHELF</p>
            <div>
              <span className="void-stamp">VOID</span>
            </div>
            <div className="receipt-rule" />
            <p className="receipt-sub">
              <Link to="/">← BACK TO THE SHOP FLOOR</Link>
            </p>
          </div>
        </div>
      </div>
    )
  }

  const tags = frag.tags ?? []

  // Anyone can rate for now; one submission per page view as a courtesy.
  // Upgrades to one-rating-per-user once auth lands (see ratingService).
  async function handleRate(value) {
    if (ratingDone || ratingBusy) return
    setRatingBusy(true)
    setRatingError(null)
    setMyRating(value)
    try {
      await addRating(frag.id, value)
      setRatingDone(true)
      const fresh = await getRatingSummary(frag.id).catch(() => null)
      if (fresh) setRatingSummary(fresh)
    } catch (error) {
      setRatingError(error.message)
      setMyRating(0)
    } finally {
      setRatingBusy(false)
    }
  }

  // Open to all visitors for now — gate this strip once auth/ownership lands.
  async function handleRemove() {
    setRemoving(true)
    setRemoveError(null)
    try {
      await deleteFragrance(frag.id)
      navigate('/')
    } catch (error) {
      setRemoveError(error.message)
      setRemoving(false)
    }
  }

  return (
    <div className="item-page">
      <Link to="/" className="crumb">← BACK TO THE SHELVES</Link>

      <div className="item-layout">
        <div className="item-main">
          <div className="item-image">
            <img src={frag.image} alt={frag.name} />
            <span className="item-sticker" aria-hidden="true">
              <span>Nº</span>
              <strong>{inventoryNumber(frag.id)}</strong>
            </span>
          </div>

          <div className="item-info">
            <p className="item-brand">{frag.brand}</p>
            <h1 className="item-name">{frag.name}</h1>

            <div className="item-tags">
              {tags.map((tag) => (
                <span key={tag} className="shelf-label">{tag}</span>
              ))}
            </div>

            <h2 className="counter-note-label">from the counter —</h2>
            <p className="item-description">{frag.description}</p>

            <div className="counter-rating">
              <h2 className="counter-note-label">rate it over the counter —</h2>
              <div className="rating-row">
                <div
                  className="star-input"
                  role="group"
                  aria-label="Rate this fragrance"
                  onMouseLeave={() => setHoverStar(0)}
                >
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={`star-btn ${(hoverStar || myRating) >= value ? 'lit' : ''}`}
                      aria-label={`${value} star${value > 1 ? 's' : ''}`}
                      onMouseEnter={() => !ratingDone && setHoverStar(value)}
                      onClick={() => handleRate(value)}
                      disabled={ratingBusy || ratingDone}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <span className="rating-note">
                  {ratingSummary
                    ? `★ ${ratingSummary.average.toFixed(2)} · ${ratingSummary.count} ${ratingSummary.count === 1 ? 'RATING' : 'RATINGS'}`
                    : 'NOT YET RATED — BE THE FIRST'}
                </span>
              </div>
              {ratingDone && <p className="rating-thanks">LOGGED ★{myRating} — THANK YOU</p>}
              {ratingError && <p className="form-error">COULDN'T LOG RATING: {ratingError}</p>}
            </div>

            <div className="stockroom-strip">
              <span className="stockroom-tag">STOCKROOM</span>
              <Link to={`/stockroom/${frag.id}/edit`} className="stockroom-link">✎ EDIT ITEM</Link>
              {confirmingRemove ? (
                <>
                  <span className="stockroom-tag">TAKE IT OFF THE SHELF?</span>
                  <button
                    type="button"
                    className="stockroom-link danger"
                    onClick={handleRemove}
                    disabled={removing}
                  >
                    {removing ? 'REMOVING…' : 'YES, REMOVE'}
                  </button>
                  <button
                    type="button"
                    className="stockroom-link"
                    onClick={() => setConfirmingRemove(false)}
                    disabled={removing}
                  >
                    KEEP IT
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="stockroom-link danger"
                  onClick={() => setConfirmingRemove(true)}
                >
                  ✕ REMOVE FROM SHELF
                </button>
              )}
            </div>
            {removeError && <p className="form-error">COULDN'T REMOVE: {removeError}</p>}
          </div>
        </div>

        <aside className="receipt-wrap" aria-label="Item receipt">
          <div className="receipt">
            <p className="receipt-shop">UNE ’ODEUR</p>
            <p className="receipt-sub">NEIGHBORHOOD FRAGRANCE ARCHIVE</p>
            <p className="receipt-sub">— MANILA, PH —</p>

            <div className="receipt-rule" />

            <div className="receipt-row">
              <span>ITEM</span>
              <span>{frag.name.toUpperCase()}</span>
            </div>
            <div className="receipt-row">
              <span>BRAND</span>
              <span>{frag.brand.toUpperCase()}</span>
            </div>
            <div className="receipt-row">
              <span>INV. Nº</span>
              <span>{inventoryNumber(frag.id)}</span>
            </div>

            <div className="receipt-rule" />

            <p className="receipt-heading">SCENT PROFILE</p>
            {tags.length > 0 ? (
              tags.map((tag) => (
                <p key={tag} className="receipt-item">
                  <span className="receipt-check">✓</span>
                  {tag}
                </p>
              ))
            ) : (
              <p className="receipt-item">— UNLABELED —</p>
            )}

            <div className="receipt-rule" />

            <div className="receipt-row">
              <span>SHELF</span>
              <span>{shelfLocation(tags)}</span>
            </div>
            <div className="receipt-row">
              <span>STOCKED</span>
              <span>{stockDate(frag.created_at)}</span>
            </div>
            <div className="receipt-row">
              <span>LONGEVITY</span>
              <span>{frag.longevity_hours != null ? `${frag.longevity_hours} HRS` : '—'}</span>
            </div>
            <div className="receipt-row">
              <span>NOTES</span>
              <span>{tags.length} LISTED</span>
            </div>

            <div className="receipt-rule" />

            <div className="receipt-row">
              <span>RATING</span>
              <span>
                {ratingSummary
                  ? `★ ${ratingSummary.average.toFixed(2)} (${ratingSummary.count})`
                  : 'NOT YET RATED'}
              </span>
            </div>
            <div className="receipt-row">
              <span>SHELFED BY</span>
              <span>{(frag.shelfed_by?.trim() || 'THE SHOP').toUpperCase()}</span>
            </div>

            <div className="receipt-rule" />

            <Barcode id={frag.id} />
            <p className="receipt-code">*{String(frag.id).toUpperCase()}*</p>

            <p className="receipt-thanks">THANK YOU FOR SMELLING WITH US</p>
            <p className="receipt-stars">* * *</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
