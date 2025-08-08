import React, { useState, useEffect } from 'react';
import { FaGithub } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                // Change 1: Use VITE_API_URL for the API call
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/status`, {
                    withCredentials: true,
                });
                setIsLoggedIn(response.data.isLoggedIn);
            } catch (error) {
                setIsLoggedIn(false);
            }
        };
        checkAuthStatus();
    }, []);

    const handleNavLinkClick = (path: string) => {
        navigate(path);
    };

    const handleLogout = () => {
        // Change 2: Use VITE_API_URL for the logout redirect
        window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/logout`;
    };

    return (
        <nav className="fixed top-8 inset-x-8 z-50 bg-gray-900/30 backdrop-blur-xl border border-blue-500 rounded-2xl">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <button
                    onClick={() => handleNavLinkClick('/')}
                    className="flex items-center text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 focus:outline-none"
                >
                    <FaGithub className="text-3xl text-gray-300 mr-2" />
                    Testify AI
                </button>
                <div className="hidden md:flex items-center space-x-8">
                    <a href="/#home" className="text-gray-300 hover:text-white transition-colors duration-200">Home</a>
                    <a href="/#how-it-works" className="text-gray-300 hover:text-white transition-colors duration-200">How it Works</a>
                    <a href="/#features" className="text-gray-300 hover:text-white transition-colors duration-200">Features</a>
                    <a href="/#contact" className="text-gray-300 hover:text-white transition-colors duration-200">Contact</a>
                    {isLoggedIn && (
                        <button
                            onClick={() => handleNavLinkClick('/dashboard')}
                            className="text-gray-300 hover:text-white transition-colors duration-200 focus:outline-none"
                        >
                            Dashboard
                        </button>
                    )}
                </div>

                {isLoggedIn ? (
                    <button
                        onClick={handleLogout}
                        className="px-6 py-2 bg-red-600 text-white font-bold rounded-full shadow-lg hover:bg-red-700 transition-all duration-300 focus:outline-none"
                    >
                        Logout
                    </button>
                ) : (
                    <button
                        onClick={() => handleNavLinkClick('/login')}
                        className="px-6 py-2 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 focus:outline-none"
                    >
                        Login
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;