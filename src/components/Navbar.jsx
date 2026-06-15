import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar({ searchTerm, onSearchChange }) {
  const { user } = useAuth()

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="brand-name">une 'odeur</span>
        <span className="brand-phonetic">/ɔdœʀ/</span>
      </Link>

      <nav className="nav-links">
        <Link to="/" className="nav-btn">Home</Link>
        <Link to="/about" className="nav-btn">About</Link>
        <Link to="/category" className="nav-btn">Category</Link>
        <Link to="/account" className="nav-btn">{user ? 'Account' : 'Login'}</Link>
      </nav>

      <div className="nav-right">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search Perfumes..."
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>
        <Link to="/account" className="nav-icon">
          <i className="far fa-user-circle" />
        </Link>
      </div>
    </header>
  )
}
