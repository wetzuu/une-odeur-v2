import { Link } from 'react-router-dom'

export default function PerfumeCard({ frag }) {
  return (
    <Link to={`/frags/${frag.id}`} className="perfume-card">
      <div className="card-img">
        <img src={frag.image} alt={frag.name} />
      </div>
      <strong className="card-name">{frag.name}</strong>
      <p className="card-brand">{frag.brand}</p>
    </Link>
  )
}
