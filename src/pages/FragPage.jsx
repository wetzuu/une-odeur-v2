import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getFragrance } from '../lib/fragranceService'

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
      <div className="not-found">
        <h2 style={{ color: 'var(--wf-bg2)' }}>Loading…</h2>
      </div>
    )
  }

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
