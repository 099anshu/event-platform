import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditEvent = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

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

    useEffect(() => {
        // Check if user is admin
        if (!isAdmin || !token) {
            toast.error('Unauthorized access');
            navigate('/');
            return;
        }

        const fetchEvent = async () => {
            try {
                const response = await axios.get(`/api/events/${eventId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                if (!response.data) {
                    throw new Error('Event not found');
                }

                const event = response.data;
                
                // Format dates for form inputs
                const eventDate = new Date(event.date);
                const formattedDate = eventDate.toISOString().split('T')[0];
                const formattedTime = eventDate.toTimeString().split(':').slice(0, 2).join(':');
                
                setEventData({
                    ...event,
                    date: formattedDate,
                    time: formattedTime,
                    registrationDuration: {
                        start: event.registrationDuration?.start ? new Date(event.registrationDuration.start).toISOString().slice(0, 16) : '',
                        end: event.registrationDuration?.end ? new Date(event.registrationDuration.end).toISOString().slice(0, 16) : ''
                    }
                });
            } catch (error) {
                console.error('Error fetching event:', error);
                toast.error(error.response?.data?.message || 'Failed to load event details');
                navigate('/admin/events');
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [eventId, navigate, token, isAdmin]);

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
            // Validate required fields
            const requiredFields = ['name', 'description', 'date', 'time', 'location', 'imageUrl'];
            const missingFields = requiredFields.filter(field => !eventData[field]);
            
            if (missingFields.length > 0) {
                throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
            }

            if (!eventData.registrationDuration.start || !eventData.registrationDuration.end) {
                throw new Error('Registration start and end dates are required');
            }

            const formattedData = {
                name: eventData.name,
                description: eventData.description,
                location: eventData.location,
                imageUrl: eventData.imageUrl,
                brochureUrl: eventData.brochureUrl,
                date: new Date(eventData.date + 'T' + eventData.time).toISOString(),
                registrationDuration: {
                    start: new Date(eventData.registrationDuration.start).toISOString(),
                    end: new Date(eventData.registrationDuration.end).toISOString()
                }
            };

            const response = await axios.put(
                `/api/events/${eventId}`,
                formattedData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                toast.success('Event updated successfully!');
                navigate('/events', { state: { fromAdminDashboard: true } });
            } else {
                throw new Error(response.data.message || 'Failed to update event');
            }
        } catch (error) {
            console.error('Error updating event:', error);
            toast.error(error.response?.data?.message || error.message || 'Failed to update event');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 py-12 px-6 flex items-center justify-center">
                <div className="text-indigo-600 text-xl">Loading event details...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow-lg rounded-lg px-6 py-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Edit Event</h1>
                        <button
                            onClick={() => navigate('/events', { state: { fromAdminDashboard: true } })}
                            className="text-gray-600 hover:text-gray-800"
                        >
                            ← Back to Events
                        </button>
                    </div>

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
                                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Image URL */}
                        <div>
                            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                                Image URL *
                            </label>
                            <input
                                type="url"
                                id="imageUrl"
                                name="imageUrl"
                                required
                                value={eventData.imageUrl}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Brochure URL */}
                        <div>
                            <label htmlFor="brochureUrl" className="block text-sm font-medium text-gray-700">
                                Brochure URL
                            </label>
                            <input
                                type="url"
                                id="brochureUrl"
                                name="brochureUrl"
                                value={eventData.brochureUrl}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Registration Duration */}
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
                                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-4 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate('/events', { state: { fromAdminDashboard: true } })}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Updating...' : 'Update Event'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditEvent; 