import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';

const Gallery = () => {
  const [winners, setWinners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState('all');
    const [selectedYear, setSelectedYear] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [selectedWinner, setSelectedWinner] = useState(null);
    const [years, setYears] = useState(['all']);
    const [events, setEvents] = useState(['all']);

    // Function to get complete image URL
    const getImageUrl = (relativePath) => {
        if (!relativePath) return '';
        if (relativePath.startsWith('http')) return relativePath;
        return `${BACKEND_URL}${relativePath}`;
    };
  
  useEffect(() => {
        fetchWinners();
    }, [selectedEvent, selectedYear]);

    const fetchWinners = async () => {
        try {
            setLoading(true);
            let url = '/api/winners';
            if (selectedEvent !== 'all' || selectedYear !== 'all') {
                const params = new URLSearchParams();
                if (selectedEvent !== 'all') params.append('event', selectedEvent);
                if (selectedYear !== 'all') params.append('year', selectedYear);
                url += `?${params.toString()}`;
            }
            
            const response = await axios.get(url);
            if (response.data.success) {
                setWinners(response.data.winners);
                
                // Extract unique years and events for filters
                const uniqueYears = [...new Set(response.data.winners.map(w => 
                    new Date(w.createdAt).getFullYear()
                ))].sort((a, b) => b - a);
                
                const uniqueEvents = [...new Set(response.data.winners.map(w => w.category))];
                
                setYears(['all', ...uniqueYears]);
                setEvents(['all', ...uniqueEvents]);
            }
        } catch (error) {
            console.error('Error fetching gallery:', error);
            toast.error('Failed to load gallery');
        } finally {
            setLoading(false);
        }
    };

    const handleWinnerClick = (winner) => {
        setSelectedWinner(winner);
        setShowModal(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

  return (
        <div className="min-h-screen flex flex-col justify-start items-center bg-black text-black relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_5%_40%,#ff69b4_2%,transparent_15%),radial-gradient(circle_at_80%_55%,#ff69b4_5%,transparent_35%),radial-gradient(circle_at_10%_90%,#00ff9f_5%,transparent_35%),radial-gradient(circle_at_90%_10%,#00ff9f_5%,transparent_20%)] before:opacity-20 before:pointer-events-none sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-indigo-600 mb-8">Achievement Gallery</h1>

                {/* Filters */}
                <div className="mb-8 flex flex-wrap gap-4">
                    <select
                        value={selectedEvent}
                        onChange={(e) => setSelectedEvent(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {events.map((event) => (
                            <option key={event} value={event}>
                                {event === 'all' ? 'All Events' : event.charAt(0).toUpperCase() + event.slice(1)}
                            </option>
                        ))}
                    </select>

                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year === 'all' ? 'All Years' : year}
                            </option>
                        ))}
                    </select>
                </div>
      
      {/* Gallery Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {winners.map((winner) => (
          <div 
            key={winner._id} 
                            onClick={() => handleWinnerClick(winner)}
                            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer transform hover:-translate-y-1"
                        >
                            <div className="relative h-48">
            <img
                                    src={getImageUrl(winner.imageUrl)}
                                    alt={winner.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                    <h3 className="text-white text-xl font-bold">{winner.title}</h3>
                                    <p className="text-white/90">{winner.teamName}</p>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 capitalize">{winner.category}</span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                        winner.position === 1 ? 'bg-yellow-100 text-yellow-800' :
                                        winner.position === 2 ? 'bg-gray-100 text-gray-800' :
                                        'bg-orange-100 text-orange-800'
                                    }`}>
                                        {winner.position}st Place
                                    </span>
                                </div>
            </div>
          </div>
        ))}
      </div>
      
                {winners.length === 0 && (
                    <div className="text-center py-12">
                        <h3 className="text-xl text-gray-600">No achievements found</h3>
                    </div>
                )}

                {/* Achievement Modal */}
                {showModal && selectedWinner && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="relative">
                                <img
                                    src={getImageUrl(selectedWinner.imageUrl)}
                                    alt={selectedWinner.title}
                                    className="w-full h-64 object-cover"
                                />
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                                >
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedWinner.title}</h2>
                                <p className="text-gray-600 mb-4">{selectedWinner.achievement}</p>
                                
                                <div className="border-t pt-4">
                                    <h3 className="font-semibold text-gray-900 mb-2">Team {selectedWinner.teamName}</h3>
                                    <div className="space-y-1">
                                        {selectedWinner.teamMembers.map((member, index) => (
                                            <div key={index} className="flex items-center text-sm text-gray-600">
                                                <span className="font-medium">{member.name}</span>
                                                {member.role && (
                                                    <span className="ml-2 text-gray-400">({member.role})</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                                    <div>
                                        <span className="capitalize">{selectedWinner.category}</span>
                                        <span className="mx-2">•</span>
                                        <span className="capitalize">{selectedWinner.subCategory}</span>
                                    </div>
                                    <span>{new Date(selectedWinner.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
    </div>
  );
};

export default Gallery;
