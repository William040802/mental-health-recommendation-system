import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();

    // Check if the user is logged in by checking for a token in localStorage
    const isLoggedIn = !!localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove the token
        navigate('/login'); // Redirect to the login page
    };

    return (
        <nav style={{ padding: '10px', backgroundColor: '#f4f4f4', borderBottom: '1px solid #ddd' }}>
            {isLoggedIn ? (
                <>
                    <Link to="/home" style={{ margin: '0 10px' }}>Home</Link>
                    <Link to="/mood-tracker" style={{ margin: '0 10px' }}>Mood Tracker</Link>
                    <button
                        onClick={handleLogout}
                        style={{
                            margin: '0 10px',
                            padding: '5px 10px',
                            border: 'none',
                            background: '#e74c3c',
                            color: '#fff',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        Logout
                    </button>
                </>
            ) : (
                <>
                    <Link to="/signup" style={{ margin: '0 10px' }}>Sign Up</Link>
                    <Link to="/login" style={{ margin: '0 10px' }}>Login</Link>
                </>
            )}
        </nav>
    );
}

export default Navbar;
