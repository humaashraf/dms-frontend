import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE_URL;

function EditCurrency() {
  const { id } = useParams();
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

  // Fetch currency details by ID
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    axiosInstance
      .get(`/api/currencies/show/${id}`)
      .then((response) => {
        const data = response.data;
        setName(data.name);
        setCode(data.code);
        setSymbol(data.symbol);
      })
      .catch((error) => {
        console.error("Error fetching currency:", error);
        setError("Failed to load currency details.");
      });
  }, [id]);

  // Update currency
  const handleUpdate = (e) => {
    e.preventDefault();

    if (!token) {
      navigate("/");
      return;
    }

    setError("");
    setMessage("");

    axiosInstance
      .put(`/api/currencies/edit/${id}`, {
        name,
        code,
        symbol,
      })
      .then(() => {
        navigate("/currencies", {
          state: { message: "Currency updated successfully!" },
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
        {message && <div className="alert alert-success mt-3">{message}</div>}
        {error && <div className="alert alert-danger mt-3">{error}</div>}

        <div className="card row shadow mx-1 mx-sm-0">
          <div className="card-header">
            <h5>Edit Currency</h5>
          </div>
          <div className="col-md-12">
            <form onSubmit={handleUpdate}>
              <div className="form-group mt-3">
                <label>Name</label>
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
                <label>Code</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Code"
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group mt-3">
                <label>Symbol</label>
                <input
                  type="text"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  placeholder="Symbol"
                  className="form-control"
                  required
                />
              </div>

              <button type="submit" className="btn btn-color mb-3 mt-4">
                Update
              </button>
              <Link
                to="/currencies"
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

export default EditCurrency;
