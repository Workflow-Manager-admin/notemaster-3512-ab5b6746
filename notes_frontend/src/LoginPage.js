import React, { useState } from "react";
import { useAuth } from "./AuthContext";

function LoginPage({ onNavigateToRegister }) {
  const { login } = useAuth();
  const [fields, setFields] = useState({ username: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setFields((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await login(fields);
    } catch (err) {
      setError("Invalid username or password.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Username
          <input
            name="username"
            autoFocus
            value={fields.username}
            onChange={handleChange}
            disabled={submitting}
            autoComplete="username"
          />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            value={fields.password}
            onChange={handleChange}
            disabled={submitting}
            autoComplete="current-password"
          />
        </label>
        {error && <div className="auth-error">{error}</div>}

        <button className="btn" type="submit" disabled={submitting || !fields.username || !fields.password}>
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>
      <div className="auth-footer">
        <span>Don't have an account?</span>
        <button className="btn btn-link" onClick={onNavigateToRegister}>
          Register
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
