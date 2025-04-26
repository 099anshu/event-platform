import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EventRegistration = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const token = localStorage.getItem('token');
    
    const [event, setEvent] = useState(null);
    const [formData, setFormData] = useState({
        additionalInfo: '',
        dietaryRestrictions: '',
        tshirtSize: 'M',
        emergencyContact: {
            name: '',
            phone: '',
            relationship: ''
        }
    });

    useEffect(() => {
        // Redirect if not logged in
        if (!token) {
            toast.error('Please login to register for events');
            navigate('/login', { state: { from: `/register/${eventId}` } });
            return;
        }

        fetchEventDetails();
    }, [eventId, navigate, token]);

    const fetchEventDetails = async () => {
        try {
            const response = await axios.get(`/api/events/${eventId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEvent(response.data);
        } catch (error) {
            console.error('Error fetching event details:', error);
            toast.error('Failed to load event details');
            navigate('/events');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const response = await axios.post('/api/registrations', {
                eventId,
                ...formData
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                toast.success('Registration successful!');
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Registration error:', error);
            toast.error(error.response?.data?.message || 'Failed to register for event');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 py-12 px-6 flex items-center justify-center">
                <div className="text-indigo-600 text-xl">Loading event details...</div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 py-12 px-6 flex items-center justify-center">
                <div className="text-red-600 text-xl">Event not found</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col justify-start items-center bg-black text-black relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_5%_40%,#ff69b4_2%,transparent_15%),radial-gradient(circle_at_80%_55%,#ff69b4_5%,transparent_35%),radial-gradient(circle_at_10%_90%,#00ff9f_5%,transparent_35%),radial-gradient(circle_at_90%_10%,#00ff9f_5%,transparent_20%)] before:opacity-20 before:pointer-events-none py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Event Details Card */}
                <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
                    <div className="h-48 overflow-hidden">
                        <img
                            src={event.imageUrl}
                            alt={event.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{event.name}</h2>
                        <p className="text-gray-600 mb-4">{event.description}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                                <p className="font-semibold">Date & Time:</p>
                                <p>{new Date(event.date).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Location:</p>
                                <p>{event.location}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Registration Form */}
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Registration Form</h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Additional Information */}
                        <div>
                            <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700">
                                Additional Information
                            </label>
                            <textarea
                                id="additionalInfo"
                                name="additionalInfo"
                                rows={3}
                                value={formData.additionalInfo}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                placeholder="Any additional information you'd like to share..."
                            />
                        </div>

                        {/* Dietary Restrictions */}
                        <div>
                            <label htmlFor="dietaryRestrictions" className="block text-sm font-medium text-gray-700">
                                Dietary Restrictions
                            </label>
                            <input
                                type="text"
                                id="dietaryRestrictions"
                                name="dietaryRestrictions"
                                value={formData.dietaryRestrictions}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                placeholder="Any dietary restrictions..."
                            />
                        </div>

                        {/* T-Shirt Size */}
                        <div>
                            <label htmlFor="tshirtSize" className="block text-sm font-medium text-gray-700">
                                T-Shirt Size
                            </label>
                            <select
                                id="tshirtSize"
                                name="tshirtSize"
                                value={formData.tshirtSize}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            >
                                <option value="XS">XS</option>
                                <option value="S">S</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                                <option value="XL">XL</option>
                                <option value="XXL">XXL</option>
                            </select>
                        </div>

                        {/* Emergency Contact */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-medium text-gray-900">Emergency Contact</h4>
                            <div>
                                <label htmlFor="emergencyContact.name" className="block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="emergencyContact.name"
                                    name="emergencyContact.name"
                                    required
                                    value={formData.emergencyContact.name}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="emergencyContact.phone" className="block text-sm font-medium text-gray-700">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    id="emergencyContact.phone"
                                    name="emergencyContact.phone"
                                    required
                                    value={formData.emergencyContact.phone}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="emergencyContact.relationship" className="block text-sm font-medium text-gray-700">
                                    Relationship
                                </label>
                                <input
                                    type="text"
                                    id="emergencyContact.relationship"
                                    name="emergencyContact.relationship"
                                    required
                                    value={formData.emergencyContact.relationship}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-4 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate('/events')}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className={`px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${submitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                            >
                                {submitting ? 'Submitting...' : 'Submit Registration'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EventRegistration; 