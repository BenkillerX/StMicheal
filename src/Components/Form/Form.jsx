import React, { useState } from 'react'
import { supabase } from '../../supabaseClient'
import { FcGoogle } from 'react-icons/fc'
import './Form.css'

const Form = ({ setUser }) => {
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // Handle email/password signup
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { firstname, lastname } },
    })

    setLoading(false)

    if (error) {
      alert(error.message)
    } else {
      alert('Signup successful! Please check your email to confirm.')
      setUser(data.user)
      setFirstname('')
      setLastname('')
      setEmail('')
      setPassword('')
    }
  }

  // Handle Google login/signup
  const handleGoogleLogin = async () => {
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin, // 👈 returns user back to your site
      },
    })
    setLoading(false)

    if (error) {
      alert(error.message)
    } else {
      console.log('Google login started:', data)
    }
  }

  return (
    <div className="form-container">
      <div className="form-box">
        <form onSubmit={handleSubmit} className="form">
          <h2 className="form-title">Create an Account</h2>

        
            <input
              type="text"
              placeholder="Firstname"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className="form-input half-width"
              required
            />
            <input
              type="text"
              placeholder="Lastname"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className="form-input half-width"
              required
            />


          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            required
          />

          <button
            type="submit"
            className="form-button"
            disabled={loading}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>

          <div className="separator">
            <hr />
            <span className='theOr'>or</span>
            <hr />
          </div>

          <button
            type="button"
            className="google-button"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <FcGoogle className="google-icon" />
            {loading ? 'Please wait...' : 'Continue with Google'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Form
