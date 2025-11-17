import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("pcml_user");
    if (stored) setUser(stored);
  }, []);

  function handleLogout() {
    localStorage.removeItem("pcml_user");
    setUser(null);
    navigate("/");
  }

  return (
    <header className="header">
      <div className="header_left">
        <Link to="/" className="btn-link">🏠 Home</Link>
      </div>

      <h1 className="header_title">
        <span className="header_title_main">Car Maintenance Log</span>
        <small className="header_subtitle">Track maintenance, repairs & mileage</small>
      </h1>

      <div className="header_right">
        {user ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            <span className="user-greeting">Hi, {user}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <Link to="/login" className="btn-link">🔐 Login</Link>
        )}
      </div>
    </header>
  );
}

export default Header;