import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (!username) return;
    // Simple client-side "login": store username in localStorage
    localStorage.setItem("pcml_user", username);
    navigate("/");
  }

  return (
    <main style={{ padding: "1rem" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.6rem", maxWidth: 320 }}>
        <label>
          Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} style={{ display: "block", width: "100%", padding: "0.4rem" }} />
        </label>
        <div>
          <button type="submit" style={{ padding: "0.45rem 0.9rem" }}>Login</button>
        </div>
      </form>
      <p style={{ marginTop: "1rem" }}>This is a simple demo login that stores a username in localStorage.</p>
    </main>
  );
}

export default Login;
