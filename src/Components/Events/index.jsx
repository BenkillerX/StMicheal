// src/Components/Event/Event.jsx
import React, { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import './Event.css' // keep your styles (dot loader css goes here too)

const Event = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('created_at', { ascending: false }) // newest first

        if (error) throw error
        setEvents(data)
      } catch (err) {
        console.error('Error fetching events:', err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (loading) {
    return (
      <section className="dots-container">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </section>
    )
  }

  return (
    <div className="event-container">
      <h1> Ongoing Events and upcoming Events</h1>

      {events.length > 0 ? (
        <div className="event-list">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <img src={event.image_url} alt="event" className="event-img" />
              <p className="event-desc">{event.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No events available.</p>
      )}
    </div>
  )
}

export default Event
