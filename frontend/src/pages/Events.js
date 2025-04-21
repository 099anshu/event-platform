import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Events = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem('token'); // or use your auth context

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('/api/events/upcoming');
        console.log('Events fetched:', res.data);
        setEvents(res.data);
      } catch (err) {
        console.error('Failed to fetch events:', err);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 py-12 px-6">
      <h1 className="text-4xl font-bold text-center text-indigo-800 mb-10">Upcoming Events</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {events.length === 0 ? (
          <p className="text-center text-lg text-gray-700 col-span-full">No upcoming events at the moment.</p>
        ) : (
          events.map((event) => (
            <div key={event._id} className="bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-indigo-700 mb-2">{event.name}</h2>
                <p className="text-gray-600 text-sm mb-2">{new Date(event.date).toLocaleDateString()}</p>
                <p className="text-gray-700 mb-4">{event.description}</p>
              </div>
              <button
                onClick={() => handleRegister(event._id)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
              >
                Register
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Events;
