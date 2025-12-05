// src/components/Footer.jsx
import React from 'react';

function openDoctors(specialty) {
  window.dispatchEvent(new CustomEvent('open-doctors', { detail: { specialty } }));
}

export default function Footer(){
  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo"><i className="fas fa-heartbeat"></i><span>Medicare+</span></div>
            <p>Revolutionizing healthcare with AI-powered solutions for better patient care and outcomes.</p>
            <div className="social-links">
              <a><i className="fab fa-facebook"></i></a>
              <a><i className="fab fa-twitter"></i></a>
              <a><i className="fab fa-instagram"></i></a>
              <a><i className="fab fa-linkedin"></i></a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Services</h4>
            <ul>
              <li><button className="footer-link-btn" onClick={() => openDoctors('general')}>General Consultation</button></li>
              <li><button className="footer-link-btn" onClick={() => openDoctors('cardiology')}>Cardiology</button></li>
              <li><button className="footer-link-btn" onClick={() => openDoctors('neurology')}>Neurology</button></li>
              <li><button className="footer-link-btn" onClick={() => openDoctors('pediatrics')}>Pediatrics</button></li>
              <li><button className="footer-link-btn" onClick={() => openDoctors('dermatology')}>Dermatology</button></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#appointments">Book Appointment</a></li>
              <li><a href="#doctors">Our Doctors</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact Info</h4>
            <div className="contact-info">
              <div className="contact-item"><i className="fas fa-phone"></i><span>1-800-HEALTH</span></div>
              <div className="contact-item"><i className="fas fa-envelope"></i><span>support@medicare.com</span></div>
              <div className="contact-item"><i className="fas fa-map-marker-alt"></i><span>Central City Centre<br/>New Delhi, 110001</span></div>
              <div className="contact-item"><i className="fas fa-clock"></i><span>24/7 Emergency Support</span></div>
            </div>
          </div>
        </div>

        <div className="footer-bottom"><p>&copy; 2025 Medicare+. All rights reserved.</p></div>
      </div>
    </footer>
  );
}
