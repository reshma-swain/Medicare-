// src/pages/Home.jsx

import React from "react";
import { DashboardProvider } from "../contexts/DashboardContext";
import Navbar from "../components/Navbar";
import AuthModal from "../components/AuthModal";
import BookingForm from "../components/BookingForm";
import DoctorsGrid from "../components/DoctorsGrid";
import ChatbotWidget from "../components/ChatbotWidget";
import SuccessModal from "../components/SuccessModal";
import Footer from "../components/Footer";
import UserDashboard from "../components/UserDashboard";

function AppContent() {
 const openBooking = (detail = {}) => {
   window.dispatchEvent(new CustomEvent("open-booking", { detail: { ...detail, scrollTo: true } }));
 };

 const analyzeSeverity = (inputText) => {

   // quick local interaction -> show a tiny modal or a success message

   if (!inputText) {
     window.dispatchEvent(new CustomEvent("show-success", { detail: "Please enter symptoms to analyze." }));
     return;
   }
   window.dispatchEvent(new CustomEvent("show-success", { detail: "Severity: Mild — book appointment if symptoms persist." }));
 };

 return (
   <>
     <Navbar />
     <AuthModal />
     <SuccessModal />

     <main>
       {/* Hero */}
       <section className="hero" id="home">
         <div className="hero-content">
           <div className="hero-text">
             <h1>Your Health, Our Priority</h1>
             <p>
               Experience the future of healthcare with our AI-powered
               platform. Book appointments, consult with expert doctors, and
               manage your health records all in one place.
             </p>
             <div className="hero-buttons">
               <button className="btn-primary" id="book-appointment-hero" onClick={() => openBooking()}>
                 Book Appointment
               </button>
               <button className="btn-secondary" id="consult-ai" onClick={() => alert("AI consult not implemented")}>
                 Consult AI
               </button>
             </div>

             <div style={{ marginTop: 20, display: 'flex', gap: 8, alignItems: 'center' }}>
               <label style={{ color: 'rgba(255,255,255,0.85)' }}>Quick severity check:</label>
               <input id="severity-input" placeholder="e.g. fever, severe chest pain" style={{ padding: 8, borderRadius: 8 }} />
               <button className="btn-secondary" onClick={() => analyzeSeverity(document.getElementById('severity-input')?.value)}>Analyze</button>
             </div>
           </div>
           <div className="hero-image">
             <img
               src="https://images.unsplash.com/photo-1655913197756-fbcf99b273cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
               alt="Healthcare Professional"
             />
           </div>
         </div>
       </section>

       {/* Services */}
       <section className="services" id="services">
         <div className="container">
           <div className="section-header">
             <h2>Our Services</h2>
             <p>Comprehensive healthcare solutions for all your needs</p>
           </div>
           <div className="services-grid">
             <div className="service-card">
               <div className="service-icon">
                 <i className="fas fa-user-md"></i>
               </div>
               <h3>General Consultation</h3>
               <p>Comprehensive health checkups and primary care services</p>
               <button className="service-btn" onClick={() => window.dispatchEvent(new CustomEvent('open-doctors', { detail: { specialty: 'general' } }))}>Book Now</button>
             </div>

             <div className="service-card">
               <div className="service-icon">
                 <i className="fas fa-heartbeat"></i>
               </div>
               <h3>Cardiology</h3>
               <p>Expert heart care and cardiovascular health management</p>
               <button className="service-btn" onClick={() => window.dispatchEvent(new CustomEvent('open-doctors', { detail: { specialty: 'cardiology' } }))}>Book Now</button>
             </div>

             <div className="service-card">
               <div className="service-icon">
                 <i className="fas fa-brain"></i>
               </div>
               <h3>Neurology</h3>
               <p>Specialized care for neurological conditions and brain health</p>
               <button className="service-btn" onClick={() => window.dispatchEvent(new CustomEvent('open-doctors', { detail: { specialty: 'neurology' } }))}>Book Now</button>
             </div>

             <div className="service-card">
               <div className="service-icon">
                 <i className="fas fa-child"></i>
               </div>
               <h3>Pediatrics</h3>
               <p>Dedicated healthcare services for children and adolescents</p>
               <button className="service-btn" onClick={() => window.dispatchEvent(new CustomEvent('open-doctors', { detail: { specialty: 'pediatrics' } }))}>Book Now</button>
             </div>

             <div className="service-card">
               <div className="service-icon">
                 <i className="fas fa-microscope"></i>
               </div>
               <h3>Dermatology</h3>
               <p>Skin health and aesthetic dermatology treatments</p>
               <button className="service-btn" onClick={() => window.dispatchEvent(new CustomEvent('open-doctors', { detail: { specialty: 'dermatology' } }))}>Book Now</button>
             </div>

             <div className="service-card">
               <div className="service-icon">
                 <i className="fas fa-bone"></i>
               </div>
               <h3>Orthopedics</h3>
               <p>Bone, joint, and musculoskeletal health care</p>
               <button className="service-btn" onClick={() => window.dispatchEvent(new CustomEvent('open-doctors', { detail: { specialty: 'orthopedics' } }))}>Book Now</button>
             </div>
           </div>
         </div>
       </section>

       {/* Booking */}
       <section className="appointment-booking" id="appointments">
         <div className="container">
           <div className="section-header">
             <h2>Book Your Appointment</h2>
             <p>Easy online appointment scheduling with our expert doctors</p>
           </div>
           <div className="booking-form-container">
             <BookingForm />
           </div>
         </div>
       </section>

       {/* Doctors */}
       <DoctorsGrid />

       {/* About */}
       <section className="about" id="about">
         <div className="container">
           <div className="about-content">
             <div className="about-text">
               <h2>About HealthCare AI</h2>
               <p>
                 We are revolutionizing healthcare with cutting-edge AI
                 technology and exceptional medical expertise. Our platform
                 connects patients with top-rated doctors while providing
                 intelligent health insights and personalized care
                 recommendations.
               </p>
               <div className="stats">
                 <div className="stat">
                   <h3>50,000+</h3>
                   <p>Patients Served</p>
                 </div>
                 <div className="stat">
                   <h3>100+</h3>
                   <p>Expert Doctors</p>
                 </div>
                 <div className="stat">
                   <h3>24/7</h3>
                   <p>AI Support</p>
                 </div>
                 <div className="stat">
                   <h3>95%</h3>
                   <p>Satisfaction Rate</p>
                 </div>
               </div>
             </div>
             <div className="about-image">
               <img
                 src="https://images.unsplash.com/photo-1720180246349-584d40758674?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                 alt="Modern Healthcare Facility"
               />
             </div>
           </div>
         </div>
       </section>
     </main>

     <ChatbotWidget />

     {/* UserDashboard consumes the DashboardContext internally */}
     <UserDashboard />

     <Footer />
   </>
 );
}

export default function Home() {
 return (
   <DashboardProvider>
     <AppContent />
   </DashboardProvider>
 );
}


