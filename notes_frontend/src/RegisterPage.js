import React, { useState } from "react";
import { useAuth } from "./AuthContext";

function RegisterPage({ onNavigateToLogin }) {
  const { register } = useAuth();
  const [fields, setFields] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleChange(e) {
    setFields((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (fields.password !== fields.password2) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setSubmitting(true);
    setSuccess(false);
    try {
      await register(fields);
      setSuccess(true);
    } catch (err) {
      setError((err && err.message) || "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Username
          <input name="username" value={fields.username} onChange={handleChange} autoComplete="username" />
        </label>
        <label>
          Email
          <input name="email" value={fields.email} onChange={handleChange} autoComplete="email" type="email" />
        </label>
        <label>
          Password
          <input name="password" type="password" value={fields.password} onChange={handleChange} autoComplete="new-password" />
        </label>
        <label>
          Repeat password
          <input name="password2" type="password" value={fields.password2} onChange={handleChange} autoComplete="new-password" />
        </label>
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">Registered! Please <button className="btn-link" type="button" onClick={onNavigateToLogin}>log in</button>.</div>}

        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? "Registering..." : "Register"}
        </button>
      </form>
      <div className="auth-footer">
        <span>Already have an account?</span>
        <button className="btn btn-link" onClick={onNavigateToLogin}>
          Login
        </button>
      </div>
    </div>
  );
}

export default RegisterPage;
