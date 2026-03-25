import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE_URL;

function EditBankAccount() {
  const navigate = useNavigate();

  const [id, setId] = useState("");
  const [accountTitle, setAccountTitle] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [balance, setBalance] = useState(0);
  const [status, setStatus] = useState(0);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

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
    setAccountTitle(localStorage.getItem("account_title") || "");
    setAccountNumber(localStorage.getItem("account_number") || "");
    setBankName(localStorage.getItem("bank_name") || "");
    setBalance(localStorage.getItem("balance") || 0);
    setStatus(localStorage.getItem("status") || 0);
  }, []);

  const handleUpdate = (e) => {
    e.preventDefault();

    if (!token) {
      navigate("/"); // redirect if not logged in
      return;
    }

    setError("");
    setMessage("");

    axiosInstance
      .put(`/api/bank-accounts/edit/${id}`, {
        account_title: accountTitle,
        account_number: accountNumber,
        bank_name: bankName,
        balance: balance,
        status: status,
      })
      .then(() => {
        navigate("/bank-accounts", {
          state: { message: "Bank Account updated successfully!" },
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
            <h5>Edit Bank Account</h5>
          </div>

          <div className="col-md-12">
            <form onSubmit={handleUpdate}>
              <div className="form-group mt-3">
                <label>Account Title</label>
                <input
                  type="text"
                  value={accountTitle}
                  onChange={(e) => setAccountTitle(e.target.value)}
                  placeholder="Account Title"
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group mt-3">
                <label>Account Number</label>
                <input
                  type="number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Account Number"
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group mt-3">
                <label>Bank Name</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Bank Name"
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group mt-3">
                <label>Balance</label>
                <input
                  type="number"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                  placeholder="Balance"
                  className="form-control"
                />
              </div>

              <div className="form-group mt-3">
                <label>Status</label>
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
                to="/bank-accounts"
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

export default EditBankAccount;