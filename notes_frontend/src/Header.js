import React from "react";
import { useAuth } from "./AuthContext";

function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="header">
      <span className="logo">📝 NoteMaster</span>
      <nav className="nav">
        {isAuthenticated ? (
          <>
            <span className="nav-user">{user ? user.username : ""}</span>
            <button className="btn btn-sm btn-logout" onClick={logout}>
              Logout
            </button>
          </>
        ) : null}
      </nav>
    </header>
  );
}

export default Header;
