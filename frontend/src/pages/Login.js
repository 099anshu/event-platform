import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', {
        email,
        password,
      });

      // Save token and user info in localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Redirect after login
      window.location.href = '/events'; // or /dashboard
    } catch (err) {
      console.error('Login error:', err);
      alert('Invalid email or password.');
    }
  };

  return (
    <div className="h-screen flex flex-col justify-start items-center bg-black text-black relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_5%_40%,#ff69b4_2%,transparent_15%),radial-gradient(circle_at_80%_55%,#ff69b4_5%,transparent_35%),radial-gradient(circle_at_10%_90%,#00ff9f_5%,transparent_35%),radial-gradient(circle_at_90%_10%,#00ff9f_5%,transparent_20%)] before:opacity-20 before:pointer-events-none">
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-400 transition duration-300"
            >
              Login
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account? <a href="/signup" className="text-blue-500 hover:underline">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
