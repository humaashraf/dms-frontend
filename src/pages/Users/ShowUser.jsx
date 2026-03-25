import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;

function ShowUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // Axios instance with token
  const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  useEffect(() => {
    if (!token) {
      navigate("/"); // Redirect if token is missing
      return;
    }

    if (id) {
      axiosInstance
        .get(`/api/users/show/${id}`)
        .then((response) => {
          setUser(response.data.data);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          if (err.response) {
            if (err.response.status === 401) {
              localStorage.removeItem("token");
              navigate("/"); // Redirect if unauthorized
            } else if (err.response.status === 404) {
              setError("User not found.");
            } else {
              setError("Failed to fetch user details.");
            }
          } else {
            setError("Network error occurred.");
          }
        });
    }
  }, [id]);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="container mt-4">
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!error && (
        <div className="card shadow">
          <div className="card-header">
            <h5 className="mb-0">User Details</h5>
          </div>

          <div className="card-body">
            <div className="mb-3"><strong>ID:</strong> {user.id}</div>
            <div className="mb-3"><strong>First Name:</strong> {user.name}</div>
            <div className="mb-3"><strong>Last Name:</strong> {user.last_name}</div>
            <div className="mb-3"><strong>Username:</strong> {user.username}</div>
            <div className="mb-3"><strong>Email:</strong> {user.email}</div>
            <div className="mb-3"><strong>Phone:</strong> {user.phone}</div>
            <div className="mb-3"><strong>Type:</strong> {user.type}</div>
            <div className="mb-3">
              <strong>Status:</strong>{' '}
              <span className={`badge ${user.status === 0 ? 'bg-success' : 'bg-secondary'}`}>
                {user.status === 0 ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <div className="mb-3">
              <strong>Role:</strong>
              <ul className="mt-2">
                {user.roles && user.roles.length > 0 ? (
                  user.roles.map((role, index) => (
                    <li key={index}>
                      {role.name.replace('_', ' ').toUpperCase()}
                    </li>
                  ))
                ) : (
                  <li className="text-muted">No roles assigned</li>
                )}
              </ul>
            </div>

            <Link to="/users" className="btn btn-secondary mt-3">Back to List</Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShowUser;