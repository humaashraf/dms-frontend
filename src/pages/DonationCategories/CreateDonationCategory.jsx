import axios from "axios";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE_URL;

function CreateDonationCatgory() {
  const [name, setName] = useState("");
  const [status, setstatus] = useState(0);

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

    if (!token) {
      navigate("/"); // redirect if not logged in
      return;
    }

    setError("");
    setMessage("");

    axiosInstance
      .post(`/api/donation-categories`, {
        name,
        status,
      })
      .then(() => {
        navigate("/donation-categories", {
          state: { message: "Donation category created successfully!" },
        });
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 401) {
            localStorage.removeItem("token");
            navigate("/"); // unauthorized
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
    <>
      <div className="mt-5">
        {message && (
          <div className="alert alert-success mt-3">{message}</div>
        )}

        {error && (
          <div className="alert alert-danger mt-3">{error}</div>
        )}

        <div className="card row shadow mx-1 mx-sm-0">
          <div className="card-header">
            <h5>Create Donation Category</h5>
          </div>

          <div className="col-md-12">
            <form onSubmit={handleSubmit}>
              <div className="form-group mt-3">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group mt-3">
                <label htmlFor="status">Status</label>
                <select
                  className="form-control"
                  value={status}
                  onChange={(e) => setstatus(e.target.value)}
                >
                  <option value="0">Active</option>
                  <option value="1">Inactive</option>
                </select>
              </div>

              <button type="submit" className="btn btn-color mb-3 mt-4">
                Create
              </button>

              <Link
                to="/donation-categories"
                className="btn btn-secondary mb-3 mt-4 ms-2"
              >
                Cancel
              </Link>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateDonationCatgory;