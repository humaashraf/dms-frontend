import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE_URL;

function ReadCurrency() {
  const location = useLocation();
  const navigate = useNavigate();

  const [currencies, setCurrencies] = useState([]);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const token = localStorage.getItem("token");

  // Axios instance with token
  const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  // Fetch data
  const getData = () => {
    axiosInstance
      .get("/api/currencies")
      .then((response) => {
        setCurrencies(response.data || []);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
        } else {
          setErrorMsg("Failed to load currencies.");
        }
      });
  };

  // Delete currency
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this currency?")) {
      axiosInstance
        .delete(`/api/currencies/${id}`)
        .then(() => {
          setMessage("Currency deleted successfully!");
          getData();
        })
        .catch(() => {
          setErrorMsg("Failed to delete currency.");
        });
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    getData();

    if (location.state && location.state.message) {
      setMessage(location.state.message);
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate]);

  return (
    <>
      {message && (
        <div className="alert alert-success mt-3" role="alert">
          {message}
        </div>
      )}
      {errorMsg && (
        <div className="alert alert-danger mt-3" role="alert">
          {errorMsg}
        </div>
      )}

      <div className="mt-4">
        <div className="card shadow rounded">
          <div className="card-header d-flex">
            <h5 className="mx-1 mt-2">Currency List</h5>
            <Link
              to="/currencies/create"
              className="btn btn-color ms-auto m-2"
            >
              Add New Currency
            </Link>
          </div>

          <div className="card-body">
            <div className="table-responsive">
              <table className="table align-middle text-center mb-0">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Code</th>
                    <th>Symbol</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currencies.length > 0 ? (
                    currencies.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.code}</td>
                        <td>{item.symbol}</td>
                        <td>
                          <Link to={`/currencies/show/${item.id}`}>
                            <button className="btn btn-sm text-primary me-2">
                              <i className="bi bi-eye"></i>
                            </button>
                          </Link>

                          <Link to={`/currencies/edit/${item.id}`}>
                            <button className="btn btn-sm text-success me-2">
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
                      <td colSpan="5" className="text-muted">
                        No currency found
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

export default ReadCurrency;
