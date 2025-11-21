// src/components/CarList.js
import React, { useState, useEffect } from 'react';

const CarList = () => {
    const [cars, setCars] = useState([]);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [searchTerm, setSearchTerm] = useState('');

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
        const searchUrl = `${INITIAL_URL}?search=${encodeURIComponent(searchTerm)}`;
        fetchCars(searchUrl);
    }, [searchTerm]);

    return (
        <div className="car-list-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>🏎️ Available Cars</h2>
                
                <div className="search-bar">
                    <input 
                        type="text" 
                        placeholder="Search make or model..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ padding: '8px', width: '250px' }}
                        autoFocus 
                    />
                </div>
            </div>
            
            {error && <div style={{ color: 'red' }}>Error: {error}</div>}

            {loading ? (
                <p>Loading cars...</p>
            ) : (
                <>
                    {Array.isArray(cars) && cars.length > 0 ? (
                    <ul>
                        {cars.map(car => (
                            <li key={car.id}>
                                {car.make} {car.model} ({car.year})
                            </li>
                        ))}
                    </ul>
                    ) : (
                      <p>No cars found.</p>
                    )}
                </>
            )}

            <hr/>
            <div>
                <button 
                    onClick={() => fetchCars(prevPage)} 
                    disabled={!prevPage || loading}
                >
                    &laquo; Previous
                </button>
                
                <button 
                    onClick={() => fetchCars(nextPage)} 
                    disabled={!nextPage || loading}
                >
                    Next &raquo;
                </button>
            </div>
        </div>
    );
};

export default CarList;