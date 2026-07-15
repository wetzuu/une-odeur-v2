import { Link } from 'react-router-dom'

export default function AboutPage() {
  return (
    <div className="about-page">
      <section className="shopfront">
        <h1>about the shop</h1>
        <p className="shopfront-phonetic">UNE ’ODEUR · /ɔdœʀ/ · [feminine]</p>
        <p className="shopfront-tagline">
          A small archive run with the energy of a corner store —
          every bottle shelved by hand, every note written over the counter.
        </p>
      </section>

      <section className="about-section">
        <header className="aisle-sign">
          <h3 className="aisle-title">Why this exists</h3>
        </header>
        <p>
          Most fragrance sites feel like department store counters — bright lights, big
          databases, someone trying to sell you something. This one is meant to feel like
          the shop down the street: a few shelves, honest labels, and a person behind the
          counter who cares a little too much about how things smell.
        </p>
        <p>
          une ’odeur is a fragrance discovery archive with a soft spot for the Philippine
          scene — local shops, budget finds, and dupes that punch above their price —
          shelved right alongside the international classics.
        </p>
      </section>

      <section className="about-section">
        <header className="aisle-sign">
          <h3 className="aisle-title">How the shop works</h3>
        </header>
        <div className="about-steps">
          <div className="about-step">
            <span className="about-step-no">01</span>
            <span>
              Wander the <Link to="/">shop floor</Link> — new arrivals up front, the standing
              collection behind them.
            </span>
          </div>
          <div className="about-step">
            <span className="about-step-no">02</span>
            <span>
              Walk <Link to="/category">the aisles</Link> — every shelf is sorted by scent
              family and brand.
            </span>
          </div>
          <div className="about-step">
            <span className="about-step-no">03</span>
            <span>
              Pick up a bottle and read its receipt — scent profile, shelf location, and a
              note from the counter.
            </span>
          </div>
          <div className="about-step">
            <span className="about-step-no">04</span>
            <span>
              Check the community board for the neighborhood's favorite shops before you go.
            </span>
          </div>
        </div>
      </section>

      <section className="about-section">
        <header className="aisle-sign">
          <h3 className="aisle-title">House rules</h3>
        </header>
        <p>
          Browsing is free and always will be. Nothing here is sponsored. Nobody is waiting
          behind you in line — take your time, smell everything twice.
        </p>
      </section>
    </div>
  )
}
