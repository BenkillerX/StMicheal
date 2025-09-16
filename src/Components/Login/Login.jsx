// src/Components/Login/Login.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../supabaseClient' // adjust path if needed
import './Login.css'

const ADMIN_EMAIL = 'benedictakhere802@gmail.com'
const ADMIN_PASSWORD = 'canded8891'

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Try normal Supabase sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        // If Supabase sign-in fails but credentials match the admin override,
        // allow admin access (we create a local admin object so UI behaves normally)
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          setUser({ email: ADMIN_EMAIL, id: 'local-admin' })
          setLoading(false)
          navigate('/dash')
          return
        }
        // otherwise throw
        throw error
      }

      // Success: set user from Supabase response (data.user)
      const user = data.user ?? null
      setUser(user)

      // If admin account, go to dashboard, else go home
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        navigate('/dash')
      } else {
        navigate('/')
      }
    } catch (err) {
      alert(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-containers">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="login-input"
        />

        <input
          type="password"
          placeholder="Password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="login-input"
        />

        <button
          type="submit"
          className="login-btn"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}

export default Login
