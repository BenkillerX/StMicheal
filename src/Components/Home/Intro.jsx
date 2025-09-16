import React from "react";
import { Link } from "react-router-dom";
import "./Intro.css";

const Intro = () => {
  return (
    <>
      <h2 className="setTitle">St' Micheals Catholic Church</h2>
      <section className="intro">
        {/* Left side image */}
        <div className="left-side">
          <img
            src="/church1.jpg" // 👈 if in public folder
            alt="Catholic Church"
            className="church-img"
          />
        </div>

        {/* Right side content */}
        <div className="firstright-side">
          <h1 className="theHeading">A True Family in Christ</h1>
          <p className="theText">
            In the Church of God, we walk together in faith, care for one
            another, and live out the love of Christ. You are welcome to be part
            of this family.
          </p>
          <Link to="/about">
            <button className="learn-btn">Learn More About Our Church</button>
          </Link>
        </div>
      </section>
    </>
  );
};

export default Intro;
