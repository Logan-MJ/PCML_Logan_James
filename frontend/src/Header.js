import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("pcml_user");
    if (stored) setUser(stored);

    const onLogin = (e) => {
      setUser(e?.detail || localStorage.getItem('pcml_user'));
    };
    const onLogout = () => {
      setUser(null);
    };

    window.addEventListener('pcml_login', onLogin);
    window.addEventListener('pcml_logout', onLogout);
    return () => {
      window.removeEventListener('pcml_login', onLogin);
      window.removeEventListener('pcml_logout', onLogout);
    };
  }, []);

  function handleLogout() {
    localStorage.removeItem("pcml_user");
    // keep profile but clear user flag
    window.dispatchEvent(new Event('pcml_logout'));
    setUser(null);
    navigate("/");
  }

  return (
    <header className="header">
      <div className="header_left">
        <Link to="/" className="btn-link">🏠 Home</Link>
        <Link to="/help" className="btn-link" style={{ marginLeft: "15px" }}>❓ Help</Link>
      </div>

      <h1 className="header_title">
        <span className="header_title_main">Car Maintenance Log</span>
        <small className="header_subtitle">Track maintenance, repairs & mileage</small>
      </h1>

      <div className="header_right">
        {user ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            <span className="user-greeting">Hi, {user}</span>
            <Link to="/profile" className="btn-link" style={{ marginLeft: 12, marginRight: 8 }}>👤 Profile</Link>
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