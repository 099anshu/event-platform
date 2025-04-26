import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';

const WinnerHighlights = () => {
    const [winners, setWinners] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Function to get complete image URL
    const getImageUrl = (relativePath) => {
        if (!relativePath) return '';
        if (relativePath.startsWith('http')) return relativePath;
        return `${BACKEND_URL}${relativePath}`;
    };

    useEffect(() => {
        const fetchWinners = async () => {
            try {
                const response = await axios.get('/api/winners');
                // Get the first 3 winners
                setWinners(response.data.winners.slice(0, 3));
                setLoading(false);
            } catch (error) {
                console.error('Error fetching winners:', error);
                setLoading(false);
            }
        };

        fetchWinners();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="py-12 h-screen flex flex-col justify-start items-center bg-black text-black relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_5%_40%,#ff69b4_2%,transparent_15%),radial-gradient(circle_at_80%_55%,#ff69b4_5%,transparent_35%),radial-gradient(circle_at_10%_90%,#00ff9f_5%,transparent_35%),radial-gradient(circle_at_90%_10%,#00ff9f_5%,transparent_20%)] before:opacity-20 before:pointer-events-none">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                        Winner Highlights
                    </h2>
                    <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                        Celebrating our outstanding achievers
                    </p>
                </div>

                <div className="mt-10">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {winners.map((winner) => (
                            <div
                                key={winner._id}
                                className="flex flex-col overflow-hidden rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className="flex-shrink-0 relative h-48">
                                    {winner.imageUrl ? (
                                        <img
                                            className="w-full h-full object-cover"
                                            src={getImageUrl(winner.imageUrl)}
                                            alt={winner.teamName}
                                            onError={(e) => {
                                                console.error('Image load error:', e);
                                                e.target.src = '/placeholder.png';
                                                e.target.onerror = null;
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-400">No image available</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                winner.position === 1 ? 'bg-yellow-100 text-yellow-800' :
                                                winner.position === 2 ? 'bg-gray-100 text-gray-800' :
                                                'bg-orange-100 text-orange-800'
                                            }`}>
                                                {winner.position === 1 ? '1st Place' :
                                                 winner.position === 2 ? '2nd Place' :
                                                 '3rd Place'}
                                            </span>
                                        </div>
                                        <h3 className="mt-2 text-xl font-semibold text-gray-900">
                                            {winner.title}
                                        </h3>
                                        <p className="mt-3 text-base text-gray-500">
                                            Team: {winner.teamName}
                                        </p>
                                    </div>
                                    <div className="mt-4">
                                        <button
                                            onClick={() => navigate('/gallery')}
                                            className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-200 flex items-center justify-center"
                                        >
                                            View Summary
                                            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-10">
                        <button
                            onClick={() => navigate('/gallery')}
                            className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-800"
                        >
                            View All Winners
                            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WinnerHighlights; 