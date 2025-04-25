import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddWinner = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
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

    const categoryMap = {
        tech: ['hackathon', 'ideathon', 'research', 'coding', 'robotics'],
        cultural: ['dance', 'music', 'drama', 'art', 'photography', 'annual'],
        sports: ['tennis', 'basketball', 'cricket', 'football', 'volleyball', 'athletics'],
        debate: ['parliamentary', 'mun', 'group', 'individual']
    };

    const getAuthHeader = () => {
  const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
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
            // Check file type
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                toast.error('Please upload a valid image file (JPG, PNG, or GIF)');
                return;
            }

            // Check file size (max 5MB)
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
        if (!imageFile) return null;

        const formData = new FormData();
        formData.append('image', imageFile);

        try {
            const response = await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    ...getAuthHeader()
                }
            });
            return response.data.imageUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw new Error('Failed to upload image');
        }
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
        if (!formData.title || !formData.teamName) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (!imageFile) {
            toast.error('Please select an image');
            return;
        }

        setLoading(true);
        try {
            const imageUrl = await uploadImage();
            if (!imageUrl) {
                toast.error('Failed to upload image');
                return;
            }

            const winnerData = {
                ...formData,
                imageUrl
            };

            await axios.post('/api/winners', winnerData, {
                headers: getAuthHeader()
            });
            toast.success('Winner added successfully');
            navigate('/admin/winners');
        } catch (error) {
            console.error('Error adding winner:', error);
            toast.error(error.response?.data?.message || 'Failed to add winner');
        } finally {
            setLoading(false);
    }
  };

  return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow-lg rounded-lg px-6 py-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Add Winner</h1>
                        <button
                            onClick={() => navigate('/admin/winners')}
                            className="text-gray-600 hover:text-gray-800"
                        >
                            ← Back to Winners
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
                                Description
                            </label>
                            <input
                                type="text"
                                name="achievement"
                                rows={4}
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
                                                required
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
                                        src={imagePreview}
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
                                onClick={() => navigate('/admin/winners')}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Cancel
                            </button>
          <button
            type="submit"
                                disabled={loading}
                                className={`px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
                                {loading ? 'Adding...' : 'Add Winner'}
          </button>
                        </div>
        </form>
                </div>
      </div>
    </div>
  );
};

export default AddWinner;
