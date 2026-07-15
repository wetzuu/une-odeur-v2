import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AccountPage() {
  const [tab, setTab] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const { user, signIn, signUp, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleLogin(event) {
    event.preventDefault()
    setError(null)
    setMessage(null)
    setSubmitting(true)

    const { error: signInError } = await signIn(email, password)

    setSubmitting(false)
    if (signInError) {
      setError(signInError.message)
      return
    }
    navigate('/')
  }

  async function handleSignup(event) {
    event.preventDefault()
    setError(null)
    setMessage(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)
    const { error: signUpError } = await signUp(email, password, name)
    setSubmitting(false)

    if (signUpError) {
      setError(signUpError.message)
      return
    }
    setMessage('Account created! Check your email to confirm before logging in.')
  }

  async function handleLogout() {
    setError(null)
    setMessage(null)
    await signOut()
  }

  if (user) {
    return (
      <div className="member-page">
        <div className="member-card">
          <header className="member-card-head">
            <span className="member-card-title">une ’odeur</span>
            <span className="member-card-sub">MEMBER CARD</span>
          </header>
          <p className="member-note">Welcome back to the shop.</p>

          <div className="member-rows">
            <div className="receipt-row">
              <span>MEMBER</span>
              <span>{user.email}</span>
            </div>
            <div className="receipt-row">
              <span>STATUS</span>
              <span>SIGNED IN ✓</span>
            </div>
          </div>

          <button type="button" className="submit-btn" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="member-page">
      <div className="member-card">
        <header className="member-card-head">
          <span className="member-card-title">une ’odeur</span>
          <span className="member-card-sub">MEMBER CARD</span>
        </header>
        <p className="member-note">Sign in to the shop, or get your card stamped for the first time.</p>

        <div className="tabs">
          <button
            className={`tab-btn ${tab === 'login' ? 'active' : ''}`}
            onClick={() => {
              setTab('login')
              setError(null)
              setMessage(null)
            }}
          >
            Sign In
          </button>
          <button
            className={`tab-btn ${tab === 'signup' ? 'active' : ''}`}
            onClick={() => {
              setTab('signup')
              setError(null)
              setMessage(null)
            }}
          >
            New Member
          </button>
        </div>

        {error && <p className="form-error">{error}</p>}
        {message && <p className="form-message">{message}</p>}

        {tab === 'login' ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? 'Stamping your card…' : 'Become a Member'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
