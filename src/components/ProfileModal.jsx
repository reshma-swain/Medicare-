// src/components/ProfileModal.jsx

import React, { useEffect, useState } from 'react';

export default function ProfileModal() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('currentUser') || 'null'); } catch { return null; }
  });

  useEffect(() => {
    const onOpen = () => {
      try { setUser(JSON.parse(localStorage.getItem('currentUser') || 'null')); } catch { setUser(null); }
      setOpen(true);
    };
    window.addEventListener('open-profile', onOpen);
    return () => window.removeEventListener('open-profile', onOpen);
  }, []);

  const close = () => setOpen(false);

  const save = (e) => {
    e.preventDefault();
    const name = e.target['p-name'].value.trim();
    const phone = e.target['p-phone'].value.trim();
    const role = e.target['p-role'].value || 'patient';
    if (!name) return alert('Name required');
    const updated = { ...(user||{}), name, phone, role };

    // persist to users list too
    
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const idx = users.findIndex(u => u.email === updated.email);
      if (idx >= 0) users[idx] = updated;
      else users.push(updated);
      localStorage.setItem('users', JSON.stringify(users));
    } catch {}
    localStorage.setItem('currentUser', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('show-success', { detail: 'Profile updated' }));
    close();
  };

  if (!open) return null;

  return (
    <div className="modal" style={{ display: 'block' }} onClick={(e)=>{ if (e.target.classList.contains('modal')) setOpen(false); }}>
      <div className="modal-content">
        <span className="close" onClick={close}>&times;</span>
        <form className="auth-form" onSubmit={save}>
          <h2>Edit Profile</h2>
          <div className="form-group"><label>Name</label><input name="p-name" defaultValue={user?.name||''} required /></div>
          <div className="form-group"><label>Phone</label><input name="p-phone" defaultValue={user?.phone||''} /></div>
          <div className="form-group"><label>Role</label>
            <select name="p-role" defaultValue={user?.role||'patient'}>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>
          <button className="auth-btn" type="submit">Save</button>
        </form>
      </div>
    </div>
  );
}
