import React from 'react'
import './Event.css'
import { Link } from 'react-router-dom'

const Eventprev = () => {
  return (
   <>
   <h2 className='Eve'>Events</h2>
     <section className="eventprev-container">
        
      {/* Left side: Text content */}
      <div className="left-side">
        <h1 className='space'>Join Us for the Harvest Celebration!</h1>
        <p className='space2'>
          Our annual harvest is here 🎉. A time of thanksgiving, joy, and unity. 
          Come with your family and friends to celebrate God’s goodness.
        </p>
        <Link to="/events">
         <button type="button" className='HarBtn'>View All Events</button>
        </Link>
       
      </div>

      {/* Right side: Image + Button */}
      <div className="theright-side">
        <img src="/church2.jpg" alt="" />
      </div>
    </section>
   </>
  )
}

export default Eventprev
