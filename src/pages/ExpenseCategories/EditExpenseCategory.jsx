import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE_URL;

function EditExpenseCategory() {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Axios instance with token
  const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  // Load data from localStorage
  useEffect(() => {
    setId(localStorage.getItem("id") || "");
    setName(localStorage.getItem("name") || "");
    setStatus(localStorage.getItem("status") || "");
  }, []);

  const handleUpdate = (e) => {
    e.preventDefault();

    if (!token) {
      navigate("/"); // Redirect to login if token missing
      return;
    }

    setError("");
    setMessage("");

    axiosInstance
      .put(`/api/expense-categories/edit/${id}`, {
        name,
        status,
      })
      .then(() => {
        navigate("/expense-categories", {
          state: { message: "Expense Category updated successfully!" },
        });
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 401) {
            localStorage.removeItem("token");
            navigate("/"); // Redirect if unauthorized
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
          <div className="alert alert-success mt-3" role="alert">
            {message}
          </div>
        )}
        {error && (
          <div className="alert alert-danger mt-3" role="alert">
            {error}
          </div>
        )}

        <div className="card row shadow mx-1 mx-sm-0">
          <div className="card-header">
            <h5>Edit Expense Category</h5>
          </div>
          <div className="col-md-12">
            <form onSubmit={handleUpdate}>
              <div className="form-group mt-3">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  value={name}
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
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="0">Active</option>
                  <option value="1">Inactive</option>
                </select>
              </div>

              <button type="submit" className="btn btn-color mb-3 mt-4">
                Update
              </button>
              <Link
                to="/expense-categories"
                type="button"
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

export default EditExpenseCategory;
