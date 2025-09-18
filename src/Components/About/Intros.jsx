import React from 'react'
import './Intros.css'
const Intros = () => {
  return (
    <>
    <div className='imgForChurchAboutSection'>
      <h1 className='thestyle'>St Micheal Idi-Ayunre</h1>
      <img src="/church1.jpg" alt="" className='TheImgageFortheChurch'/>
      <section className='sectionForChurchAndPastor'>
          <div className="leftside">
            <img src="/test1.jpg" alt="" className='imgforthePastor'/>
          </div>
          <div className="rightside">
            <h1>Our Parish Priest</h1>
            <p className='textforthePaster'>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Modi rem deleniti quas placeat, vel corporis illum nostrum fugiat atque nobis dicta voluptatem commodi sapiente! Beatae hic magnam nam voluptates aut amet nulla non. Cum illo consectetur magni quasi velit quibusdam.
            </p>
            <h1>About Our Church</h1>
            <p className=''>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas adipisci recusandae quaerat sunt, asperiores reprehenderit suscipit beatae eos, esse, a expedita. Adipisci, in? Non similique quasi adipisci nam dolor asperiores, ab voluptate odit, nisi unde commodi, magnam facere cumque tempore?
            </p>
          </div>
      </section>
    </div>

    </>
  )
}

export default Intros