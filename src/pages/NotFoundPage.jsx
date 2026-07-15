import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="void-slip">
      <div className="receipt-wrap">
        <div className="receipt">
          <p className="receipt-shop">UNE ’ODEUR</p>
          <p className="receipt-sub">NEIGHBORHOOD FRAGRANCE ARCHIVE</p>
          <div className="receipt-rule" />
          <p className="receipt-sub">ERROR 404 — NO SUCH AISLE</p>
          <div>
            <span className="void-stamp">VOID</span>
          </div>
          <div className="receipt-rule" />
          <p className="receipt-sub">
            <Link to="/">← BACK TO THE SHOP FLOOR</Link>
          </p>
          <p className="receipt-stars">* * *</p>
        </div>
      </div>
    </div>
  )
}
