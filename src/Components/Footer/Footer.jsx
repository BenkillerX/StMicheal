import React from "react";
import './Footer.css'
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left - About */}
        <div className="footer-about">
          <h3>St. Michael’s Catholic Church</h3>
          <p>
            A community of faith, love, and service. Join us as we worship and
            grow together in Christ.
          </p>
        </div>

        {/* Middle - Quick Links */}
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/announcements">Announcements</Link></li>
            <li><Link to="/events">Events</Link></li>
          </ul>
        </div>

        {/* Right - Contact */}
        <div className="footer-contact">
          <h4>Contact Us</h4>
          <p>📍 Idi-Ayunre, Ibadan</p>
          <p>📞 +234 803 388 5711</p>
          <p>✉️ St'Micheal-Idi-Ayunre.com</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} St. Michael’s Catholic Church. All rights reserved. Created by DevBen(080-3388-5711)</p>
      </div>
    </footer>
  );
};

export default Footer;
