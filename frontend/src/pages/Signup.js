import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:5001';
axios.defaults.headers.post['Content-Type'] = 'application/json';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors
    setIsLoading(true); // Start loading
    
    try {
      console.log('Attempting signup with:', { name, email, role }); // Log the attempt
      
      const response = await axios({
        method: 'post',
        url: '/api/auth/signup',
        data: {
          name,
          email,
          password,
          role
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Signup response:', response.data); // Log the response

      if (response.data.success) {
        // Save token and user info
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Redirect based on role
        if (role === 'student') {
          navigate('/student-dashboard');
        } else if (role === 'admin') {
          navigate('/admin-dashboard');
        }
      }
    } catch (err) {
      console.error('Signup error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        stack: err.stack
      });
      
      setError(
        err.response?.data?.message || 
        err.message || 
        'Signup failed. Please try again.'
      );
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
   <div className="h-screen flex flex-col justify-start items-center bg-black text-black relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_5%_40%,#ff69b4_2%,transparent_15%),radial-gradient(circle_at_80%_55%,#ff69b4_5%,transparent_35%),radial-gradient(circle_at_10%_90%,#00ff9f_5%,transparent_35%),radial-gradient(circle_at_90%_10%,#00ff9f_5%,transparent_20%)] before:opacity-20 before:pointer-events-none">
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
            required
            disabled={isLoading}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
            required
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
            required
            disabled={isLoading}
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
            required
            disabled={isLoading}
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            className={`w-full py-3 rounded-lg transition duration-300 ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-400 text-white'
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <a href="/login" className="text-blue-500 hover:underline">Login</a>
        </p>
      </div>
    </div>
   </div>
  );
};

export default Signup;
