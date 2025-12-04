import React, { useState, useEffect } from 'react';
import CarForm from './CarForm';
import CarList from './CarList';
import Login from './Login';

const Dashboard = () => {
    const [user, setUser] = useState(() => localStorage.getItem('pcml_user'));

    useEffect(() => {
        const onLogin = (e) => setUser(e?.detail || localStorage.getItem('pcml_user'));
        const onLogout = () => setUser(null);

        window.addEventListener('pcml_login', onLogin);
        window.addEventListener('pcml_logout', onLogout);

        return () => {
            window.removeEventListener('pcml_login', onLogin);
            window.removeEventListener('pcml_logout', onLogout);
        };
    }, []);

    // If there's no logged-in user flag, show the login form only.
    if (!user) {
        return <Login />;
    }

    return (
        <>
            <CarForm />
            <CarList />
        </>
    );
};

export default Dashboard;