import React, { useState } from "react";
import { AuthProvider, useAuth } from "./AuthContext";
import "./App.css";
import "./index.css";
import NotesPage from "./NotesPage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import Header from "./Header";

// Simple in-app router for "login", "register", "notes"
function Router() {
  const { isAuthenticated } = useAuth();
  const [route, setRoute] = useState(
    () => window.location.hash.slice(1) || (isAuthenticated ? "notes" : "login")
  );

  React.useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash.slice(1));
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  React.useEffect(() => {
    if (!isAuthenticated && route !== "register") {
      window.location.hash = "login";
    }
    if (isAuthenticated && (route === "login" || route === "")) {
      window.location.hash = "notes";
    }
  }, [isAuthenticated, route]);

  if (route === "register") return <RegisterPage onNavigateToLogin={() => { window.location.hash = "login"; }} />;
  if (!isAuthenticated) return <LoginPage onNavigateToRegister={() => { window.location.hash = "register"; }} />;
  // Default (logged in): notes page
  return <NotesPage />;
}

// PUBLIC_INTERFACE
function App() {
  return (
    <AuthProvider>
      <div className="app-shell">
        <Header />
        <main className="main-content">
          <Router />
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
