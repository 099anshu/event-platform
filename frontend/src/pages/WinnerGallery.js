import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// Add backend URL configuration
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';

const WinnerGallery = () => {
    const navigate = useNavigate();
    const [winners, setWinners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editingWinner, setEditingWinner] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [formData, setFormData] = useState({
        category: 'tech',
        subCategory: 'hackathon',
        title: '',
        teamName: '',
        achievement: '',
        position: 1,
        imageUrl: '',
        teamMembers: [{ name: '', role: '' }]
    });

    const categories = {
        all: 'All Categories',
        tech: 'Technical',
        cultural: 'Cultural',
        sports: 'Sports',
        debate: 'Debate'
    };

    const categoryMap = {
        tech: ['hackathon', 'ideathon', 'research', 'coding', 'robotics'],
        cultural: ['dance', 'music', 'drama', 'art', 'photography', 'annual'],
        sports: ['tennis', 'basketball', 'cricket', 'football', 'volleyball', 'athletics'],
        debate: ['parliamentary', 'mun', 'group', 'individual']
    };

    // Get token from localStorage
    const getAuthHeader = () => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    useEffect(() => {
        fetchWinners();
    }, [selectedCategory]);

    const fetchWinners = async () => {
        try {
            const url = selectedCategory === 'all' 
                ? '/api/winners'
                : `/api/winners/category/${selectedCategory}`;
            console.log('Fetching winners from:', url);
            const response = await axios.get(url, {
                headers: getAuthHeader()
            });
            
            if (response.data.success) {
                setWinners(response.data.winners);
            } else {
                throw new Error(response.data.message || 'Failed to fetch winners');
            }
        } catch (error) {
            console.error('Error fetching winners:', error);
            console.error('Error details:', {
                message: error.response?.data?.message || error.message,
                status: error.response?.status,
                data: error.response?.data
            });
            toast.error(error.response?.data?.message || 'Failed to fetch winners');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (winnerId) => {
        if (window.confirm('Are you sure you want to delete this winner?')) {
            try {
                await axios.delete(`/api/winners/${winnerId}`, {
                    headers: getAuthHeader()
                });
                toast.success('Winner deleted successfully');
                fetchWinners();
            } catch (error) {
                console.error('Error deleting winner:', error);
                toast.error(error.response?.data?.message || 'Failed to delete winner');
            }
        }
    };

    const handleEdit = (winner) => {
        setEditingWinner(winner);
        setFormData({
            ...winner
        });
        setImagePreview(winner.imageUrl);
        setShowModal(true);
    };

    const handleAdd = () => {
        setEditingWinner(null);
        setFormData({
            category: 'tech',
            subCategory: 'hackathon',
            title: '',
            teamName: '',
            achievement: '',
            position: 1,
            imageUrl: '',
            teamMembers: [{ name: '', role: '' }]
        });
        setImageFile(null);
        setImagePreview('');
        setShowModal(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                toast.error('Please upload a valid image file (JPG, PNG, or GIF)');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }

            setImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const handleTeamMemberChange = (index, field, value) => {
        const newTeamMembers = [...formData.teamMembers];
        newTeamMembers[index] = {
            ...newTeamMembers[index],
            [field]: value
        };
        setFormData(prev => ({
            ...prev,
            teamMembers: newTeamMembers
        }));
    };

    const addTeamMember = () => {
        setFormData(prev => ({
            ...prev,
            teamMembers: [...prev.teamMembers, { name: '', role: '' }]
        }));
    };

    const removeTeamMember = (index) => {
        setFormData(prev => ({
            ...prev,
            teamMembers: prev.teamMembers.filter((_, i) => i !== index)
        }));
    };

    const uploadImage = async () => {
        if (!imageFile && editingWinner) return formData.imageUrl;
        if (!imageFile) return null;

        const formDataObj = new FormData();
        formDataObj.append('image', imageFile);
        console.log('Uploading image:', imageFile);

        try {
            const response = await axios.post('/api/upload', formDataObj, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.log('Image upload response:', response.data);
            return response.data.imageUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw new Error('Failed to upload image');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form Data:', formData);

        if (!formData.title || !formData.teamName) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (!imageFile && !editingWinner) {
            toast.error('Please select an image');
            return;
        }

        setLoading(true);
        try {
            let imageUrl;
            if (imageFile) {
                console.log('Uploading image...');
                const formDataObj = new FormData();
                formDataObj.append('image', imageFile);
                
                const uploadResponse = await axios.post('/api/upload', formDataObj, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        ...getAuthHeader()
                    }
                });
                console.log('Upload response:', uploadResponse.data);
                
                if (!uploadResponse.data.success) {
                    throw new Error(uploadResponse.data.message || 'Failed to upload image');
                }
                imageUrl = uploadResponse.data.imageUrl;
            } else if (editingWinner) {
                imageUrl = formData.imageUrl;
            }

            if (!imageUrl) {
                throw new Error('No image URL available');
            }

            const winnerData = {
                ...formData,
                imageUrl
            };
            console.log('Submitting winner data:', winnerData);

            let response;
            if (editingWinner) {
                response = await axios.put(`/api/winners/${editingWinner._id}`, winnerData, {
                    headers: getAuthHeader()
                });
            } else {
                response = await axios.post('/api/winners', winnerData, {
                    headers: getAuthHeader()
                });
            }
            console.log('Save response:', response.data);

            toast.success(editingWinner ? 'Winner updated successfully' : 'Winner added successfully');
            setShowModal(false);
            fetchWinners();
        } catch (error) {
            console.error('Full error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to save winner';
            console.error('Error details:', {
                message: errorMessage,
                response: error.response?.data,
                status: error.response?.status
            });
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Function to get complete image URL
    const getImageUrl = (relativePath) => {
        if (!relativePath) return '';
        if (relativePath.startsWith('http')) return relativePath;
        // Remove any leading slashes to avoid double slashes
        const cleanPath = relativePath.replace(/^\/+/, '');
        return `${BACKEND_URL}/${cleanPath}`;
    };

    if (loading && !showModal) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Winner Gallery</h1>
                    <button
                        onClick={handleAdd}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                        Add New Winner
                    </button>
                </div>

                <div className="mb-6 flex flex-wrap gap-2">
                    {Object.entries(categories).map(([key, label]) => (
                        <button
                            key={key}
                            onClick={() => setSelectedCategory(key)}
                            className={`px-4 py-2 rounded-full ${
                                selectedCategory === key
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                            } transition`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {winners.map((winner) => (
                        <div
                            key={winner._id}
                            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
                        >
                            <div className="relative h-48">
                                <img
                                    src={getImageUrl(winner.imageUrl)}
                                    alt={winner.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-0 right-0 p-2 space-x-2">
                                    <button
                                        onClick={() => handleEdit(winner)}
                                        className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(winner._id)}
                                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-gray-900">{winner.title}</h3>
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                        winner.position === 1 ? 'bg-yellow-100 text-yellow-800' :
                                        winner.position === 2 ? 'bg-gray-100 text-gray-800' :
                                        'bg-orange-100 text-orange-800'
                                    }`}>
                                        {winner.position === 1 ? '1st' :
                                         winner.position === 2 ? '2nd' : '3rd'} Place
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-4">{winner.achievement}</p>
                                <div className="border-t pt-4">
                                    <h4 className="font-semibold text-gray-900 mb-2">Team {winner.teamName}</h4>
                                    <div className="space-y-1">
                                        {winner.teamMembers.map((member, index) => (
                                            <div key={index} className="flex items-center text-sm text-gray-600">
                                                <span className="font-medium">{member.name}</span>
                                                {member.role && (
                                                    <span className="ml-2 text-gray-400">({member.role})</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center text-sm text-gray-500">
                                    <span className="capitalize">{winner.category}</span>
                                    <span className="mx-2">•</span>
                                    <span className="capitalize">{winner.subCategory}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {winners.length === 0 && (
                    <div className="text-center py-12">
                        <h3 className="text-xl text-gray-600">No winners found in this category</h3>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {editingWinner ? 'Edit Winner' : 'Add New Winner'}
                                </h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Category
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        required
                                    >
                                        {Object.keys(categoryMap).map((category) => (
                                            <option key={category} value={category}>
                                                {category.charAt(0).toUpperCase() + category.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Sub Category
                                    </label>
                                    <select
                                        name="subCategory"
                                        value={formData.subCategory}
                                        onChange={handleChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        required
                                    >
                                        {categoryMap[formData.category].map((subCategory) => (
                                            <option key={subCategory} value={subCategory}>
                                                {subCategory.charAt(0).toUpperCase() + subCategory.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="Enter achievement title"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Team Name
                                    </label>
                                    <input
                                        type="text"
                                        name="teamName"
                                        value={formData.teamName}
                                        onChange={handleChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="Enter team name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Achievement
                                    </label>
                                    <input
                                        type="text"
                                        name="achievement"
                                        value={formData.achievement}
                                        onChange={handleChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="Enter achievement details"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Position
                                    </label>
                                    <select
                                        name="position"
                                        value={formData.position}
                                        onChange={handleChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        required
                                    >
                                        <option value={1}>First</option>
                                        <option value={2}>Second</option>
                                        <option value={3}>Third</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Winner Image
                                    </label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                        <div className="space-y-1 text-center">
                                            <svg
                                                className="mx-auto h-12 w-12 text-gray-400"
                                                stroke="currentColor"
                                                fill="none"
                                                viewBox="0 0 48 48"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            <div className="flex text-sm text-gray-600">
                                                <label
                                                    htmlFor="image-upload"
                                                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                                >
                                                    <span>Upload a file</span>
                                                    <input
                                                        id="image-upload"
                                                        name="image-upload"
                                                        type="file"
                                                        accept="image/jpeg,image/png,image/gif"
                                                        className="sr-only"
                                                        onChange={handleImageChange}
                                                        required={!editingWinner}
                                                    />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                PNG, JPG, GIF up to 5MB
                                            </p>
                                        </div>
                                    </div>
                                    {imagePreview && (
                                        <div className="mt-4">
                                            <img
                                                src={getImageUrl(imagePreview)}
                                                alt="Preview"
                                                className="h-40 w-full object-cover rounded-lg"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Team Members
                                    </label>
                                    {formData.teamMembers.map((member, index) => (
                                        <div key={index} className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                value={member.name}
                                                onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                                                className="shadow appearance-none border rounded flex-1 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                placeholder="Member name"
                                                required
                                            />
                                            <input
                                                type="text"
                                                value={member.role}
                                                onChange={(e) => handleTeamMemberChange(index, 'role', e.target.value)}
                                                className="shadow appearance-none border rounded flex-1 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                placeholder="Member role"
                                            />
                                            {index > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeTeamMember(index)}
                                                    className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addTeamMember}
                                        className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                    >
                                        Add Member
                                    </button>
                                </div>

                                <div className="flex justify-end space-x-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                                    >
                                        {loading ? (editingWinner ? 'Updating...' : 'Adding...') : (editingWinner ? 'Update Winner' : 'Add Winner')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WinnerGallery; 