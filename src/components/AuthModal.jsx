// src/components/AuthModal.jsx
import React, { useEffect, useState } from "react";

export default function AuthModal() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("login"); // "login" or "signup"
  const [role, setRole] = useState("patient"); // used only for signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    function onOpen(e) {
      const requested = e?.detail || "login";
      setMode(requested === "signup" ? "signup" : "login");
      setOpen(true);
    }
    window.addEventListener("open-auth", onOpen);
    return () => window.removeEventListener("open-auth", onOpen);
  }, []);

  const close = () => {
    setOpen(false);
    setEmail("");
    setPassword("");
    setName("");
    setRememberMe(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = {
      id: `user_${Date.now()}`,
      name: mode === "signup" ? name || email.split("@")[0] : email.split("@")[0],
      email,
      role: mode === "signup" ? role : "patient",
      remember: rememberMe,
    };

    localStorage.setItem("currentUser", JSON.stringify(user));
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(
      new CustomEvent("show-success", {
        detail: mode === "signup" ? "Account created" : "Logged in",
      })
    );

    close();
  };

  const handleForgot = (e) => {
    e.preventDefault();
    window.dispatchEvent(
      new CustomEvent("show-info", { detail: "Forgot password flow not implemented." })
    );
  };

  if (!open) return null;

  return (
    <div className="modal" style={{ display: "block" }} role="dialog" aria-modal="true">
      <div className="modal-content auth-modal" style={{ maxWidth: 620 }}>
        <button aria-label="Close" className="close" onClick={close}>
          &times;
        </button>

        {/* HEADER */}
        <h2
          style={{
            textAlign: "center",
            marginTop: 24,
            fontSize: 34,
            fontWeight: 800,
          }}
        >
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </h2>

        <p style={{ textAlign: "center", color: "var(--text-secondary)", marginBottom: 20 }}>
          {mode === "login" ? "Login to your account" : "Register a new account"}
        </p>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
          style={{ padding: "0 32px 28px" }}
        >
          {/* SIGNUP NAME */}
          {mode === "signup" && (
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label style={{ fontWeight: 700, marginBottom: 6 }}>Name</label>
              <input
                type="text"
                value={name}
                required
                placeholder="Full name"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          {/* SIGNUP ROLE */}
          {mode === "signup" && (
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label style={{ fontWeight: 700, marginBottom: 6 }}>Register as</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ padding: 12, borderRadius: 10 }}
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>
          )}

          {/* EMAIL */}
          <div className="form-group" style={{ marginBottom: 14 }}>
            <label style={{ fontWeight: 700, marginBottom: 6 }}>Email</label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <div className="form-group" style={{ marginBottom: 10 }}>
            <label style={{ fontWeight: 700, marginBottom: 6 }}>Password</label>
            <input
              type="password"
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* REMEMBER + FORGOT */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 8,
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
                color: "var(--text-secondary)",
              }}
            >
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ width: 16, height: 16 }}
              />
              <span style={{ fontSize: 14 }}>Remember me</span>
            </label>

            <button
              onClick={handleForgot}
              className="auth-link"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--primary-color)",
                fontWeight: 600,
              }}
            >
              Forgot password?
            </button>
          </div>

          {/* SUBMIT BUTTON — SHRUNK + CENTERED */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 22 }}>
            <button
              type="submit"
              className="btn-primary auth-submit-btn"
              style={{
                width: "auto",
                minWidth: "100px",
                padding: "12px 32px",
                borderRadius: 14,
                fontSize: 17,
                fontWeight: 700,
                background: "linear-gradient(90deg,#6a4ef0,#7c3aed)",
                boxShadow: "0 14px 32px rgba(124,58,237,0.18)",
                textAlign: "center",
              }}
            >
              {mode === "login" ? "Login" : "Create account"}
            </button>
          </div>

          {/* SWITCH LOGIN / SIGN-UP */}
          <p style={{ textAlign: "center", marginTop: 18, color: "var(--text-secondary)" }}>
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--primary-color)",
                    fontWeight: 700,
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--primary-color)",
                    fontWeight: 700,
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Login
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}
