import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/registrations', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRegistrations(res.data);
      } catch (err) {
        console.error('Error fetching registrations', err);
      }
    };

    fetchRegistrations();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold text-center mb-6">📋 All Registrations</h1>

      <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-lg">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-200 text-gray-700 font-semibold">
            <tr>
              <th className="py-2 px-4">Student Name</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Event</th>
              <th className="py-2 px-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((reg, index) => (
              <tr key={index} className="border-b hover:bg-gray-100">
                <td className="py-2 px-4">{reg.studentName}</td>
                <td className="py-2 px-4">{reg.studentEmail}</td>
                <td className="py-2 px-4">{reg.eventName}</td>
                <td className="py-2 px-4">{new Date(reg.eventDate).toLocaleDateString()}</td>
              </tr>
            ))}
            {registrations.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">No registrations found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewRegistrations;
