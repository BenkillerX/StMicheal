import React from 'react'
import { Link } from 'react-router-dom'
import './Announse.css'

const Announse = () => {
  return (
    <section className="announse-container">
      <h2 className="announse-title">Support For the Gospel</h2>  
      <p className="announse-text">
        The church is in need of the following: a Toilet, Solar and Inverter System, among other needs. 
        To view all our needs kindly click the button below.
      </p> 
      <Link to="/announcements">
        <button className="announse-btn">Support for the Gospel</button>
      </Link>
    </section>
  )
}

export default Announse
