import logo from './logo.svg';
import './App.css';

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
      <h1>Hello from React!</h1>
      <p>Django says: {data ? data.message : "Loading..."}</p>
    </div>
  );
}

export default App;

