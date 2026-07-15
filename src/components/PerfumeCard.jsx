import { Link } from 'react-router-dom'
import { aisleFor, inventoryNumber } from '../lib/catalog'

export default function PerfumeCard({ frag }) {
  const aisle = aisleFor(frag.tags ?? [])

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
          <span className="shelf-card-no">Nº {inventoryNumber(frag.id)}</span>
        </div>
      </div>
    </Link>
  )
}
