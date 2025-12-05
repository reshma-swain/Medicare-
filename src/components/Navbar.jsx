// src/components/Navbar.jsx

import React, { useEffect, useState } from "react";
import { useDashboard } from "../contexts/DashboardContext";

export default function Navbar() {

  // keep theme in LOCALSTORAGE so user preference persists

  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  // keep currentUser from localStorage so menu shows login/logout correctly

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser") || "null");
    } catch {
      return null;
    }
  });

  const [menuActive, setMenuActive] = useState(false);

  const { openDashboard } = useDashboard();

  useEffect(() => {
    
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {

    // listen to changes to currentUser made in other components

    const onStorage = () => {
      try {
        setCurrentUser(JSON.parse(localStorage.getItem("currentUser") || "null"));
      } catch {
        setCurrentUser(null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggleTheme = () => setTheme(t => (t === "light" ? "dark" : "light"));

  // For opening auth modal — other components listen to this event

  const openAuth = (mode) => window.dispatchEvent(new CustomEvent("open-auth", { detail: mode }));

  const handleLogout = () => {
    try {
      localStorage.removeItem("currentUser");

      // notify other tabs/components

      window.dispatchEvent(new Event("storage"));

      // optional success notification that other components can listen to

      window.dispatchEvent(new CustomEvent("show-success", { detail: "Logged out" }));

      // update local state immediately

      setCurrentUser(null);
      setMenuActive(false);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  // allow enter/space to toggle hamburger when focused

  const onHamburgerKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      setMenuActive(m => !m);
    }
  };

  return (
    <nav className="navbar" id="navbar" role="navigation" aria-label="Main">
      <div className="nav-container">
        <div className="nav-logo" aria-hidden>
          <i className="fas fa-heartbeat" />
          <span>Medicare+</span>
        </div>

        <div className={`nav-menu ${menuActive ? "active" : ""}`} id="nav-menu">
          <ul className="nav-list">
            <li className="nav-item"><a href="#home" className="nav-link">Home</a></li>

            <li className="nav-item dropdown">
              <a href="#services" className="nav-link">Services <i className="fas fa-chevron-down" aria-hidden></i></a>
              <div className="dropdown-content" aria-hidden>
                <a href="#consultation">General Consultation</a>
                <a href="#cardiology">Cardiology</a>
                <a href="#neurology">Neurology</a>
                <a href="#pediatrics">Pediatrics</a>
                <a href="#dermatology">Dermatology</a>
                <a href="#orthopedics">Orthopedics</a>
              </div>
            </li>

            <li className="nav-item"><a href="#appointments" className="nav-link">Appointments</a></li>
            <li className="nav-item"><a href="#doctors" className="nav-link">Doctors</a></li>
            <li className="nav-item"><a href="#about" className="nav-link">About</a></li>
            <li className="nav-item"><a href="#contact" className="nav-link">Contact</a></li>

            {/* Dashboard button appears only if user is logged in in some flows,
                but keep it visible to quickly open dashboard per previous behavior */}
                
            {currentUser && (
              <li className="nav-item">
                <button
                  type="button"
                  className="nav-link btn-link"
                  onClick={() => { openDashboard(); setMenuActive(false); }}
                >
                  Dashboard
                </button>
              </li>
            )}
          </ul>
        </div>

        <div className="nav-actions">
          <button
            className="theme-toggle"
            id="theme-toggle"
            onClick={toggleTheme}
            title="Toggle Theme"
            aria-pressed={theme === "dark"}
          >
            <i className={theme === "light" ? "fas fa-moon" : "fas fa-sun"} id="theme-icon" />
          </button>

          {!currentUser ? (
            <>
              <button className="login-btn" id="login-btn" onClick={() => openAuth("login")}>Login</button>
              <button className="signup-btn" id="signup-btn" onClick={() => openAuth("signup")}>Sign Up</button>
            </>
          ) : (
            <>
              <div className="user-menu" id="user-menu" style={{ display: "flex", alignItems: "center" }}>
                <div className="user-avatar" aria-hidden><i className="fas fa-user" /></div>

                <div className="user-info">
                  <span id="user-name">{currentUser.name}</span>
                  <button className="logout-btn" id="logout-btn" onClick={handleLogout}>Logout</button>
                </div>
              </div>
            </>
          )}

          <div
            className="hamburger"
            id="hamburger"
            onClick={() => setMenuActive(m => !m)}
            aria-label="Toggle menu"
            aria-expanded={menuActive}
            role="button"
            tabIndex={0}
            onKeyDown={onHamburgerKey}
          >
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>
    </nav>
  );
}
