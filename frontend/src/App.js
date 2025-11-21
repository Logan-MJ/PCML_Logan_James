import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from "react";
import Header from "./Header";
import CarForm from './CarForm';
import Sidebar from './Sidebar';
import './Sidebar.css';
import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import CarList from './CarList';

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
      <div className="page-body">
        <Sidebar />
        <div className="main-content">
          <div className="main-panel">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<CarForm />} />
            </Routes>
            <CarList />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

