
import { useState } from "react";
import "./AuthModal.css";

const API_URL = "http://localhost:5000";

export default function AuthModal({ onClose, onLogin }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint =
        mode === "login" ? "/api/auth/login" : "/api/auth/register";

      const body =
        mode === "login"
          ? { email, password }
          : { name, email, password };

      const response = await fetch(API_URL + endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Authentication failed");
      }

      // Temporary demo session. We'll upgrade this before production.
      sessionStorage.setItem("autobid_token", result.token);
      sessionStorage.setItem(
        "autobid_user",
        JSON.stringify(result.user)
      );

      onLogin(result.user);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div
        className="auth-card"
        role="dialog"
        aria-modal="true"
        aria-label="AutoBid SA account"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="auth-close"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        <div className="auth-logo">
          AutoBid<span>SA</span>
        </div>

        <p className="auth-eyebrow">YOUR AUTOMOTIVE ACCOUNT</p>

        <h2>
          {mode === "login" ? "Welcome back." : "Join the movement."}
        </h2>

        <p className="auth-description">
          {mode === "login"
            ? "Sign in to your AutoBid SA account."
            : "Create your free account. Auction bidding requires an active R250 monthly membership."}
        </p>

        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <label>
              Full name
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                minLength={2}
                maxLength={100}
                autoComplete="name"
                placeholder="Your full name"
              />
            </label>
          )}

          <label>
            Email address
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={mode === "register" ? 12 : undefined}
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              placeholder={
                mode === "register"
                  ? "At least 12 characters"
                  : "Your password"
              }
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Sign In →"
                : "Create Account →"}
          </button>
        </form>

        <p className="auth-switch">
          {mode === "login"
            ? "New to AutoBid SA?"
            : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError("");
            }}
          >
            {mode === "login" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
