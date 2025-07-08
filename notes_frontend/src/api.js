//
// API utility for interacting with the backend REST API with JWT auth support.
//

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8000";

// PUBLIC_INTERFACE
export async function loginUser(username, password) {
  /** Obtain JWT token from backend. */
  const data = new URLSearchParams();
  data.append("username", username);
  data.append("password", password);
  try {
    const response = await fetch(`${API_BASE}/auth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: data,
    });
    if (!response.ok) {
      throw new Error("Invalid login.");
    }
    return await response.json(); // { access_token, token_type }
  } catch (error) {
    throw error;
  }
}

// PUBLIC_INTERFACE
export async function registerUser({ username, email, password }) {
  /** Register a new user. */
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.detail || "Registration failed.");
  }
  return await response.json();
}

// PUBLIC_INTERFACE
export async function fetchMe(token) {
  /** Get user info from token. */
  const response = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (response.ok) return await response.json();
  throw new Error("Session expired.");
}

// PUBLIC_INTERFACE
export async function fetchNotes(token) {
  /** Fetch list of user notes. */
  const response = await fetch(`${API_BASE}/notes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (response.ok) return await response.json();
  throw new Error("Failed to fetch notes.");
}

// PUBLIC_INTERFACE
export async function createNote(token, note) {
  /** Create new note: {title, content} */
  const response = await fetch(`${API_BASE}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(note),
  });
  if (response.status === 201) return await response.json();
  throw new Error("Failed to create note.");
}

// PUBLIC_INTERFACE
export async function updateNote(token, noteId, updates) {
  /** Update a note. */
  const response = await fetch(`${API_BASE}/notes/${noteId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });
  if (response.ok) return await response.json();
  throw new Error("Failed to update note.");
}

// PUBLIC_INTERFACE
export async function deleteNote(token, noteId) {
  /** Delete a note. */
  const response = await fetch(`${API_BASE}/notes/${noteId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status === 204) return true;
  throw new Error("Failed to delete note.");
}
