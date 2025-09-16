import React from 'react'
import Hero from './Hero'
import Intro from './Intro'
import { Link } from 'react-router-dom';
import Eventprev from './Eventprev';
import Announse from './Announse';
import Footer from '../Footer/Footer';
import './Home.css'

const Home = () => {
  return (
    <div className='homeback'>
    <Hero/>
    <Intro/>
    <Eventprev/>
    <Announse/>
    <Footer/>
    </div>
  )
}

export default Home