import { Link } from 'react-router-dom'
import PerfumeCard from '../components/PerfumeCard'
import fragrances from '../data/fragrances'

const recommendations = [
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
  const normalizedSearchTerm = normalizeSearchValue(searchTerm)
  const visibleFragrances = normalizedSearchTerm
    ? fragrances.filter((frag) => {
        const searchableText = [frag.name, frag.brand, ...(frag.tags ?? [])].join(' ').toLowerCase()
        return searchableText.includes(normalizedSearchTerm)
      })
    : fragrances

  return (
    <div className="main-container">
      <Link to="/" className="hero-banner">
        <div className="hero-content">
          <h2 style={{ color: 'white', fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif" }}>une' odeur</h2>
          <p style={{ color: 'white', fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif", fontStyle: 'italic' }}>[feminine] /ɔdœʀ/</p>
          <p style={{ color: 'white', fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif", fontStyle: 'italic' }}>&bull; transitive website</p>
          <p style={{ color: 'white', fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif" }}>a site focused on fragrance discovery and reviews of local and international fragrances.</p>
        </div>
      </Link>

      <section className="content-area">
        <h3 className="section-title">Sum Fragrances</h3>
        <div className="fragrance-grid">
          {visibleFragrances.length > 0 ? (
            visibleFragrances.map((frag) => (
              <PerfumeCard key={frag.id} frag={frag} />
            ))
          ) : (
            <p className="search-empty-state">No fragrances match "{searchTerm}".</p>
          )}
        </div>
      </section>

      <aside className="sidebar">
        <h3 className="section-title">Sum Recommendations</h3>
        {recommendations.map((rec) => (
          <div key={rec.name} className="recommendation-item">
            <a href={rec.url} target="_blank" rel="noreferrer">
              <p className="rec-name">{rec.name}</p>
              <p className="rec-desc">{rec.desc}</p>
            </a>
          </div>
        ))}
      </aside>
    </div>
  )
}
