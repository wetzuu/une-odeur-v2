// A labeled run of shelving: aisle sign on top, product grid,
// and a wooden shelf strip underneath (via .shelf-section::after).
export default function ShelfSection({ number, title, note, children }) {
  return (
    <section className="shelf-section">
      <header className="aisle-sign">
        {number != null && <span className="aisle-no">AISLE {String(number).padStart(2, '0')}</span>}
        <h3 className="aisle-title">{title}</h3>
        {note && <span className="aisle-note">{note}</span>}
      </header>
      {children}
    </section>
  )
}
