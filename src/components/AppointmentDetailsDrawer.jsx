// src/components/AppointmentDetailsDrawer.jsx
import React, { useEffect, useRef, useState } from "react";

/**
 * Props:
 * - open (bool)
 * - onClose (fn)
 * - appointment (object) { id, patientName, specialty, doctorName, date, time, datetime, status, reason }
 * - onSendMessage (async fn(message, files[], appointmentId)) optional
 */
export default function AppointmentDetailsDrawer({ open, onClose, appointment = {}, onSendMessage }) {
  const [composerOpen, setComposerOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [sending, setSending] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    if (!open) {
      // reset when closing
      setComposerOpen(false);
      setMessage("");
      setFiles([]);
      setSending(false);
    }
  }, [open]);

  if (!open) return null;

  const toggleComposer = () => {
    setComposerOpen(p => !p);
    // slight delay to focus the textarea after it opens
    setTimeout(() => {
      const ta = document.getElementById("drawer-message-textarea");
      if (ta) ta.focus();
    }, 120);
  };

  const onFilesSelected = (e) => {
    const chosen = Array.from(e.target.files || []);
    const allowed = chosen.filter(f => /pdf|image\//i.test(f.type));
    if (allowed.length < chosen.length) {
      // ignore unsupported files
      alert("Only PDF and image files are accepted.");
    }
    setFiles(prev => [...prev, ...allowed]);
    // reset input so same files can be re-selected if needed
    if (fileRef.current) fileRef.current.value = null;
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!message.trim() && files.length === 0) {
      alert("Please add a message or attach a file before sending.");
      return;
    }

    setSending(true);
    try {
      if (typeof onSendMessage === "function") {
        await onSendMessage(message.trim(), files, appointment?.id);
      } else {
        const fd = new FormData();
        fd.append("message", message.trim());
        fd.append("appointmentId", appointment?.id || "");
        files.forEach((f, i) => fd.append(`file_${i}`, f));
        // placeholder endpoint — replace with your real endpoint
        await fetch("/api/appointments/message", { method: "POST", body: fd });
      }

      // success UI
      setMessage("");
      setFiles([]);
      setComposerOpen(false);
      alert("Message sent successfully.");
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("Failed to send message. Check console for details.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="drawer-overlay" role="dialog" aria-modal="true">
      <aside className="drawer-panel" aria-label="Appointment details">
        <div className="drawer-header">
          <h3 style={{ margin: 0 }}>Appointment Details</h3>
          <button className="drawer-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div style={{ padding: "8px 0 20px" }}>
          <dl style={{ lineHeight: 1.7 }}>
            <div><strong>Patient:</strong> {appointment?.patientName || appointment?.patient || "—"}</div>
            <div><strong>Specialty:</strong> {appointment?.specialty || "—"}</div>
            <div><strong>Doctor:</strong> {appointment?.doctorName || appointment?.doctor || "—"}</div>
            <div><strong>Date & Time:</strong> {appointment?.date ? `${appointment.date}${appointment.time ? ` @ ${appointment.time}` : ""}` : (appointment?.datetime || "—")}</div>
            <div><strong>Status:</strong> {appointment?.status || "—"}</div>
            <div><strong>Reason:</strong> {appointment?.reason || "—"}</div>
          </dl>

          <hr style={{ margin: "14px 0" }} />

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <button className="btn-primary" onClick={toggleComposer} aria-expanded={composerOpen}>
              {composerOpen ? "Close Composer" : "Message / Reschedule"}
            </button>

            <button
              className="btn-secondary"
              onClick={() => {
                // scroll to (#booking-form) for booking/reschedule flow
                const el = document.querySelector("#booking-form");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "center" });
                  // optionally close drawer to show booking form clearly
                  // onClose && onClose();
                } else {
                  alert("Booking form not found on page.");
                }
              }}
            >
              Book / Reschedule
            </button>

            <button className="btn-plain" onClick={onClose}>Close</button>
          </div>

          {composerOpen && (
            <form onSubmit={handleSend} style={{ marginTop: 18 }}>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 700 }}>Message to doctor</label>
              <textarea
                id="drawer-message-textarea"
                rows="5"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write a short message: symptoms, questions, or reschedule request..."
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 10,
                  border: "1px solid var(--border-color)",
                  background: "var(--background-color)",
                  color: "var(--text-primary)",
                  resize: "vertical",
                }}
              />

              <div style={{ marginTop: 12 }}>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 700 }}>Attach files (PDF, images)</label>
                <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                  <input ref={fileRef} type="file" accept="application/pdf,image/*" multiple onChange={onFilesSelected} />
                  {files.length > 0 && (
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {files.map((f, i) => (
                        <div key={i} style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "8px 10px",
                          borderRadius: 8,
                          background: "var(--surface-color)",
                          border: "1px solid var(--border-color)"
                        }}>
                          <span style={{ fontSize: 13, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</span>
                          <button type="button" className="btn-plain" onClick={() => removeFile(i)} aria-label="Remove file">×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
                <button className="btn-primary" type="submit" disabled={sending}>
                  {sending ? "Sending…" : "Send"}
                </button>
                <button type="button" className="btn-plain" onClick={() => { setComposerOpen(false); setMessage(""); setFiles([]); }}>Cancel</button>
              </div>
            </form>
          )}
        </div>
      </aside>
    </div>
  );
}
