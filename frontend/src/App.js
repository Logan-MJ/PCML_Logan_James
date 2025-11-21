import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from "react";
import Header from "./Header";
import CarForm from './CarForm';
import Sidebar from './Sidebar';
import './Sidebar.css';
import { Routes, Route, Outlet } from "react-router-dom";
import Login from "./Login";
import CarList from './CarList';

function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <h1>404</h1>
      <p>Sorry, the page you're looking for does not exist.</p>
    </div>
  );
}

function Layout() {
  return (
    <div>
      <Header />
      <div className="page-body">
        <Sidebar />
        <div className="main-content">
          <div className="main-panel">
            <Outlet />
            <CarList />
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/hello/")
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<CarForm />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;