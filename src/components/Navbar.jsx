import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar({ searchTerm, onSearchChange }) {
  const { user } = useAuth()

  return (
    <header className="shop-header">
      <div className="awning" aria-hidden="true" />
      <div className="shop-header-inner">
        <Link to="/" className="shop-sign">
          <span className="shop-sign-name">une ’odeur</span>
          <span className="shop-sign-sub">/ɔdœʀ/</span>
        </Link>

        <nav className="shop-nav" aria-label="Primary">
          <NavLink to="/" end className={({ isActive }) => `shop-nav-link ${isActive ? 'active' : ''}`}>
            Shop Floor
          </NavLink>
          <NavLink to="/category" className={({ isActive }) => `shop-nav-link ${isActive ? 'active' : ''}`}>
            The Aisles
          </NavLink>
          <NavLink to="/stockroom/new" className={({ isActive }) => `shop-nav-link ${isActive ? 'active' : ''}`}>
            Stockroom
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `shop-nav-link ${isActive ? 'active' : ''}`}>
            About
          </NavLink>
          <NavLink to="/account" className={({ isActive }) => `shop-nav-link ${isActive ? 'active' : ''}`}>
            {user ? 'Member Card' : 'Sign In'}
          </NavLink>
        </nav>

        <div className="shop-search">
          <input
            type="search"
            placeholder="Look something up…"
            aria-label="Search fragrances"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>
      </div>
    </header>
  )
}
