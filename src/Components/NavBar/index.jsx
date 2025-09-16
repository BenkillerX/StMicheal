// src/Components/NavBar/NavBar.jsx
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './NavBar.css'
import { supabase } from '../../supabaseClient' // adjust path if needed

const NavBar = ({ user, setUser }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const navigate = useNavigate()

  const toggleSidebar = () => setSidebarOpen(prev => !prev)

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Sign out error:', error.message)
      alert(error.message)
      return
    }

    setUser(null)
    navigate('/') // go home after sign out
  }

  return (
    <>
      <nav className="nav">
        <div className="logo">
          <Link to="/"><img src="/logo.jpg" alt="Church Logo" /></Link>
        </div>

        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/announcements">Announcements</Link></li>
          <li><Link to="/events">Events</Link></li>

          {/* Login - ALWAYS visible (goes to /login) */}
          <li>
            <Link to="/login">
              <button className="signin-btn">Login</button>
            </Link>
          </li>

          {/* Sign In (shows when not signed in) / Sign Out (shows when signed in) */}
          {!user ? (
            <li>
              <Link to="/Form">
                <button className="signin-btn">Sign In</button>
              </Link>
            </li>
          ) : (
            <li>
              <button className="signin-btn" onClick={handleSignOut}>Sign Out</button>
            </li>
          )}
        </ul>

        {/* mobile menu button */}
        <div className="menu-btn" onClick={toggleSidebar}>
          {sidebarOpen ? (
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
              <path d="M6 6L18 18M6 18L18 6" stroke="black" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
              <path d="M3 6H21M3 12H21M3 18H21" stroke="black" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="close-btn" onClick={toggleSidebar}>
          <svg width="25" height="25" viewBox="0 0 24 24" fill="none">
            <path d="M6 6L18 18M6 18L18 6" stroke="black" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        <ul>
          <li className='finalstyle'><Link to="/" onClick={toggleSidebar}>Home</Link></li>
          <li className='finalstyle'><Link to="/about" onClick={toggleSidebar}>About</Link></li>
          <li className='finalstyle'><Link to="/announcements" onClick={toggleSidebar}>Announcements</Link></li>
          <li className='finalstyle'><Link to="/events" onClick={toggleSidebar}>Events</Link></li>

          {/* Login always visible on mobile too */}
          <li>
            <Link to="/login" onClick={toggleSidebar}>
              <button className="mobile-btn">Login</button>
            </Link>
          </li>

          {/* Sign In vs Sign Out */}
          {!user ? (
            <li>
              <Link to="/Form" onClick={toggleSidebar}>
                <button className="mobile-btn">Sign In</button>
              </Link>
            </li>
          ) : (
            <li>
              <button
                className="mobile-btn"
                onClick={() => { handleSignOut(); toggleSidebar(); }}
              >
                Sign Out
              </button>
            </li>
          )}
        </ul>
      </div>

      {/* overlay to close sidebar */}
      {sidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}
    </>
  )
}

export default NavBar
