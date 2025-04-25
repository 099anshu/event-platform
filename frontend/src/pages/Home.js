import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [gallery, setGallery] = useState([]);
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

    const fetchGallery = async () => {
      try {
        const res = await axios.get('/api/gallery/latest');
        if (Array.isArray(res.data)) {
          setGallery(res.data);
        } else {
          console.warn('Unexpected gallery format:', res.data);
        }
      } catch (err) {
        console.error('Error fetching gallery:', err);
      }
    };

    fetchEvents();
    fetchGallery();
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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome to the Event Platform</h1>
          <p className="text-xl mb-8">Discover exciting events and explore past winners.</p>
          <button 
            onClick={() => navigate('/events')}
            className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition duration-200"
          >
            Explore All Events
          </button>
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-indigo-800 mb-10">Featured Upcoming Events</h2>
          
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
          
          <div className="text-center mt-10">
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

      {/* Gallery Preview Section */}
      <div className="bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-indigo-800 mb-10">Gallery Highlights</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {gallery.map((item) => (
              <div key={item._id} className="bg-gray-50 rounded-lg overflow-hidden shadow-lg">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                  <p className="text-gray-600 mt-2">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => navigate('/gallery')}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200"
            >
              View Full Gallery
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
