import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // Navbar import
import Login from './components/Login';
import SignUp from './components/SignUp';
import Home from './components/Home';
import MoodTracker from './components/MoodTracker';

function App() {
    return (
        <Router>
            <div>
                <Navbar /> {/* Navbar shows on all pages */}
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/mood-tracker" element={<MoodTracker />} />
                    <Route path="*" element={<div>404: Page Not Found</div>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
