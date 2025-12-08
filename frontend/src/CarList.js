import React, { useState, useEffect, useCallback } from 'react';
import CarItem from './CarItem'; // <--- NEW: Import the CarItem component

const CarList = () => {
    const [cars, setCars] = useState([]);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [searchTerm, setSearchTerm] = useState('');

    const INITIAL_URL = '/api/garage/cars/';

    const fetchCars = useCallback(async (url) => { // Use useCallback for fetchCars
        setLoading(true);
        setError(null);
        try {
            // NOTE: We replace the full URL if pagination links are used, 
            // but if the URL is relative, prepend the host. Your setup looks right.
            const fetchUrl = url.includes('http') ? url : url; 
            
            const response = await fetch(fetchUrl, {
                method: 'GET',
                credentials: 'include', 
            });
            
            if (!response.ok) {
                // If 401 Unauthorized occurs, it means the user session expired
                if (response.status === 401) {
                    throw new Error("Session expired or unauthorized. Please log in.");
                }
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
    }, []); // Empty dependency array for useCallback

    useEffect(() => {
        const searchUrl = `${INITIAL_URL}?search=${encodeURIComponent(searchTerm)}`;
        fetchCars(searchUrl);
    }, [searchTerm, fetchCars]); // Include fetchCars in dependencies

    // --- NEW: Function to update state after a successful delete ---
    const handleCarDeleteSuccess = useCallback((deletedCarId) => {
        // Filter out the car with the matching ID from the state array
        setCars(prevCars => prevCars.filter(car => car.id !== deletedCarId));
    }, []);
    // -----------------------------------------------------------------

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
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {cars.map(car => (
                            // --- NEW: Use CarItem component and pass the handler ---
                            <CarItem 
                                key={car.id} 
                                car={car} 
                                onDeleteSuccess={handleCarDeleteSuccess} 
                            />
                            // ----------------------------------------------------
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