import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const navigateToEvents = () => {
    navigate('/events', { state: { fromAdminDashboard: true } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">🧑‍💼 Admin Dashboard</h1>
          <button 
            onClick={handleLogout} 
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div onClick={() => navigate('/admin/add-event')} className="cursor-pointer bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition group">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Add Event</h2>
              <span className="text-2xl group-hover:scale-110 transition">➕</span>
            </div>
            <p className="text-gray-600">Create and schedule new events</p>
          </div>

          <div onClick={navigateToEvents} className="cursor-pointer bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition group">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Manage Events</h2>
              <span className="text-2xl group-hover:scale-110 transition">📝</span>
            </div>
            <p className="text-gray-600">Edit, update, or delete existing events</p>
          </div>

          <div onClick={() => navigate('/admin/winners')} className="cursor-pointer bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition group">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Winner Gallery</h2>
              <span className="text-2xl group-hover:scale-110 transition">🏆</span>
            </div>
            <p className="text-gray-600">View, add, edit, or remove winners</p>
          </div>

          <div onClick={() => navigate('/admin/registrations')} className="cursor-pointer bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition group">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Registrations</h2>
              <span className="text-2xl group-hover:scale-110 transition">📋</span>
            </div>
            <p className="text-gray-600">View and manage event registrations</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
