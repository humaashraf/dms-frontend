import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE_URL;

function ReadRoles() {
  const location = useLocation();
  const navigate = useNavigate();

  const [roles, setRoles] = useState([]);
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

  // Fetch Roles Data
  const getRoles = () => {
    if (!token) {
      navigate("/"); // Redirect if token missing
      return;
    }

    axiosInstance
      .get("/api/roles")
      .then((response) => {
        setRoles(response.data.data || []);
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 401) {
            localStorage.removeItem("token");
            navigate("/"); // Redirect if unauthorized
          } else {
            setError("Failed to fetch roles.");
          }
        } else {
          setError("Network error occurred.");
        }
      });
  };

  // Handle Delete Role
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      axiosInstance
        .delete(`/api/roles/${id}`)
        .then((res) => {
          setMessage(res.data.message || "Role deleted successfully!");
          getRoles();
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            localStorage.removeItem("token");
            navigate("/");
          } else {
            setError(err.response?.data?.message || "Deletion failed.");
          }
        });
    }
  };

  // On Load
  useEffect(() => {
    getRoles();

    if (location.state && location.state.message) {
      setMessage(location.state.message);
      navigate(location.pathname, { replace: true }); // Clear message
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
            <h5 className="mx-1 mt-2">Roles</h5>
            <Link to="/roles/create" className="btn btn-danger ms-auto m-2">
              Add New Role
            </Link>
          </div>

          <div className="card-body">
            <div className="table-responsive">
              <table className="table align-middle text-center mb-0">
                <thead>
                  <tr>
                    <th width="60px">ID</th>
                    <th>Name</th>
                    <th width="200px">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.length > 0 ? (
                    roles.map((role) => (
                      <tr key={role.id}>
                        <td>{role.id}</td>
                        <td>{role.name}</td>
                        <td>
                          <Link to={`/roles/show/${role.id}`}>
                            <button className="btn btn-sm text-primary me-2">
                              <i className="bi bi-eye"></i>
                            </button>
                          </Link>

                          <Link to={`/roles/edit/${role.id}`}>
                            <button className="btn btn-sm text-success me-2">
                              <i className="bi bi-pencil-square"></i>
                            </button>
                          </Link>

                          <button
                            className="btn btn-sm text-danger"
                            onClick={() => handleDelete(role.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-muted">
                        No roles found
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

export default ReadRoles;