import axios from "axios";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE_URL;

function CreatePermission() {
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    // Axios instance with token
    const axiosInstance = axios.create({
        baseURL: API_URL,
        headers: {
            Authorization: token ? `Bearer ${token}` : "",
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check token
        if (!token) {
            navigate("/");
            return;
        }

        setError("");
        setMessage("");

        axiosInstance
            .post(`/api/permissions/store`, { name })
            .then(() => {
                navigate("/permissions", {
                    state: { message: "Permission created successfully!" },
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
                    <h5>Create Permission</h5>
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
                            Create
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

export default CreatePermission;