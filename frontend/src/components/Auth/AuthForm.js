import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthForm = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password, confirmPassword, role } = form;
    const endpoint = isSignup ? '/api/auth/signup' : '/api/auth/login';

    if (isSignup && password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(endpoint, {
        email,
        password,
        role,
      });

      if (response.data.success) {
        if (role === 'student') {
          navigate('/student-dashboard'); // or `/register/:eventId` depending on flow
        } else if (role === 'admin') {
          navigate('/admin-dashboard');
        }
      } else {
        alert(response.data.message || 'Login/Signup failed');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="auth-container">
      <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" required onChange={handleChange} />

        <input type="password" name="password" placeholder="Password" required onChange={handleChange} />

        {isSignup && (
          <input type="password" name="confirmPassword" placeholder="Confirm Password" required onChange={handleChange} />
        )}

        <select name="role" value={form.role} onChange={handleChange}>
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit">{isSignup ? 'Sign Up' : 'Login'}</button>
      </form>

      <p onClick={() => setIsSignup(!isSignup)} style={{ cursor: 'pointer', marginTop: '10px' }}>
        {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
      </p>
    </div>
  );
};

export default AuthForm;
