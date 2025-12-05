// src/api/appointments.js
// Simple mock API for appointments. Uses localStorage as persistence and returns Promises
// so i can swap it with a real fetch() backend easily.

const STORAGE_KEY = "appointments";

function delay(ms = 400) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetchAppointments() {
  await delay(200);
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || "[]";
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function createAppointment(appt) {
  await delay(250);
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || "[]";
    const list = JSON.parse(raw);
    list.unshift(appt);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return appt;
  } catch (err) {
    throw new Error("Failed to save appointment");
  }
}

export async function deleteAppointment(id) {
  await delay(200);
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || "[]";
    const list = JSON.parse(raw).filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return true;
  } catch {
    throw new Error("Failed to delete");
  }
}

// NEW: update appointment (merge updates)
export async function updateAppointment(id, updates = {}) {
  await delay(250);
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || "[]";
    const list = JSON.parse(raw);
    const idx = list.findIndex(a => a.id === id);
    if (idx === -1) throw new Error("Appointment not found");
    const updated = { ...list[idx], ...updates, updatedAt: new Date().toISOString() };
    list[idx] = updated;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return updated;
  } catch (err) {
    throw new Error(err.message || "Failed to update appointment");
  }
}
