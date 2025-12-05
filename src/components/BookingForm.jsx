// src/components/BookingForm.jsx

import React, { useEffect, useState, useRef } from "react";
import { doctorsData } from "../data/doctors";
import { useDashboard } from "../contexts/DashboardContext";

export default function BookingForm() {
  const { addAppointment, openDashboard } = useDashboard();

  const [specialty, setSpecialty] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("currentUser") || "null"); } catch { return null; }
  });
  const [doctorOptions, setDoctorOptions] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const rootRef = useRef();

  useEffect(() => {
    const saved = localStorage.getItem("currentUser");
    if (saved) {
      try { setCurrentUser(JSON.parse(saved)); } catch { setCurrentUser(null); }
    }

    // set min date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const iso = tomorrow.toISOString().split("T")[0];
    const el = document.getElementById("appointment-date");
    if (el) el.setAttribute("min", iso);

    const onStorage = () => {
      try { setCurrentUser(JSON.parse(localStorage.getItem("currentUser") || "null")); } catch { setCurrentUser(null); }
    };
    window.addEventListener("storage", onStorage);

    // listen to programmatic open / prefill events
    const onOpenBooking = (e) => {
      const detail = e.detail || {};
      if (detail.scrollTo) {
        rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      if (detail.specialty) setSpecialty(detail.specialty);
      if (detail.doctorId) setDoctorId(detail.doctorId);
      // focus first field
      setTimeout(() => {
        document.getElementById("specialty")?.focus();
      }, 350);
    };
    window.addEventListener("open-booking", onOpenBooking);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("open-booking", onOpenBooking);
    };
  }, []);

  useEffect(() => {
    if (specialty && doctorsData[specialty]) setDoctorOptions(doctorsData[specialty]);
    else setDoctorOptions([]);

    // if specialty changed, clear doctor unless the id belongs

    if (doctorId) {
      const found = doctorOptions.find(d => String(d.id) === String(doctorId));
      if (!found) setDoctorId("");
    }
  }, [specialty, /* doctorOptions intentionally not direct dep to avoid loop */]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {

      // Force login first — user must log in before booking

      window.dispatchEvent(new CustomEvent("open-auth", { detail: "login" }));

      // scroll to booking form after login

      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("open-booking", { detail: { scrollTo: true } }));
      }, 300);
      return;
    }

    if (!specialty || !doctorId || !date || !time) {
      return alert("Please fill all required fields.");
    }

    // find doctor name
    const doc = (doctorsData[specialty] || []).find(d => String(d.id) === String(doctorId));
    const appointment = {
      id: "apt_" + Date.now().toString(),
      specialty,
      doctorId,
      doctorName: doc ? doc.name : null,
      date,
      time,
      reason: reason || "",
      patientId: currentUser.id || null,
      patientName: currentUser.name || "",
      status: "confirmed",
      createdAt: new Date().toISOString(),
      attachments: [],
      messages: []
    };

    setSubmitting(true);
    try {
      await addAppointment(appointment); // persists via mock API

      // After successful booking AND because user is logged in, open the dashboard
      
      openDashboard();

      // Keep backward compatibility with other parts of your app
      window.dispatchEvent(new CustomEvent("appointment-booked", { detail: appointment }));

      // show your existing success modal if present
      const successEl = document.getElementById("success-modal");
      if (successEl) {
        try { successEl.style.display = "block"; } catch {}
      } else {
        window.dispatchEvent(new CustomEvent("show-success", { detail: "Appointment booked" }));
      }

      // reset form
      setSpecialty("");
      setDoctorId("");
      setDate("");
      setTime("");
      setReason("");
    } catch (err) {
      alert("Failed to book appointment. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="booking-form" id="booking-form" ref={rootRef} onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="specialty">Select Specialty</label>
          <select id="specialty" value={specialty} onChange={(e) => setSpecialty(e.target.value)} required>
            <option value="">Choose a specialty</option>
            <option value="general">General Medicine</option>
            <option value="cardiology">Cardiology</option>
            <option value="neurology">Neurology</option>
            <option value="pediatrics">Pediatrics</option>
            <option value="dermatology">Dermatology</option>
            <option value="orthopedics">Orthopedics</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="doctor">Select Doctor</label>
          <select id="doctor" value={doctorId} onChange={(e) => setDoctorId(e.target.value)} required>
            <option value="">Choose a doctor</option>
            {doctorOptions.map(d => (
              <option key={d.id} value={d.id}>
                {`${d.name} - ${d.experience} (★${d.rating})`}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="appointment-date">Preferred Date</label>
          <input id="appointment-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>

        <div className="form-group">
          <label htmlFor="appointment-time">Preferred Time</label>
          <select id="appointment-time" value={time} onChange={(e) => setTime(e.target.value)} required>
            <option value="">Select time</option>
            <option value="09:00">09:00 AM</option>
            <option value="09:30">09:30 AM</option>
            <option value="10:00">10:00 AM</option>
            <option value="10:30">10:30 AM</option>
            <option value="11:00">11:00 AM</option>
            <option value="11:30">11:30 AM</option>
            <option value="14:00">02:00 PM</option>
            <option value="14:30">02:30 PM</option>
            <option value="15:00">03:00 PM</option>
            <option value="15:30">03:30 PM</option>
            <option value="16:00">04:00 PM</option>
            <option value="16:30">04:30 PM</option>
          </select>
        </div>
      </div>

      <div className="form-group full-width">
        <label htmlFor="appointment-reason">Reason for Visit</label>
        <textarea
          id="appointment-reason"
          rows="4"
          placeholder="Please describe your symptoms or reason for the appointment"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </div>

      <button type="submit" className="btn-primary" disabled={submitting}>
        {submitting ? "Booking..." : "Book Appointment"}
      </button>
    </form>
  );
}
