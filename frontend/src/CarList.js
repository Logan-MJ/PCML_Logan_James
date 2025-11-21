// src/components/CarList.js
import React, { useState, useEffect } from 'react';

const CarList = () => {
    const [cars, setCars] = useState([]);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const INITIAL_URL = 'http://localhost:8000/garage/cars/';

    const fetchCars = async (url) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(url); 
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            setCars(data.results); 
            setNextPage(data.next);
            setPrevPage(data.previous);
            setLoading(false);
        } catch (err) {
            setError(`Failed to fetch car data. Details: ${err.message}`);
            setLoading(false);
            console.error('Fetching error:', err);
        }
    };

    useEffect(() => {
        fetchCars(INITIAL_URL);
    }, []);

    if (loading) {
        return <div>Loading cars...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="car-list-container">
            <h2>🏎️ Available Cars</h2>
            {Array.isArray(cars) && cars.length > 0 ? (
            <ul>
                {cars.map(car => (
                    <li key={car.id}>
                        {car.make} {car.model} ({car.year})
                    </li>
                ))}
            </ul>
            ) : (
              <p>No cars available.</p>
            )}

            <hr/>
            <div>
                <button 
                    onClick={() => fetchCars(prevPage)} 
                    disabled={!prevPage}
                >
                    &laquo; Previous
                </button>
                
                <button 
                    onClick={() => fetchCars(nextPage)} 
                    disabled={!nextPage}
                >
                    Next &raquo;
                </button>
            </div>
        </div>
    );
};

export default CarList;