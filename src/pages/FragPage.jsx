import { useParams, Link } from 'react-router-dom'
import fragrances from '../data/fragrances'

export default function FragPage() {
  const { id } = useParams()
  const frag = fragrances.find((f) => f.id === id)

  if (!frag) {
    return (
      <div className="not-found">
        <h2 style={{ color: 'var(--wf-bg2)' }}>Fragrance not found.</h2>
        <p>
          <Link to="/" style={{ color: 'var(--wf-bg2)' }}>← Back to home</Link>
        </p>
      </div>
    )
  }

  return (
    <div className="frag-page">
      <Link to="/" className="frag-back">← Back to fragrances</Link>

      <div className="frag-layout">
        <div className="frag-image-box">
          <img src={frag.image} alt={frag.name} />
        </div>

        <div className="frag-info">
          <p className="frag-brand">{frag.brand}</p>
          <h1>{frag.name}</h1>

          <div className="frag-tags">
            {frag.tags.map((tag) => (
              <span key={tag} className="frag-tag">{tag}</span>
            ))}
          </div>

          <p className="frag-description">{frag.description}</p>
        </div>
      </div>
    </div>
  )
}
