import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

function ShowCurrency() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currency, setCurrency] = useState({});
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

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
      navigate("/");
      return;
    }

    if (id) {
      axiosInstance
        .get(`/api/currencies/show/${id}`)
        .then((response) => {
          setCurrency(response.data);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          if (error.response && error.response.status === 401) {
            localStorage.removeItem("token");
            navigate("/");
          } else {
            setErrorMsg("Failed to load currency details.");
          }
        });
    }
  }, [id, navigate]);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="container mt-4">
      {errorMsg && (
        <div className="alert alert-danger mb-3" role="alert">
          {errorMsg}
        </div>
      )}

      <div className="card shadow">
        <div className="card-header">
          <h5 className="mb-0">Currency Details</h5>
        </div>

        <div className="card-body">
          <div className="mb-3">
            <strong>ID:</strong> {currency.id || "N/A"}
          </div>

          <div className="mb-3">
            <strong>Name:</strong> {currency.name || "N/A"}
          </div>

          <div className="mb-3">
            <strong>Code:</strong> {currency.code || "N/A"}
          </div>

          <div className="mb-3">
            <strong>Symbol:</strong> {currency.symbol || "N/A"}
          </div>

          <Link to="/currencies" className="btn btn-secondary mt-3">
            Back to List
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ShowCurrency;
