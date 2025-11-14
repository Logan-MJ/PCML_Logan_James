import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from "react";
import Header from "./Header";
import CarForm from './CarForm';
import { Routes, Route } from "react-router-dom";
import Login from "./Login";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/hello/")
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  return (
    <div>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <main style={{ padding: "1rem" }}>
            <p>Welcome to your car maintenance log app!</p>
            <CarForm />
      </main>
        } />
      </Routes>
    </div>
  );
}

export default App;

