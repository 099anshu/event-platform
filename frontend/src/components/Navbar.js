import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // You can replace this with actual authentication state

  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
     localStorage.removeItem('token');
     localStorage.removeItem('user');
     window.location.href = '/'; // or /login
   };


  return (
    <nav className="bg-black text-white w-full py-4">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center px-6">
        {/* Logo or App Name */}
        <div className="text-2xl font-bold">
          <Link to="/" className="text-white hover:text-gray-300">Event Platform</Link>
        </div>

        {/* Navbar Links */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/events" className="hover:text-gray-300">Events</Link>
          <Link to="/gallery" className="hover:text-gray-300">Gallery</Link>

          {/* Conditional Rendering based on Authentication */}
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="hover:text-gray-300">Login</Link>
              <Link to="/signup" className="hover:text-gray-300">Signup</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="hover:text-gray-300">Logout</button>
          )}
        </div>

        {/* Mobile Menu (Hamburger Icon) */}
        <div className="md:hidden flex items-center">
          <button className="text-white">
            {/* This is a simple hamburger menu button, you can replace it with a real menu icon */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
