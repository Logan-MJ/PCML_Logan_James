import React from 'react';

// Helper function to get the CSRF token from the 'csrftoken' cookie
// This is essential for Django's Session Authentication security.
const getCsrfToken = () => {
    const name = 'csrftoken';
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};

const CarItem = ({ car, onDeleteSuccess }) => {
    const handleDelete = async (carId) => {
        const url = `http://localhost:8000/garage/cars/${carId}/`;
        const csrfToken = getCsrfToken();
        
        if (!csrfToken) {
            alert("Security error: CSRF token not found. Cannot delete.");
            console.error("CSRF token missing.");
            return;
        }

        if (!window.confirm(`Are you sure you want to delete the ${car.make} ${car.model}?`)) {
            return;
        }

        try {
            const response = await fetch(url, {
                method: 'DELETE', // <-- The critical DELETE method
                headers: {
                    'X-CSRFToken': csrfToken, // <-- Essential CSRF header
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // <-- Sends session cookies (needed for auth/csrf)
            });

            if (response.status === 204 || response.ok) { 
                // 204 No Content is the standard successful response for DRF DELETE
                console.log(`Car ID ${carId} deleted successfully.`);
                
                // 1. Success: Notify the parent component to update the UI state
                onDeleteSuccess(carId); 
            } else if (response.status === 403) {
                 alert("Permission denied. You might not be the owner of this car.");
            } else {
                throw new Error(`Deletion failed with status: ${response.status}`);
            }

        } catch (error) {
            console.error('Network or other error during deletion:', error);
            alert(`Error deleting car: ${error.message}`);
        }
    };

    return (
        <li key={car.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #eee' }}>
            <span>
                <strong>{car.make} {car.model}</strong> ({car.year})
                {car.dealership && (
                    <span style={{ marginLeft: '10px', color: 'gray', fontSize: '0.9em' }}>
                        (Dealership: {car.dealership})
                    </span>
                )}
            </span>
            <button 
                onClick={() => handleDelete(car.id)}
                style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}
            >
                Delete
            </button>
        </li>
    );
};

export default CarItem;