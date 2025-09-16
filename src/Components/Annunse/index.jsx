// src/Components/Annunse/Annunse.jsx
import React, { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import './Announse.css'

const Annunse = () => {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch announcements from Supabase
  const fetchAnnouncements = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: true }) // ascending = oldest first

    if (error) {
      console.error('Error fetching announcements:', error.message)
    } else {
      setAnnouncements(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  return (
    <div className="announcements-container">
      <h1>Announcements</h1>

      {loading ? (
        <section className="dots-container">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </section>
      ) : announcements.length === 0 ? (
        <p>No announcements yet.</p>
      ) : (
        <ol className="announcement-list">
          {announcements.map((ann, index) => (
            <li key={ann.id} className="announcement-item">
              <span className="announcement-number">{index + 1}.</span>
              <span className="announcement-text">{ann.text}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

export default Annunse
