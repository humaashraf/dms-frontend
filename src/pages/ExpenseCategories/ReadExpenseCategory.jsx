import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { hasPermission, hasAnyPermission } from "../../utils/auth";

const API_URL = import.meta.env.VITE_API_BASE_URL;

function ReadExpenseCategory() {
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

  // Fetch data from API
  const getData = () => {
    if (!token) {
      navigate("/"); // Redirect if token missing
      return;
    }

    axiosInstance
      .get(`/api/expense-categories`)
      .then((response) => {
        setApiData(response.data);
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 401) {
            localStorage.removeItem("token");
            navigate("/");
          } else {
            setError("Failed to load categories.");
          }
        } else {
          setError("Network error occurred.");
        }
      });
  };

  // Delete category
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      axiosInstance
        .delete(`/api/expense-categories/${id}`)
        .then(() => {
          setMessage("Expense Category deleted successfully!");
          getData();
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            localStorage.removeItem("token");
            navigate("/");
          } else {
            setError("Failed to delete category.");
          }
        });
    }
  };

  // Store data in localStorage for edit
  const setDataToStorage = (id, name, status) => {
    localStorage.setItem("id", id);
    localStorage.setItem("name", name);
    localStorage.setItem("status", status);
  };

  // On Component Load
  useEffect(() => {
    getData();

    if (location.state && location.state.message) {
      setMessage(location.state.message);
      navigate(location.pathname, { replace: true }); // Clear message after navigation
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
            <h5 className="mx-1 mt-2">Expense Category List</h5>
            
              <Link
                to="/expense-categories/create"
                className="btn btn-color ms-auto m-2"
              >
                Add new Category
              </Link>
            
          </div>

          <div className="card-body">
            <div className="table-responsive">
              <table className="table align-middle text-center mb-0">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Status</th>
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
                          {item.status === 0 ? (
                            <span className="badge bg-success">Active</span>
                          ) : (
                            <span className="badge bg-secondary">Inactive</span>
                          )}
                        </td>

                        
                          <td>
                            
                              <Link to={`/expense-categories/show/${item.id}`}>
                                <button className="btn btn-sm text-primary me-2">
                                  <i className="bi bi-eye"></i>
                                </button>
                              </Link>
                            

                           
                              <Link to={`/expense-categories/edit/${item.id}`}>
                                <button
                                  className="btn btn-sm text-success me-2"
                                  onClick={() =>
                                    setDataToStorage(
                                      item.id,
                                      item.name,
                                      item.status
                                    )
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
                      <td colSpan="4" className="text-muted">
                        No category found
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

export default ReadExpenseCategory;
