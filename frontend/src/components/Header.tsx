import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../icons/Logo';



const Header: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    // Check login status
    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        setIsLoggedIn(false);
        navigate('/signin');
    };

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-lg">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">

                    {/* LOGO */}
                    <Link to="/" className="flex items-center gap-3">
                        <Logo />
                        <span className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            Second Brain
                        </span>
                    </Link>

                    {/* DESKTOP NAV */}
                    <nav className="hidden md:flex items-center gap-2">
                        <Link to="/" className="px-4 py-2 font-semibold">Home</Link>
                        <Link to="/features" className="px-4 py-2 font-semibold">Features</Link>

                        {isLoggedIn && (
                            <Link to="/dashboard" className="px-4 py-2 font-semibold">
                                Dashboard
                            </Link>
                        )}

                        <div className="ml-4 pl-4 border-l flex gap-3">
                            {isLoggedIn ? (
                                <button
                                    onClick={handleLogout}
                                    className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                    Logout
                                </button>
                            ) : (
                                <>
                                    <Link
                                        to="/signin"
                                        className="px-5 py-2 font-semibold hover:text-purple-600"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg"
                                    >
                                        Get Started →
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>

                    {/* MOBILE BUTTON */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2"
                    >
                        ☰
                    </button>
                </div>

                {/* MOBILE MENU */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t">
                        <nav className="flex flex-col gap-3">
                            <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                            <Link to="/features" onClick={() => setMobileMenuOpen(false)}>Features</Link>

                            {isLoggedIn && (
                                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                                    Dashboard
                                </Link>
                            )}

                            {isLoggedIn ? (
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="px-4 py-2 bg-red-500 text-white rounded"
                                >
                                    Logout
                                </button>
                            ) : (
                                <>
                                    <Link to="/signin" onClick={() => setMobileMenuOpen(false)}>
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/signup"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="px-4 py-2 bg-purple-600 text-white rounded"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
