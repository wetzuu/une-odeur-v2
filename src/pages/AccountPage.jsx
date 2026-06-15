import { useState } from 'react'

export default function AccountPage() {
  const [tab, setTab] = useState('login')

  return (
    <div className="account-page">
      <div className="account-card">
        <h2>une 'odeur</h2>
        <p className="subtitle">Sign in to your account or create one.</p>

        <div className="tabs">
          <button
            className={`tab-btn ${tab === 'login' ? 'active' : ''}`}
            onClick={() => setTab('login')}
          >
            Login
          </button>
          <button
            className={`tab-btn ${tab === 'signup' ? 'active' : ''}`}
            onClick={() => setTab('signup')}
          >
            Sign Up
          </button>
        </div>

        {tab === 'login' ? (
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="you@example.com" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" />
            </div>
            <button type="submit" className="submit-btn">Login</button>
          </form>
        ) : (
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label>Name</label>
              <input type="text" placeholder="Your name" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="you@example.com" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" placeholder="••••••••" />
            </div>
            <button type="submit" className="submit-btn">Create Account</button>
          </form>
        )}
      </div>
    </div>
  )
}
