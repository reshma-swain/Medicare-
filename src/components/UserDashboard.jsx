// src/components/UserDashboard.jsx

import React, { useEffect, useState } from "react";
import { useDashboard } from "../contexts/DashboardContext";
import AppointmentDetailsDrawer from "./AppointmentDetailsDrawer";

export default function UserDashboard() {
  const { isOpen, closeDashboard, appointments, removeAppointment, loading } = useDashboard();
  const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("currentUser") || "null"); } catch { return null; }
  });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeAppt, setActiveAppt] = useState(null);

  useEffect(() => {
    const onStorage = () => {
      try { setCurrentUser(JSON.parse(localStorage.getItem("currentUser") || "null")); } catch { setCurrentUser(null); }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === "Escape") closeDashboard(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, closeDashboard]);

  const openDetails = (appt) => {
    setActiveAppt(appt);
    setDrawerOpen(true);
  };

  const closeDetails = () => {
    setDrawerOpen(false);
    setActiveAppt(null);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="ud-overlay" role="dialog" aria-modal="true" aria-label="User dashboard" onClick={(e) => { if (e.target.classList.contains('ud-overlay')) closeDashboard(); }}>
        <div className="ud-panel">
          <header className="ud-header">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="ud-avatar" aria-hidden>
                {currentUser && currentUser.name ? currentUser.name.split(" ").map(n => n[0]).slice(0,2).join("").toUpperCase() : <i className="fas fa-user" />}
              </div>
              <div>
                <div className="ud-hello">Welcome back{currentUser && currentUser.name ? `, ${currentUser.name.split(" ")[0]}` : ""}</div>
                <div className="ud-sub">Your personalized dashboard</div>
              </div>
            </div>

            <button className="ud-close-btn" onClick={closeDashboard} aria-label="Close dashboard" title="Close">
              {/* SVG close icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </header>

          <div className="ud-body">
            <section className="ud-section">
              <h3 className="ud-section-title">Upcoming Appointments</h3>

              {loading ? (
                <p className="empty-note">Loading appointments…</p>
              ) : (appointments && appointments.length > 0 ? (
                <div className="appointments-list">
                  {appointments.map(a => (
                    <article
                      key={a.id}
                      className="appointment-card clickable"
                      onClick={() => openDetails(a)}
                      title="Click to view details"
                    >
                      <div className="appointment-left">
                        <div className="appointment-meta">
                          <strong className="appointment-patient">{a.patientName || a.patient || "You"}</strong>
                          <div className="appointment-sub">{a.specialty ? `${a.specialty} • ${a.doctorName || a.doctorId || ""}` : `${a.date} · ${a.time}`}</div>
                        </div>
                        <div className="appointment-datetime">{a.date} <span className="dot">•</span> {a.time}</div>
                      </div>

                      <div className="appointment-actions">
                        <button className="btn-secondary" onClick={(e) => { e.stopPropagation(); openDetails(a); }}>Details</button>
                        <button className="btn-plain" onClick={(e) => { e.stopPropagation(); removeAppointment(a.id); }}>Cancel</button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="empty-note">No upcoming appointments yet — book one from the Bookings section.</p>
              ))}
            </section>

            <section className="ud-section" style={{ marginTop: 18 }}>
              <h3 className="ud-section-title">Quick Actions</h3>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  className="btn-primary"
                  onClick={() => { closeDashboard(); document.querySelector('#appointments')?.scrollIntoView({ behavior: 'smooth' }); }}
                >
                  Book Appointment
                </button>
                <button className="btn-secondary" onClick={() => alert("Open AI consult (not implemented)")}>Consult AI</button>
              </div>
            </section>
          </div>
        </div>
      </div>

      <AppointmentDetailsDrawer open={drawerOpen} appointment={activeAppt} onClose={closeDetails} />
    </>
  );
}
