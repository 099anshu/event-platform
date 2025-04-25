import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true' && token;
  const isManagementMode = isAdmin && location.state?.fromAdminDashboard;

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const endpoint = isManagementMode ? '/api/events/all' : '/api/events/upcoming';
      const config = token ? {
        headers: { Authorization: `Bearer ${token}` }
      } : {};
      
      const res = await axios.get(endpoint, config);
      if (Array.isArray(res.data)) {
        setEvents(res.data);
      } else if (res.data.events && Array.isArray(res.data.events)) {
        setEvents(res.data.events);
      } else {
        console.error('Unexpected response format:', res.data);
        setEvents([]);
      }
    } catch (err) {
      console.error('Failed to fetch events:', err);
      toast.error('Failed to load events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = (eventId) => {
    if (!token) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    navigate(`/register/${eventId}`);
  };

  const handleDelete = async (eventId) => {
    if (!isAdmin) {
      toast.error('You do not have permission to delete events');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      await axios.delete(`/api/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success('Event deleted successfully');
      fetchEvents(); // Refresh the events list
    } catch (err) {
      console.error('Failed to delete event:', err);
      toast.error(err.response?.data?.message || 'Failed to delete event');
    }
  };

  const handleEdit = (eventId) => {
    if (!isAdmin) {
      toast.error('You do not have permission to edit events');
      return;
    }
    navigate(`/admin/edit-event/${eventId}`);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 py-12 px-6 flex items-center justify-center">
        <div className="text-indigo-600 text-xl">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col gap-4 mb-10">
          {isManagementMode && (
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin-dashboard')}
                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </button>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-indigo-800">
                {isManagementMode ? 'Manage Events' : 'Upcoming Events'}
              </h1>
              {isManagementMode && (
                <p className="text-gray-600 mt-2">Edit, update, or delete events from this page</p>
              )}
            </div>
            {/* Only show Add New Event button in management mode */}
            {isManagementMode && (
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/admin/add-event')}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add New Event
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-lg text-gray-700 mb-4">No upcoming events at the moment.</p>
              {isManagementMode && (
                <button
                  onClick={() => navigate('/admin/add-event')}
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Create your first event
                </button>
              )}
            </div>
          ) : (
            events.map((event) => (
              <div key={event._id} className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
                {/* Event Image */}
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={event.imageUrl} 
                    alt={event.name}
                    className="w-full h-full object-cover transform hover:scale-105 transition duration-300"
                  />
                  {/* Only show edit/delete buttons in management mode */}
                  {isManagementMode && (
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button
                        onClick={() => handleEdit(event._id)}
                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200 flex items-center gap-1"
                        title="Edit Event"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(event._id)}
                        className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200 flex items-center gap-1"
                        title="Delete Event"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Event Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold text-indigo-700 mb-2">{event.name}</h3>
                  <div className="mb-4 text-gray-600">
                    <p className="text-sm flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(event.date)}
                    </p>
                    <p className="text-sm flex items-center gap-2 mt-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.location}
                    </p>
                  </div>
                  <p className="text-gray-700 mb-4 line-clamp-2">{event.description}</p>
                  <div className="mt-auto">
                    {!isManagementMode && (
                      <button
                        onClick={() => handleRegister(event._id)}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
                      >
                        Register Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;
