import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE_URL;

function ReadPaymentMethod() {
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

  // Fetch all payment methods
  const getData = () => {
    if (!token) {
      navigate("/"); // Redirect to login if no token
      return;
    }

    axiosInstance
      .get("/api/payment-methods")
      .then((response) => {
        setApiData(response.data);
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/"); // Redirect on Unauthorized
        } else {
          setError("Failed to load payment methods.");
        }
      });
  };

  // Delete payment method
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this method?")) {
      axiosInstance
        .delete(`/api/payment-methods/${id}`)
        .then(() => {
          setMessage("Payment Method deleted successfully!");
          getData();
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            localStorage.removeItem("token");
            navigate("/");
          } else {
            setError("Error deleting payment method.");
          }
        });
    }
  };

  const setDataToStorage = (id, name) => {
    localStorage.setItem("id", id);
    localStorage.setItem("name", name);
  };

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
        <div className="alert alert-success mt-3" role="alert">
          {message}
        </div>
      )}
      {error && (
        <div className="alert alert-danger mt-3" role="alert">
          {error}
        </div>
      )}

      <div className="mt-4">
        <div className="card shadow rounded">
          <div className="card-header d-flex">
            <h5 className="mx-1 mt-2">Payment Method List</h5>
            <Link
              to="/payment-methods/create"
              className="btn btn-color ms-auto m-2"
            >
              Add new Method
            </Link>
          </div>

          <div className="card-body">
            <div className="table-responsive">
              <table className="table align-middle text-center mb-0">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {apiData.length > 0 ? (
                    apiData.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>
                          <Link to={`/payment-methods/edit/${item.id}`}>
                            <button
                              className="btn btn-sm text-success me-2"
                              onClick={() =>
                                setDataToStorage(item.id, item.name)
                              }
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
                      <td colSpan="3" className="text-muted">
                        No method found
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

export default ReadPaymentMethod;
