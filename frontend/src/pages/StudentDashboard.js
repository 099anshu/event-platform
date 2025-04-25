import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudentDashboard = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/registrations/my', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRegistrations();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-center">🎓 My Registered Events</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map(({ eventId }, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2">{eventId.name}</h2>
            <p className="text-gray-600 mb-1"><b>Date:</b> {new Date(eventId.date).toLocaleDateString()}</p>
            <p className="text-gray-700">{eventId.description}</p>
          </div>
        ))}
        {events.length === 0 && (
          <p className="text-center col-span-3 text-gray-500">No events registered yet.</p>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
