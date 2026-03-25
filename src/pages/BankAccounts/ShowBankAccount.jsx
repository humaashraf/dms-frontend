import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

function ShowBankAccount() {
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
      navigate("/"); // redirect if not logged in
      return;
    }

    if (id) {
      axiosInstance
        .get(`/api/bank-accounts/show/${id}`)
        .then((response) => {
          setApiData(response.data.data);
        })
        .catch((err) => {
          if (err.response) {
            if (err.response.status === 401) {
              localStorage.removeItem("token");
              navigate("/"); // unauthorized
            } else if (err.response.status === 404) {
              setError("Bank account not found.");
            } else {
              setError("Failed to fetch account details.");
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
        <div className="alert alert-danger">{error}</div>
      )}

      {!error && (
        <div className="card shadow">
          <div className="card-header">
            <h5 className="mb-0">Bank Account Details</h5>
          </div>

          <div className="card-body">
            <div className="mb-3">
              <strong>ID:</strong> {apiData.id}
            </div>

            <div className="mb-3">
              <strong>Account Title:</strong> {apiData.account_title}
            </div>

            <div className="mb-3">
              <strong>Account Number:</strong> {apiData.account_number}
            </div>

            <div className="mb-3">
              <strong>Bank Name:</strong> {apiData.bank_name}
            </div>

            <div className="mb-3">
              <strong>Balance:</strong> {apiData.balance}
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

            <Link
              to="/bank-accounts"
              className="btn btn-secondary mt-3"
            >
              Back to List
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShowBankAccount;