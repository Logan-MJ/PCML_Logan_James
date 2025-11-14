import logo from './logo.svg';
import './App.css';
import React from "react";
import Header from "./Header";
import CarForm from './CarForm';

import { useEffect, useState } from "react";

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
      <main style={{ padding: "1rem" }}>
        {/* Your other components or content go here */}
        <p>Welcome to your car maintenance log app!</p>
        <CarForm />
      </main>
    </div>
  );
}

export default App;

