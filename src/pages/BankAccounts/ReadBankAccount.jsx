import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE_URL;

function ReadBankAccount() {
  const location = useLocation();
  const navigate = useNavigate();

  const [apiData, setApiData] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // Axios instance with token
  const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  // Fetch Data
  const getData = () => {
    if (!token) {
      navigate("/");
      return;
    }

    axiosInstance
      .get(`/api/bank-accounts`)
      .then((response) => {
        setApiData(response.data.data || []);
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 401) {
            localStorage.removeItem("token");
            navigate("/");
          } else {
            setError("Failed to fetch bank accounts.");
          }
        } else {
          setError("Network error occurred.");
        }
      });
  };

  // Delete
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      axiosInstance
        .delete(`/api/bank-accounts/${id}`)
        .then((res) => {
          setMessage(
            res.data.message || "Bank Account deleted successfully!"
          );
          getData();
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            localStorage.removeItem("token");
            navigate("/");
          } else {
            setError(
              err.response?.data?.message || "Deletion failed."
            );
          }
        });
    }
  };

  // Store data for edit
  const setDataToStorage = (account) => {
    localStorage.setItem("id", account.id);
    localStorage.setItem("account_title", account.account_title);
    localStorage.setItem("account_number", account.account_number);
    localStorage.setItem("bank_name", account.bank_name);
    localStorage.setItem("balance", account.balance);
    localStorage.setItem("status", account.status);
  };

  // On Load
  useEffect(() => {
    getData();

    if (location.state && location.state.message) {
      setMessage(location.state.message);
      navigate(location.pathname, { replace: true });
    }
  }, []);

  return (
    <>
      {message && (
        <div className="alert alert-success mt-3">{message}</div>
      )}

      {error && (
        <div className="alert alert-danger mt-3">{error}</div>
      )}

      <div className="mt-4">
        <div className="card shadow rounded">
          <div className="card-header d-flex">
            <h5 className="mx-1 mt-2">Bank Account List</h5>

            <Link
              to="/bank-accounts/create"
              className="btn btn-color ms-auto m-2"
            >
              Add New Account
            </Link>
          </div>

          <div className="card-body">
            <div className="table-responsive">
              <table className="table align-middle text-center mb-0">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Account Title</th>
                    <th>Account Number</th>
                    <th>Bank Name</th>
                    <th>Balance</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {apiData.length > 0 ? (
                    apiData.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.account_title}</td>
                        <td>{item.account_number}</td>
                        <td>{item.bank_name}</td>
                        <td>{item.balance}</td>

                        <td>
                          {item.status === 0 ? (
                            <span className="badge bg-success">
                              Active
                            </span>
                          ) : (
                            <span className="badge bg-secondary">
                              Inactive
                            </span>
                          )}
                        </td>

                        <td>
                          <Link to={`/bank-accounts/show/${item.id}`}>
                            <button className="btn btn-sm text-primary me-2">
                              <i className="bi bi-eye"></i>
                            </button>
                          </Link>

                          <Link to={`/bank-accounts/edit/${item.id}`}>
                            <button
                              className="btn btn-sm text-success me-2"
                              onClick={() => setDataToStorage(item)}
                            >
                              <i className="bi bi-pencil-square"></i>
                            </button>
                          </Link>

                          <button
                            className="btn btn-sm text-danger"
                            onClick={() => handleDelete(item.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-muted">
                        No bank accounts found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReadBankAccount;