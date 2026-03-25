import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE_URL;

function EditRole() {
  const { id } = useParams(); // Get Role ID from URL
  const [name, setName] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState({});

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

  // Fetch role data + permissions
  useEffect(() => {
    if (!token) {
      navigate("/"); // Redirect if token is missing
      return;
    }

    const fetchData = async () => {
      try {
        const roleRes = await axiosInstance.get(`/api/roles/edit/${id}`);
        const { role, permissions: allPermissions } = roleRes.data;

        setName(role.name);
        setPermissions(allPermissions);

        // Convert assigned permissions into state object
        const assignedPerms = {};
        role.permissions.forEach((perm) => {
          assignedPerms[perm.name] = true;
        });
        setSelectedPermissions(assignedPerms);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/"); // Redirect if unauthorized
        } else {
          setError("Failed to load role data.");
        }
      }
    };

    fetchData();
  }, [id]);

  // Handle checkbox change
  const handlePermissionChange = (permName) => {
    setSelectedPermissions((prev) => ({
      ...prev,
      [permName]: !prev[permName],
    }));
  };

  // Submit updated role
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!token) {
      navigate("/"); // Redirect if token missing
      return;
    }

    setError("");
    setMessage("");

    // Convert object to array of checked permissions
    const selectedPermissionNames = Object.keys(selectedPermissions).filter(
      (key) => selectedPermissions[key] === true
    );

    axiosInstance
      .put(`/api/roles/update/${id}`, {
        name: name,
        permissions: selectedPermissionNames, // ✅ send as array
      })
      .then(() => {
        navigate("/roles", { state: { message: "Role updated successfully!" } });
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 401) {
            localStorage.removeItem("token");
            navigate("/"); // Redirect if unauthorized
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
    <div className="mt-5">
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow">
        <div className="card-header">
          <h5>Edit Role</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Role Name */}
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Role Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Permissions */}
            <div className="mt-4">
              <h5 className="mb-3">Permissions</h5>
              <div className="row">
                {permissions.length > 0 ? (
                  permissions.map((perm, index) => {
                    const isChecked = selectedPermissions[perm.name] || false;
                    return (
                      <div className="col-md-3 mb-2" key={index}>
                        <div className="form-check">
                          <input
                            className="form-check-input custom-checkbox"
                            type="checkbox"
                            id={`perm_${index}`}
                            checked={isChecked}
                            onChange={() => handlePermissionChange(perm.name)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`perm_${index}`}
                          >
                            {perm.name.replace(/_/g, " ").toUpperCase()}
                          </label>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p>No permissions found.</p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <button type="submit" className="btn btn-danger">
              Update
            </button>
            <Link to="/roles" className="btn btn-secondary ms-2">
              Cancel
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditRole;