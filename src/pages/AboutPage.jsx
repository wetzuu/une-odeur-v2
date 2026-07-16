import { Link } from 'react-router-dom'

export default function AboutPage() {
  const copyEmail = async () => {
    await navigator.clipboard.writeText('matthewtanada4@gmail.com')
  }

  return (
    <div className="about-page">
      <section className="shopfront">
        <h1>about the shop</h1>
        <p className="shopfront-phonetic">UNE ’ODEUR · /ɔdœʀ/ · [feminine]</p>
        <p className="shopfront-tagline">
          A small archive run with the energy of a corner store;
          every bottle shelved by hand, every note written over the counter.
        </p>
      </section>

      <section className="about-section">
        <header className="aisle-sign">
          <h3 className="aisle-title">Why this exists</h3>
        </header>
        <p>
          Initially, I wanted to create an app that was similar to Fragantica, but for
          the Philippine fragrance scene. Most fragrance sites feel like department store counters; 
          bright lights, big databases, someone trying to sell you something. This one is meant to feel like
          the shop down the street, comfy and small.
        </p>
        <p>
          une ’odeur is a fragrance discovery archive with a soft spot for the Philippine
          scene; local shops, budget finds, and dupes that punch above their price;
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
              Pick up a bottle and read its receipt; scent profile, shelf location, and a
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
          Browsing will always be free and fine. 
          Nothing here is sponsored, but contributions to making the 
          grocery store a bit bigger is always welcome!
        </p>
      </section>

           <section className="about-section">
        <header className="aisle-sign">
          <h3 className="aisle-title">Contact</h3>
        </header>
        <p>
            If you have any questions, suggestions, or just want to hit me up. Please feel free to do so through any of the social media buttons!
        
        </p>
            <div className="contact-buttons">
              <button
                className="contact-button contact-copy-button"
                type="button"
                onClick={copyEmail}
                aria-label="Copy email address to clipboard"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 8.5V6.75A1.75 1.75 0 0 1 10.75 5h6.5A1.75 1.75 0 0 1 19 6.75v8.5A1.75 1.75 0 0 1 17.25 17H15.5" />
                  <rect x="5" y="8.5" width="10" height="10" rx="1.75" />
                </svg>
                <span>matthewtanada4@gmail.com</span>
              </button>

              <a className="contact-button" href="https://github.com/wetzuu" target="_blank" rel="noreferrer">
                github.com/wetzuu
              </a>

              <a className="contact-button" href="https://www.instagram.com/tnadatzu/" target="_blank" rel="noreferrer">
                @tnadatzu
              </a>
            </div>
      </section>
    </div>
  )
}
