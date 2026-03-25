import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE_URL;

function EditPermission() {
    const { id } = useParams();
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    // ✅ Axios instance with token
    const axiosInstance = axios.create({
        baseURL: API_URL,
        headers: {
            Authorization: token ? `Bearer ${token}` : "",
        },
    });

    // Fetch permission details
    useEffect(() => {
        if (!token) {
            navigate("/"); // Redirect if token missing
            return;
        }

        axiosInstance
            .get(`/api/permissions/edit/${id}`)
            .then((res) => {
                if (res.data.status) {
                    setName(res.data.data.name);
                } else {
                    setError("Permission not found!");
                }
            })
            .catch((err) => {
                if (err.response && err.response.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/");
                } else {
                    setError("Failed to fetch permission details.");
                }
            });
    }, [id]);

    // Update Permission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!token) {
            navigate("/"); // Redirect if token missing
            return;
        }

        setError("");
        setMessage("");

        axiosInstance
            .put(`/api/permissions/update/${id}`, { name })
            .then(() => {
                navigate("/permissions", {
                    state: { message: "Permission updated successfully!" },
                });
            })
            .catch((err) => {
                if (err.response) {
                    if (err.response.status === 401) {
                        localStorage.removeItem("token");
                        navigate("/");
                    } else if (err.response.status === 422) {
                        const errors = err.response.data.errors;
                        const messages = Object.values(errors).flat().join(" ");
                        setError(messages);
                    } else if (err.response.data.update_error) {
                        setError(err.response.data.update_error);
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
                    <h5>Edit Permission</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        {/* Name */}
                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Permission Name"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        {/* Buttons */}
                        <button type="submit" className="btn btn-danger">
                            Update
                        </button>
                        <Link to="/permissions" className="btn btn-secondary ms-2">
                            Cancel
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditPermission;