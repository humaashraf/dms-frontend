import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE_URL;

function ReadUser() {
  const location = useLocation();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const token = localStorage.getItem("token");

  // Axios instance with token
  const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  // ✅ Fetch users with pagination
  const getUsers = (page = 1) => {
    if (!token) {
      navigate("/"); // Redirect if no token
      return;
    }

    axiosInstance
      .get(`/api/users?page=${page}`)
      .then((response) => {
        setUsers(response.data.data.data || []); // Users array
        setPagination(response.data.data); // Pagination info
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
        } else {
          setError("Failed to fetch users.");
        }
      });
  };

  // ✅ Delete user
  const handleDelete = (id) => {
    if (!token) {
      navigate("/"); // Redirect if no token
      return;
    }

    if (window.confirm("Are you sure you want to delete this user?")) {
      axiosInstance
        .delete(`/api/users/${id}`)
        .then((res) => {
          setMessage(res.data.message || "User deleted successfully!");
          getUsers(currentPage); // Refresh current page
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

  useEffect(() => {
    getUsers();

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
            <h5 className="mx-1 mt-2">Users</h5>
            <Link to="/users/create" className="btn btn-danger ms-auto m-2">
              Add New User
            </Link>
          </div>

          <div className="card-body">
            <div className="table-responsive">
              <table className="table align-middle text-center mb-0">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.last_name || "—"}</td>
                        <td>{user.username || "—"}</td>
                        <td>
                          {user.roles && user.roles.length > 0
                            ? user.roles[0].name
                            : "No Role Assigned"}
                        </td>
                        <td>{user.email}</td>
                        <td>{user.phone || "—"}</td>
                        <td>{user.type}</td>
                        <td>
                          <span
                            className={`badge ${
                              user.status == 0 ? "bg-success" : "bg-secondary"
                            }`}
                          >
                            {user.status == 0 ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          <Link to={`/users/show/${user.id}`}>
                            <button className="btn btn-sm text-primary me-2">
                              <i className="bi bi-eye"></i>
                            </button>
                          </Link>

                          <Link to={`/users/edit/${user.id}`}>
                            <button className="btn btn-sm text-success me-2">
                              <i className="bi bi-pencil-square"></i>
                            </button>
                          </Link>

                          <button
                            className="btn btn-sm text-danger"
                            onClick={() => handleDelete(user.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="text-muted">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* ✅ Pagination */}
            {pagination.last_page > 1 && (
              <nav className="mt-3">
                <ul className="pagination justify-content-end">
                  {/* Previous */}
                  <li
                    className={`page-item ${
                      pagination.current_page === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => {
                        setCurrentPage(pagination.current_page - 1);
                        getUsers(pagination.current_page - 1);
                      }}
                    >
                      Previous
                    </button>
                  </li>

                  {/* Page Numbers */}
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
                          getUsers(index + 1);
                        }}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}

                  {/* Next */}
                  <li
                    className={`page-item ${
                      pagination.current_page === pagination.last_page
                        ? "disabled"
                        : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => {
                        setCurrentPage(pagination.current_page + 1);
                        getUsers(pagination.current_page + 1);
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

export default ReadUser;