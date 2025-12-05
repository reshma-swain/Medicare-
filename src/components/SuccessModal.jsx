// src/components/SuccessModal.jsx

import React, { useEffect, useState } from 'react';

const SUCCESS_SOUND = "data:audio/wav;base64,UklGRlgAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YVgAAAAA"; // tiny placeholder beep

export default function SuccessModal() {
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    const show = (e) => setMsg(e.detail || 'Success');
    const booked = (e) => setMsg('Appointment booked successfully!');
    window.addEventListener('show-success', show);
    window.addEventListener('appointment-booked', booked);
    return () => {
      window.removeEventListener('show-success', show);
      window.removeEventListener('appointment-booked', booked);
    };
  }, []);

  useEffect(() => {
    if (!msg) return;

    // sound + vibration if enabled

    const enabled = localStorage.getItem('notifySound') === 'true';
    if (enabled) {
      try {
        const a = new Audio(SUCCESS_SOUND);
        a.play().catch(()=>{/* ignore */});
      } catch {}
      try { navigator.vibrate?.(120); } catch {}
    }
    
    // auto-hide after 5.8s

    const t = setTimeout(() => setMsg(null), 5800);
    return () => clearTimeout(t);
  }, [msg]);

  if (!msg) return null;

  return (
    <div className="modal" style={{display: 'block'}} id="success-modal" onClick={(e) => { if (e.target.id === 'success-modal') setMsg(null); }}>
      <div className="modal-content success-modal-content">
        <div className="success-icon"><i className="fas fa-check-circle"></i></div>
        <h3>{msg}</h3>
        <p>Your action completed successfully.</p>
        <button className="btn-primary" id="success-close" onClick={() => setMsg(null)}>OK</button>
      </div>
    </div>
  );
}
