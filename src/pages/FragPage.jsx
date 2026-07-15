import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getFragrance } from '../lib/fragranceService'
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
  const [frag, setFrag] = useState(null)
  const [loading, setLoading] = useState(true)

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
              <span>NOTES</span>
              <span>{tags.length} LISTED</span>
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
