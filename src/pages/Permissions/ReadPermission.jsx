import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";

const API_URL = import.meta.env.VITE_API_BASE_URL;

function ReadPermission() {
  const navigate = useNavigate();
  const location = useLocation();

  const [permissions, setPermissions] = useState([]);
  const [pagination, setPagination] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [dateFormat, setDateFormat] = useState("Y-m-d");

  const [currentPage, setCurrentPage] = useState(1);

  const token = localStorage.getItem("token");

  // Axios instance with token
  const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  // Convert Laravel date format to date-fns
  const laravelToDateFns = (formatStr) =>
    formatStr
      .replace(/d/g, "dd")
      .replace(/m/g, "MM")
      .replace(/Y/g, "yyyy")
      .replace(/H/g, "HH")
      .replace(/i/g, "mm")
      .replace(/s/g, "ss")
      .replace(/A/g, "aa");

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    try {
      return format(date, laravelToDateFns(dateFormat));
    } catch {
      return date.toLocaleDateString();
    }
  };

  // Fetch permissions
  const getPermissions = (page = 1) => {
    if (!token) {
      navigate("/");
      return;
    }

    axiosInstance
      .get(`/api/permissions?page=${page}`)
      .then((res) => {
        setPermissions(res.data.data.data || []);
        setPagination(res.data.data);

        if (res.data.dateFormat) {
          setDateFormat(res.data.dateFormat);
        }
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 401) {
            localStorage.removeItem("token");
            navigate("/");
          } else {
            setError("Failed to load permissions.");
          }
        } else {
          setError("Network error occurred.");
        }
      });
  };

  // Delete permission
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this permission?")) {
      axiosInstance
        .delete(`/api/permissions/delete/${id}`)
        .then((res) => {
          setMessage(res.data.message || "Permission deleted successfully!");
          getPermissions(currentPage);
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            localStorage.removeItem("token");
            navigate("/");
          } else {
            setError("Failed to delete permission.");
          }
        });
    }
  };

  // On Load
  useEffect(() => {
    getPermissions();

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
            <h5 className="mx-1 mt-2">Permissions</h5>

            <Link
              to="/permissions/create"
              className="btn btn-color ms-auto m-2"
            >
              Add New Permission
            </Link>
          </div>

          <div className="card-body">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Assign To</th>
                    <th>Created Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {permissions.length > 0 ? (
                    permissions.map((perm) => (
                      <tr key={perm.id}>
                        <td>{perm.id}</td>
                        <td>{perm.name}</td>

                        <td>
                          {perm.roles && perm.roles.length > 0 ? (
                            perm.roles.map((role, index) => (
                              <span key={index} className="badge bg-success me-1">
                                {role.name.replace(/_/g, " ").toUpperCase()}
                              </span>
                            ))
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>

                        <td>{formatDate(perm.created_at)}</td>

                        <td>
                          <Link to={`/permissions/edit/${perm.id}`}>
                            <button className="btn btn-sm text-success me-2">
                              <i className="bi bi-pencil-square"></i>
                            </button>
                          </Link>

                          <button
                            className="btn btn-sm text-danger"
                            onClick={() => handleDelete(perm.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-muted">
                        No permissions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.last_page > 1 && (
              <nav className="mt-3">
                <ul className="pagination justify-content-end">
                  <li className={`page-item ${pagination.current_page === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => {
                        setCurrentPage(pagination.current_page - 1);
                        getPermissions(pagination.current_page - 1);
                      }}
                    >
                      Previous
                    </button>
                  </li>

                  {[...Array(pagination.last_page)].map((_, index) => (
                    <li
                      key={index}
                      className={`page-item ${
                        pagination.current_page === index + 1 ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => {
                          setCurrentPage(index + 1);
                          getPermissions(index + 1);
                        }}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}

                  <li
                    className={`page-item ${
                      pagination.current_page === pagination.last_page ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => {
                        setCurrentPage(pagination.current_page + 1);
                        getPermissions(pagination.current_page + 1);
                      }}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ReadPermission;