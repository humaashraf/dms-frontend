import axios from "axios";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE_URL;

function CreateBankAccount() {
  const [accountTitle, setAccountTitle] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [balance, setBalance] = useState(0);
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
      .post(`/api/bank-accounts`, {
        account_title: accountTitle,
        account_number: accountNumber,
        bank_name: bankName,
        balance: balance,
        status: status,
      })
      .then(() => {
        navigate("/bank-accounts", {
          state: { message: "Bank Account created successfully!" },
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
            <h5>Create Bank Account</h5>
          </div>

          <div className="col-md-12">
            <form onSubmit={handleSubmit}>
              <div className="form-group mt-3">
                <label>Account Title</label>
                <input
                  type="text"
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
                  onChange={(e) => setBalance(e.target.value)}
                  value={balance}
                  placeholder="Balance"
                  className="form-control"
                />
              </div>

              <div className="form-group mt-3">
                <label>Status</label>
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

export default CreateBankAccount;