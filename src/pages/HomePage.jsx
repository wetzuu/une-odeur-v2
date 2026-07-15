import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PerfumeCard from '../components/PerfumeCard'
import ShelfSection from '../components/ShelfSection'
import { getFragrances } from '../lib/fragranceService'
import { SCENT_FAMILIES } from '../lib/catalog'

const neighborhoodPicks = [
  {
    name: 'Enzo Scents',
    desc: 'Well-performing fragrances of decent quality on a budget.',
    url: 'https://shopee.ph/enzoscents',
  },
  {
    name: 'Scentsmith Perfumery',
    desc: 'Great selection of niche fragrances with excellent performance.',
    url: 'https://shopee.ph/scentsmithperfumeryinc',
  },
  {
    name: 'Symmetry Labs',
    desc: 'Premium-quality dupes with decent longevity.',
    url: 'https://shopee.ph/symmetrylabph',
  },
  {
    name: 'Feralde',
    desc: 'Extremely well-performing dupe fragrances. Exceptionally curated.',
    url: 'https://shopee.ph/feralde.ph',
  },
]

function normalizeSearchValue(value) {
  return value.trim().toLowerCase()
}

export default function HomePage({ searchTerm = '' }) {
  const [fragrances, setFragrances] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    getFragrances()
      .then((data) => {
        if (isMounted) setFragrances(data)
      })
      .catch((err) => {
        if (isMounted) setError(err.message)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const normalizedSearchTerm = normalizeSearchValue(searchTerm)
  const isSearching = normalizedSearchTerm.length > 0

  const matches = isSearching
    ? fragrances.filter((frag) => {
        const searchableText = [frag.name, frag.brand, ...(frag.tags ?? [])].join(' ').toLowerCase()
        return searchableText.includes(normalizedSearchTerm)
      })
    : fragrances

  // getFragrances() already orders by created_at desc — the front
  // of the list is what's newest on the shelves.
  const newArrivals = fragrances.slice(0, 4)
  const restOfShelves = fragrances.slice(4)

  return (
    <div className="shop-floor">
      <section className="shopfront">
        <h1>une ’odeur</h1>
        <p className="shopfront-phonetic">[feminine] · /ɔdœʀ/</p>
        <p className="shopfront-tagline">
          A neighborhood fragrance archive — local and international scents,
          shelved with care and reviewed over the counter.
        </p>
        <p className="shopfront-hours">— OPEN DAILY · FREE TO BROWSE · EST. 2026 —</p>
      </section>

      <div className="shop-floor-main">
        {loading ? (
          <p className="print-note">PRINTING THE SHELVES…</p>
        ) : error ? (
          <p className="print-note">COULDN'T STOCK THE SHELVES: {error}</p>
        ) : isSearching ? (
          <section className="shelf-section">
            <div className="lookup-slip">
              LOOKUP: "{searchTerm.trim().toUpperCase()}" — {matches.length}{' '}
              {matches.length === 1 ? 'ITEM' : 'ITEMS'} FOUND
            </div>
            {matches.length > 0 ? (
              <div className="shelf-grid">
                {matches.map((frag) => (
                  <PerfumeCard key={frag.id} frag={frag} />
                ))}
              </div>
            ) : (
              <p className="print-note">
                NOTHING ON THE SHELVES MATCHES — TRY <Link to="/category">WALKING THE AISLES</Link>
              </p>
            )}
          </section>
        ) : (
          <>
            <ShelfSection number={1} title="New Arrivals" note="FRESHLY STOCKED">
              <div className="shelf-grid">
                {newArrivals.map((frag) => (
                  <PerfumeCard key={frag.id} frag={frag} />
                ))}
              </div>
            </ShelfSection>

            {restOfShelves.length > 0 && (
              <ShelfSection number={2} title="On the Shelves" note="THE STANDING COLLECTION">
                <div className="shelf-grid">
                  {restOfShelves.map((frag) => (
                    <PerfumeCard key={frag.id} frag={frag} />
                  ))}
                </div>
              </ShelfSection>
            )}

            <ShelfSection title="Browse by Scent Family" note="FIND YOUR AISLE">
              <div className="family-rack">
                {SCENT_FAMILIES.map((family, index) => (
                  <Link
                    key={family}
                    to={`/category?family=${encodeURIComponent(family)}`}
                    className="shelf-label family-label"
                  >
                    <span className="family-index">{String(index + 1).padStart(2, '0')}</span>
                    {family}
                  </Link>
                ))}
              </div>
            </ShelfSection>
          </>
        )}
      </div>

      <aside className="community-board" aria-label="Neighborhood picks">
        <h3 className="board-title">the community board</h3>
        <p className="board-sub">Shops the neighborhood swears by</p>
        <div className="board-frame">
          {neighborhoodPicks.map((pick) => (
            <a key={pick.name} className="pin-note" href={pick.url} target="_blank" rel="noreferrer">
              <p className="pin-note-name">{pick.name}</p>
              <p className="pin-note-desc">{pick.desc}</p>
              <span className="pin-note-link">shopee.ph ↗</span>
            </a>
          ))}
        </div>
      </aside>
    </div>
  )
}
