import React, { createContext, useContext, useState, useEffect } from "react";
import {
  loginUser,
  registerUser,
  fetchMe,
} from "./api";

// AuthContext for user and token management
const AuthContext = createContext();

// PUBLIC_INTERFACE
export function useAuth() {
  /** React hook to access authentication state and helpers. */
  return useContext(AuthContext);
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Top-level provider for authentication state (user, token, login/logout/registration). */
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null
  );
  const [loading, setLoading] = useState(true);

  // Attempt to load user info if token exists
  useEffect(() => {
    async function checkAuth() {
      if (token) {
        try {
          const me = await fetchMe(token);
          setUser(me);
        } catch (e) {
          setUser(null);
          setToken(null);
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    }
    checkAuth();
  }, [token]);

  // PUBLIC_INTERFACE
  async function login({ username, password }) {
    const result = await loginUser(username, password);
    setToken(result.access_token);
    localStorage.setItem("token", result.access_token);
    const me = await fetchMe(result.access_token);
    setUser(me);
    return me;
  }

  // PUBLIC_INTERFACE
  async function register({ username, email, password }) {
    const newUser = await registerUser({ username, email, password });
    return newUser;
  }

  // PUBLIC_INTERFACE
  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
