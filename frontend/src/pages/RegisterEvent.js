import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const RegisterEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/events/${eventId}`);
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        console.error('Error fetching event:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleRegister = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/registrations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('✅ Registered successfully!');
        navigate('/student-dashboard');
      } else {
        alert(`❌ ${data.message || 'Registration failed.'}`);
      }
    } catch (err) {
      console.error('Error during registration:', err);
      alert('Error registering for event.');
    }
  };

  if (loading) return <div className="text-center mt-10">Loading event details...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Register for Event</h2>
      {event ? (
        <>
          <div className="mb-4">
            <h3 className="text-xl font-bold text-blue-600">{event.name}</h3>
            <p className="text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
            <p className="mt-2 text-gray-700">{event.description}</p>
          </div>
          <button
            onClick={handleRegister}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Submit Registration
          </button>
        </>
      ) : (
        <p className="text-red-500">Event not found.</p>
      )}
    </div>
  );
};

export default RegisterEvent;
