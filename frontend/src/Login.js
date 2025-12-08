import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const API_LOGIN_URL = '/api/garage/api/login/';
const getCookie = (name) => {
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(name + '=')) {
                return decodeURIComponent(cookie.substring(name.length + 1));
            }
        }
    }
    return null;
}
const Login = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
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
                    'X-CSRFToken': csrftoken, 
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include', 
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Login successful:", data.message);

                // Persist basic user info in localStorage for frontend-only profile
                try {
                    const existing = JSON.parse(localStorage.getItem('pcml_profile') || 'null');
                    if (!existing || existing.username !== data.username) {
                        const profile = { username: data.username, first_name: '', last_name: '', email: '' };
                        localStorage.setItem('pcml_profile', JSON.stringify(profile));
                    }
                } catch (e) {
                    localStorage.setItem('pcml_profile', JSON.stringify({ username: data.username, first_name: '', last_name: '', email: '' }));
                }

                // Store a simple flag for header display and notify header via custom event
                localStorage.setItem('pcml_user', data.username);
                window.dispatchEvent(new CustomEvent('pcml_login', { detail: data.username }));

                if (onLoginSuccess) {
                    onLoginSuccess(data.username);
                }
                setUsername('');
                setPassword('');
                navigate('/', { replace: true });
            } else {
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
                <form onSubmit={handleSubmit} className="car-form">
                    <h3 className="car-form-title">Sign In</h3>

                    <div className="car-form-group">
                        <label className="car-form-label">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="car-form-input"
                            placeholder="Enter username"
                        />
                    </div>

                    <div className="car-form-group">
                        <label className="car-form-label">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="car-form-input"
                            placeholder="Enter password"
                        />
                    </div>

                    {error && (
                        <div className="car-form-error">{error}</div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="car-form-button"
                    >
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;