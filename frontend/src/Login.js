import React, { useState } from 'react';

// The URL of your Django API login endpoint
const API_LOGIN_URL = 'http://localhost:8000/garage/api/login/';

// Function to safely get a cookie value by name
const getCookie = (name) => {
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.startsWith(name + '=')) {
                return decodeURIComponent(cookie.substring(name.length + 1));
            }
        }
    }
    return null;
}

// Main Login Component
const Login = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        // 1. Get CSRF Token (Django sets a csrftoken cookie which must be read and sent back)
        const csrftoken = getCookie('csrftoken');

        if (!csrftoken) {
            setError('CSRF token not found. Cannot proceed.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(API_LOGIN_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 2. IMPORTANT: Send the CSRF token in the header
                    'X-CSRFToken': csrftoken, 
                },
                body: JSON.stringify({ username, password }),
                // 3. VITAL: This allows the browser to send the session cookie across origins (localhost:3000 -> localhost:8000)
                credentials: 'include', 
            });

            if (response.ok) {
                // Login successful. Django has set the session cookie in the browser.
                const data = await response.json();
                console.log("Login successful:", data.message);
                
                // Call the parent function to update the app state (e.g., redirect to dashboard)
                if (onLoginSuccess) {
                    onLoginSuccess(data.username);
                }
            } else {
                // Handle authentication failure (401 Unauthorized) or validation errors (400 Bad Request)
                const errorData = await response.json();
                const errorMessage = errorData.error || errorData.detail || 'Login failed. Check username and password.';
                setError(errorMessage);
            }
        } catch (err) {
            console.error("Network or API error:", err);
            setError('A network error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-gray-200">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
                    Sign In
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter username"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter password"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm border border-red-400">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition"
                    >
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;