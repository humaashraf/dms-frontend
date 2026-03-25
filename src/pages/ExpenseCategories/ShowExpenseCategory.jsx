import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

function ShowExpenseCategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [apiData, setApiData] = useState({});
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
        .get(`/api/expense-categories/show/${id}`)
        .then((response) => {
          setApiData(response.data);
        })
        .catch((err) => {
          if (err.response) {
            if (err.response.status === 401) {
              localStorage.removeItem("token");
              navigate("/"); // Redirect to login if unauthorized
            } else if (err.response.status === 404) {
              setError("Expense category not found.");
            } else {
              setError("Failed to fetch category details.");
            }
          } else {
            setError("Network error occurred.");
          }
        });
    }
  }, [id]);

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
            <h5 className="mb-0">Expense Category Details</h5>
          </div>

          <div className="card-body">
            <div className="mb-3">
              <strong>ID:</strong> {apiData.id}
            </div>
            <div className="mb-3">
              <strong>Name:</strong> {apiData.name}
            </div>
            <div className="mb-3">
              <strong>Status:</strong>{" "}
              <span
                className={`badge ${
                  apiData.status === 0 ? "bg-success" : "bg-secondary"
                }`}
              >
                {apiData.status === 0 ? "Active" : "Inactive"}
              </span>
            </div>

            <Link to="/expense-categories" className="btn btn-secondary mt-3">
              Back to List
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShowExpenseCategory;
