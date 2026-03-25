import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_BASE_URL;

function EditUser() {
  const { id } = useParams(); // Get user ID from URL
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [password, setPassword] = useState('');

  const [roles, setRoles] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Axios instance with token
  const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  // Fetch user details + roles for dropdown
  useEffect(() => {
    if (!token) {
      navigate("/"); // Redirect if token missing
      return;
    }

    axiosInstance.get(`/api/users/edit/${id}`)
      .then((res) => {
        const user = res.data.data;
        setRoles(res.data.roles || []);
        setName(user.name || '');
        setLastName(user.last_name || '');
        setUsername(user.username || '');
        setPhone(user.phone || '');
        setEmail(user.email || '');
        setRole(user.roles && user.roles.length > 0 ? user.roles[0].name : '');
        setType(user.type || 'staff');
        setStatus(user.status.toString());
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/"); // Redirect if unauthorized
        } else {
          setError('Failed to load user data.');
        }
      });
  }, [id]);

  // Submit form (Update user)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!token) {
      navigate("/"); // Redirect if token missing
      return;
    }

    setError('');
    setMessage('');

    axiosInstance.put(`/api/users/update/${id}`, {
      name,
      last_name: lastName,
      username,
      phone,
      email,
      role,
      type,
      status,
      ...(password ? { password: password } : {}), // Only send password if entered
    })
      .then(() => {
        navigate('/users', { state: { message: "User updated successfully!" } });
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 401) {
            localStorage.removeItem("token");
            navigate("/"); // Redirect if unauthorized
          } else if (err.response.status === 422) {
            const errors = err.response.data.errors;
            const messages = Object.values(errors).flat().join(' ');
            setError(messages);
          } else {
            setError("Something went wrong!");
          }
        } else {
          setError("Network error occurred!");
        }
      });
  };

  return (
    <div className="mt-5">
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow">
        <div className="card-header">
          <h5>Edit User</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* First Name */}
            <div className="mb-3">
              <label className="form-label">First Name</label>
              <input type="text" className="form-control" placeholder='First Name' required value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            {/* Last Name */}
            <div className="mb-3">
              <label className="form-label">Last Name</label>
              <input type="text" className="form-control" placeholder='Last Name' value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>

            {/* Username */}
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input type="text" className="form-control" placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>

            {/* Phone */}
            <div className="mb-3">
              <label className="form-label">Phone</label>
              <input type="text" className="form-control" placeholder='Phone' value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" placeholder='Email' required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            {/* Role */}
            <div className="mb-3">
              <label className="form-label">Role</label>
              <select className="form-select" required value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="">Select Role</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.name}>
                    {r.name.replace('_', ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div className="mb-3">
              <label className="form-label">Type</label>
              <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="staff">Staff</option>
                <option value="user">User</option>
              </select>
            </div>

            {/* Status */}
            <div className="mb-3">
              <label className="form-label">Status</label>
              <select className="form-select" required value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">Select Status</option>
                <option value="0">Active</option>
                <option value="1">Inactive</option>
              </select>
            </div>

            {/* Password (Optional) */}
            <div className="mb-3">
              <label className="form-label">Password (Leave blank to keep current)</label>
              <input type="password" placeholder='Password' className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            {/* Buttons */}
            <button type="submit" className="btn btn-success">Update</button>
            <Link to="/users" className="btn btn-secondary ms-2">Cancel</Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditUser;