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
      <div className="account-page">
        <div className="account-card">
          <h2>une 'odeur</h2>
          <p className="subtitle">Signed in as {user.email}</p>
          <button type="button" className="submit-btn" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="account-page">
      <div className="account-card">
        <h2>une 'odeur</h2>
        <p className="subtitle">Sign in to your account or create one.</p>

        <div className="tabs">
          <button
            className={`tab-btn ${tab === 'login' ? 'active' : ''}`}
            onClick={() => {
              setTab('login')
              setError(null)
              setMessage(null)
            }}
          >
            Login
          </button>
          <button
            className={`tab-btn ${tab === 'signup' ? 'active' : ''}`}
            onClick={() => {
              setTab('signup')
              setError(null)
              setMessage(null)
            }}
          >
            Sign Up
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
              {submitting ? 'Logging in…' : 'Login'}
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
              {submitting ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
