import axios from "axios";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE_URL;

function CreateCurrency() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [symbol, setSymbol] = useState("");

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
      navigate("/"); // Redirect if token is missing
      return;
    }

    setError("");
    setMessage("");

    axiosInstance
      .post(`/api/currencies`, {
        name,
        code,
        symbol,
      })
      .then(() => {
        navigate("/currencies", {
          state: { message: "Currency created successfully!" },
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
            <h5>Create Currency</h5>
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
                <label htmlFor="code">Code</label>
                <input
                  type="text"
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Code"
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group mt-3">
                <label htmlFor="symbol">Symbol</label>
                <input
                  type="text"
                  onChange={(e) => setSymbol(e.target.value)}
                  placeholder="Symbol"
                  className="form-control"
                  required
                />
              </div>

              <button type="submit" className="btn btn-color mb-3 mt-4">
                Create
              </button>
              <Link
                to="/currencies"
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

export default CreateCurrency;
