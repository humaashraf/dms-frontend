import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axios'; // ✅ Import axios instance
import ProfilePic from './../assets/dms.png';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/login', formData); // ✅ Using custom axios instance
      if (res.data.status) {
        // ✅ Save token to localStorage
        localStorage.setItem('token', res.data.token);

        // ✅ Redirect to dashboard
        navigate('/dashboard', { state: { successMessage: 'Login successfully!' } });
      }
    } catch (err) {
      console.error(err);
      setError('Invalid email or password');
    }
  };

  return (
    <div className="container mt-5 shadow col-md-4 bg-white p-5 rounded">
      <div className="text-center mb-4">
        <img src={ProfilePic} alt="DMS pic" className="rounded-circle mb-2" width="80" height="80" />
        <h2 className="color">DMS</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            className="form-control shadow-sm"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          {error && <p className="text-danger">{error}</p>}
        </div>
        <div className="mb-3">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            className="form-control shadow-sm"
            placeholder="Password"
            onChange={handleChange}
            required
          />
        </div>
        <button className="btn login-btn w-100 shadow">Login</button>
      </form>
    </div>
  );
};

export default Login;
