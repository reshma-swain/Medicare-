// src/components/DoctorsGrid.jsx

import React, { useEffect, useState, useRef } from 'react';
import { doctorsData } from '../data/doctors';

export default function DoctorsGrid() {
  // flatten doctors for demo
  const flat = Object.values(doctorsData).flat();
  const [highlight, setHighlight] = useState(null);
  const gridRef = useRef();

  useEffect(() => {
    const onOpen = (e) => {
      const detail = e.detail || {};
      if (detail.specialty) {
        setHighlight(detail.specialty);

        // scroll to doctors section
        setTimeout(() => {
          document.getElementById('doctors')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 120);
        
        setTimeout(() => setHighlight(null), 2000); 
      } else if (detail.scrollTo) {
        document.getElementById('doctors')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    window.addEventListener('open-doctors', onOpen);
    return () => window.removeEventListener('open-doctors', onOpen);
  }, []);

  const handleBookClick = (doc) => {

    // open booking form and prefill
    
    window.dispatchEvent(new CustomEvent('open-booking', { detail: { specialty: doc.specialty.toLowerCase(), doctorId: doc.id, scrollTo: true } }));
  };

  return (
    <section className="doctors" id="doctors" ref={gridRef}>
      <div className="container">
        <div className="section-header">
          <h2>Our Expert Doctors</h2>
          <p>Meet our team of experienced healthcare professionals</p>
        </div>
        <div className="doctors-grid">
          {flat.map(doc => {
            const docSpecKey = doc.specialty ? doc.specialty.toLowerCase() : '';
            const isHighlighted = highlight && (docSpecKey.includes(highlight) || highlight.includes(docSpecKey));
            return (
              <div className={`doctor-card ${isHighlighted ? 'highlighted' : ''}`} key={doc.id}>
                <div className="doctor-image">
                  <img src="https://images.unsplash.com/photo-1587557983735-f05198060b52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" alt={doc.name} />
                </div>
                <div className="doctor-info">
                  <h3>{doc.name}</h3>
                  <p className="specialty">{doc.specialty}</p>
                  <p className="experience">{doc.experience} experience</p>
                  <div className="rating">
                    <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                    <span>{doc.rating}</span>
                  </div>
                  <button className="btn-outline" onClick={() => handleBookClick(doc)}>Book Appointment</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
