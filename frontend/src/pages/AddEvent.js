import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddEvent = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
  const [eventData, setEventData] = useState({
    name: '',
        description: '',
    date: '',
        time: '',
        location: '',
        imageUrl: '',
        brochureUrl: '',
        registrationDuration: {
            start: '',
            end: ''
        }
    });

  const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('registration')) {
            const field = name.split('.')[1];
            setEventData(prev => ({
                ...prev,
                registrationDuration: {
                    ...prev.registrationDuration,
                    [field]: value
                }
            }));
        } else {
            setEventData(prev => ({
                ...prev,
                [name]: value
            }));
        }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
        setLoading(true);

        try {
            // Validate all required fields
            const requiredFields = ['name', 'description', 'date', 'time', 'location', 'imageUrl'];
            const missingFields = requiredFields.filter(field => !eventData[field]);
            
            if (missingFields.length > 0) {
                throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
            }

            if (!eventData.registrationDuration.start || !eventData.registrationDuration.end) {
                throw new Error('Registration start and end dates are required');
            }

            // Format the data for submission
            const formattedData = {
                ...eventData,
                date: new Date(eventData.date).toISOString(),
                registrationDuration: {
                    start: new Date(eventData.registrationDuration.start).toISOString(),
                    end: new Date(eventData.registrationDuration.end).toISOString()
                }
            };

            const token = localStorage.getItem('token');
            await axios.post(
                '/api/events',
                formattedData,
        {
          headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
        }
      );

            toast.success('Event created successfully!');
            navigate('/admin/events');
        } catch (error) {
            console.error('Error creating event:', error);
            toast.error(error.response?.data?.message || error.message || 'Failed to create event');
        } finally {
            setLoading(false);
    }
  };

  return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow-lg rounded-lg px-6 py-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Event</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Event Title */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Event Title *
                            </label>
          <input
            type="text"
                                id="name"
            name="name"
                                required
            value={eventData.name}
            onChange={handleChange}
                                placeholder="Enter event title"
                                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description *
                            </label>
                            <textarea
                                id="description"
                                name="description"
            required
                                rows={4}
                                value={eventData.description}
                                onChange={handleChange}
                                placeholder="Enter event description"
                                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
                        </div>

                        {/* Date and Time */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                                    Event Date *
                                </label>
          <input
            type="date"
                                    id="date"
            name="date"
                                    required
            value={eventData.date}
            onChange={handleChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                                    Event Time *
                                </label>
                                <input
                                    type="time"
                                    id="time"
                                    name="time"
                                    required
                                    value={eventData.time}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                                Location *
                            </label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                required
                                value={eventData.location}
                                onChange={handleChange}
                                placeholder="Enter event location"
                                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Image URL */}
                        <div>
                            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                                Event Banner Image URL *
                            </label>
                            <input
                                type="url"
                                id="imageUrl"
                                name="imageUrl"
            required
                                value={eventData.imageUrl}
                                onChange={handleChange}
                                placeholder="https://example.com/image.jpg"
                                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
                        </div>

                        {/* Brochure/PDF URL */}
                        <div>
                            <label htmlFor="brochureUrl" className="block text-sm font-medium text-gray-700">
                                Brochure/PDF URL
                            </label>
                            <input
                                type="url"
                                id="brochureUrl"
                                name="brochureUrl"
                                value={eventData.brochureUrl}
                                onChange={handleChange}
                                placeholder="https://example.com/brochure.pdf"
                                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            <p className="mt-1 text-sm text-gray-500">Optional: Add a link to your event brochure or PDF</p>
                        </div>

                        {/* Registration Duration */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900">Registration Period</h3>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="registration.start" className="block text-sm font-medium text-gray-700">
                                        Registration Start *
                                    </label>
                                    <input
                                        type="datetime-local"
                                        id="registration.start"
                                        name="registration.start"
                                        required
                                        value={eventData.registrationDuration.start}
                                        onChange={handleChange}
                                        min={new Date().toISOString().slice(0, 16)}
                                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="registration.end" className="block text-sm font-medium text-gray-700">
                                        Registration End *
                                    </label>
                                    <input
                                        type="datetime-local"
                                        id="registration.end"
                                        name="registration.end"
                                        required
                                        value={eventData.registrationDuration.end}
            onChange={handleChange}
                                        min={eventData.registrationDuration.start || new Date().toISOString().slice(0, 16)}
                                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end space-x-4 pt-4">
          <button
                                type="button"
                                onClick={() => navigate('/admin/events')}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
                                Cancel
          </button>
        <button
                                type="submit"
                                disabled={loading}
                                className={`px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
                                {loading ? 'Creating...' : 'Create Event'}
        </button>
                        </div>
                    </form>
                </div>
      </div>
    </div>
  );
};

export default AddEvent;
