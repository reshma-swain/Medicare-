// src/contexts/DashboardContext.jsx

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import * as api from "../api/appointments";

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // load appointments from "server" on mount

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const list = await api.fetchAppointments();
        if (mounted) setAppointments(list);
      } catch (err) {
        setError(err.message || "Failed to load");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // listen to storage events to sync between tabs (keeps behavior predictable)

  useEffect(() => {
    const onStorage = async () => {
      try {
        const list = await api.fetchAppointments();
        setAppointments(list);
      } catch {}
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const openDashboard = useCallback(() => setIsOpen(true), []);
  const closeDashboard = useCallback(() => setIsOpen(false), []);
  const toggleDashboard = useCallback(() => setIsOpen(v => !v), []);

  const addAppointment = useCallback(async (appt) => {
    setLoading(true);
    setError(null);
    try {
      const saved = await api.createAppointment(appt);
      setAppointments(prev => [saved, ...prev]);

      // sync event for other tabs/components

      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("appointment-booked", { detail: saved }));
      return saved;
    } catch (err) {
      setError(err.message || "Failed to create appointment");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeAppointment = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.deleteAppointment(id);
      setAppointments(prev => prev.filter(a => a.id !== id));
      window.dispatchEvent(new Event("storage"));
      return true;
    } catch (err) {
      setError(err.message || "Failed to delete");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  //-------------------- NEW: update appointment (used by drawer to attach files/messages/reschedule) ---------------------------

  const updateAppointment = useCallback(async (id, updates) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await api.updateAppointment(id, updates);
      setAppointments(prev => prev.map(a => (a.id === id ? updated : a)));
      window.dispatchEvent(new Event("storage"));
      return updated;
    } catch (err) {
      setError(err.message || "Failed to update");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <DashboardContext.Provider value={{
      isOpen,
      openDashboard,
      closeDashboard,
      toggleDashboard,
      appointments,
      loading,
      error,
      addAppointment,
      removeAppointment,
      updateAppointment
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within a DashboardProvider");
  return ctx;
}
