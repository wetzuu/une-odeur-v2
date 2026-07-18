import { Link } from 'react-router-dom'
import { aisleFor, inventoryNumber } from '../lib/catalog'

export default function PerfumeCard({ frag, rating }) {
  const aisle = aisleFor(frag.tags ?? [])
  const shelver = frag.shelfed_by?.trim() || 'the shop'

  return (
    <Link to={`/frags/${frag.id}`} className="shelf-card">
      <div className="shelf-card-img">
        <img src={frag.image} alt={frag.name} loading="lazy" />
      </div>
      <div className="shelf-card-tag">
        <p className="shelf-card-brand">{frag.brand}</p>
        <p className="shelf-card-name">{frag.name}</p>
        <div className="shelf-card-meta">
          <span className="shelf-card-family">{aisle.label}</span>
          <span className="shelf-card-no">
            Nº {inventoryNumber(frag.id)}
            {frag.longevity_hours != null && ` · ${frag.longevity_hours}H`}
          </span>
        </div>
        <div className="shelf-card-foot">
          {rating ? (
            <span className="shelf-card-stars">★ {rating.average.toFixed(1)} ({rating.count})</span>
          ) : (
            <span className="shelf-card-unrated">☆ NOT RATED</span>
          )}
          <span className="shelf-card-shelver">SHELFED BY {shelver.toUpperCase()}</span>
        </div>
      </div>
    </Link>
  )
}
