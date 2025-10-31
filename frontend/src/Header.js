import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header style={styles.header}>
        <div style={styles.left}>
        <Link to="/" style={styles.homeButton}>🏠 Home</Link>
      </div>
      <h1 style={styles.title}>Car Maintenance Log</h1>
    </header>
  );
}

const styles = {
  header: {
    backgroundColor: "#3d4046ff",
    color: "white",
    padding: "1rem",
    textAlign: "center",
  },
  left: {
    position: "absolute",
    left: "1rem",
    textAlign: "center",
  },
  homeButton: {
    backgroundColor: "#3d4046ff",
    color: "white",
    padding: "0.4rem 0.8rem",
    fontSize: "0.9rem",
  },
  title: {
    margin: 0,
    fontSize: "1.8rem",
    fontFamily: "Arial, sans-serif",
    color: "black",
  },
};

export default Header;