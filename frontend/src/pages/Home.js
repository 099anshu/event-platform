import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import WinnerHighlights from '../components/WinnerHighlights';
import homeImage from './home.png';

const Home = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('/api/events/upcoming?limit=3');
        setUpcomingEvents(res.data);
      } catch (err) {
        console.error('Error fetching events:', err);
      }
    };

    fetchEvents();
  }, []);

  const handleRegister = (eventId) => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate(`/register/${eventId}`);
    } else {
      navigate('/login');
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-black text-gray-100">
      {/* Hero Section with Background Image */}
      <div className="relative py-24 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
        <img 
           src={homeImage} 
            alt="Background" 
            className="w-full h-full object-cover"
        />

          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>
        
        {/* Fancy Gradient Accent */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-pink-500">
              Welcome to the Event Platform
            </span>
          </h1>
          <p className="text-xl mb-10 text-gray-200">Discover exciting events and explore past winners.</p>
          <button 
            onClick={() => navigate('/events')}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-lg transform hover:scale-105"
          >
            Explore All Events
          </button>
        </div>
      </div>


      {/* Upcoming Events Section */}
      <div className=" h-screen flex flex-col justify-start items-center bg-black text-black relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_5%_40%,#ff69b4_2%,transparent_15%),radial-gradient(circle_at_80%_55%,#ff69b4_5%,transparent_35%),radial-gradient(circle_at_10%_90%,#00ff9f_5%,transparent_35%),radial-gradient(circle_at_90%_10%,#00ff9f_5%,transparent_20%)] before:opacity-20 before:pointer-events-none">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mt-8 mb-10">Featured Upcoming Events</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.length === 0 ? (
              <p className="text-center text-lg text-gray-700 col-span-full">No upcoming events at the moment.</p>
            ) : (
              upcomingEvents.map((event) => (
                <div key={event._id} className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
                  {/* Event Image */}
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={event.imageUrl} 
                      alt={event.name}
                      className="w-full h-full object-cover transform hover:scale-105 transition duration-300"
                    />
                  </div>
                  
                  {/* Event Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-semibold text-indigo-700 mb-2">{event.name}</h3>
                    <div className="mb-4 text-gray-600">
                      <p className="text-sm">
                        <i className="far fa-calendar-alt mr-2"></i>
                        {formatDate(event.date)}
                      </p>
                      <p className="text-sm">
                        <i className="fas fa-map-marker-alt mr-2"></i>
                        {event.location}
                      </p>
                    </div>
                    <p className="text-gray-700 mb-4 line-clamp-2">{event.description}</p>
                    <div className="mt-auto">
                      <button
                        onClick={() => handleRegister(event._id)}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
                      >
                        Register Now
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="text-center mt-10 mb-8">
            <button
              onClick={() => navigate('/events')}
              className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-800"
            >
              View All Events
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Winner Highlights Section */}
      <WinnerHighlights />
    </div>
  );
};

export default Home;
