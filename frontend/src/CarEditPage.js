import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';

// Define the root URL that leads to your car endpoints
// Based on your CarList.js: 'http://localhost:8000/garage/cars/'
const CARS_API_URL = 'http://localhost:8000/garage'; 

const CarEditPage = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    
    const [carData, setCarData] = useState(null); 
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    // --- 1. Data Fetching Effect using native fetch ---
    useEffect(() => {
        const fetchCarData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Fetch URL example: http://localhost:8000/garage/cars/1/
                const response = await fetch(`${CARS_API_URL}/cars/${id}/`, { 
                    method: 'GET',
                    credentials: 'include', // Needed for session authentication
                });
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch car data. Status: ${response.status}`);
                }
                
                const data = await response.json();
                setCarData(data);
            } catch (err) {
                console.error("Error fetching car data:", err);
                setError("Could not load car data. Please check network connection.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchCarData();
    }, [id]);

    // --- 2. Change Handler ---
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        
        let processedValue = value;
        if (type === 'number') {
            processedValue = name === 'price' ? parseFloat(value) : parseInt(value, 10);
        }

        setCarData(prevData => ({
            ...prevData,
            [name]: processedValue,
        }));
    };

    // --- 3. Submission Handler using native fetch ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        
        try {
            const response = await fetch(`${CARS_API_URL}/cars/${id}/`, {
                method: 'PUT', // Use PUT to update the entire resource
                credentials: 'include', 
                headers: {
                    'Content-Type': 'application/json',
                    // NOTE: If using token auth or production settings, include CSRF token logic here.
                },
                body: JSON.stringify(carData),
            });
            
            if (!response.ok) {
                let errorData = {};
                try {
                    errorData = await response.json();
                } catch (jsonError) {
                    // Ignore JSON parse error
                }
                const errorMessage = JSON.stringify(errorData) || `Update failed with status: ${response.status}`;
                throw new Error(errorMessage);
            }
            
            alert('Car updated successfully!');
            navigate(-1); 

        } catch (err) {
            console.error("Error updating car data:", err.message);
            alert(`Failed to update car. Check console for details.`);
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div>
                <p className="ml-4 text-lg text-indigo-700">Loading car details...</p>
            </div>
        );
    }
    
    if (error) {
        return <div className="p-6 text-center text-xl text-red-600 bg-red-100 rounded-lg shadow-md max-w-lg mx-auto mt-10">Error: {error}</div>;
    }

    if (!carData) {
        return <div className="p-6 text-center text-xl text-red-600">Car not found.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <div className="max-w-xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-2xl">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Edit Car #{id}
                    </h1>
                    <button 
                        onClick={() => navigate(-1)} 
                        className="flex items-center text-indigo-600 hover:text-indigo-800 transition duration-150 font-medium"
                    >
                        <ArrowLeft className="w-5 h-5 mr-1" /> Cancel Edit
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    <div className="text-sm font-semibold text-gray-600 border-l-4 border-yellow-500 pl-3 py-1 bg-yellow-50 rounded-md">
                        Dealership: {carData.dealership_name || 'Unassigned'}
                    </div>

                    {/* Make Field */}
                    <div>
                        <label htmlFor="make" className="block text-sm font-medium text-gray-700">Make</label>
                        <input 
                            type="text" 
                            id="make"
                            name="make" 
                            value={carData.make || ''} 
                            onChange={handleChange} 
                            required 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {/* Model Field */}
                    <div>
                        <label htmlFor="model" className="block text-sm font-medium text-gray-700">Model</label>
                        <input 
                            type="text" 
                            id="model"
                            name="model" 
                            value={carData.model || ''} 
                            onChange={handleChange} 
                            required 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {/* Year & Price Fields */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
                            <input 
                                type="number" 
                                id="year"
                                name="year" 
                                value={carData.year || ''} 
                                onChange={handleChange} 
                                required 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                            <input 
                                type="number" 
                                id="price"
                                name="price" 
                                step="0.01" 
                                value={carData.price || ''} 
                                onChange={handleChange} 
                                required 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="pt-2">
                        <button 
                            type="submit"
                            disabled={isSaving}
                            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-md text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300 disabled:opacity-50"
                        >
                            {isSaving ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5 mr-2" />
                                    Update Car Data
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CarEditPage;