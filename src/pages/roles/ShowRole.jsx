import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

function ShowRole() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [role, setRole] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      navigate("/"); // Redirect if token is missing
      return;
    }

    if (id) {
      axiosInstance
        .get(`/api/roles/show/${id}`)
        .then((response) => {
          setRole(response.data.data);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          if (err.response) {
            if (err.response.status === 401) {
              localStorage.removeItem("token");
              navigate("/"); // Redirect if unauthorized
            } else if (err.response.status === 404) {
              setError("Role not found.");
            } else {
              setError("Failed to load role details.");
            }
          } else {
            setError("Network error occurred.");
          }
        });
    }
  }, [id]);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger mt-4">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header">
          <h5 className="mb-0">Role Details</h5>
        </div>

        <div className="card-body">
          <div className="mb-3">
            <strong>ID:</strong> {role.id}
          </div>

          <div className="mb-3">
            <strong>Name:</strong> {role.name}
          </div>

          {/* Permissions */}
          <div className="mb-3">
            <strong>Permissions:</strong>
            {role.permissions && role.permissions.length > 0 ? (
              <div className="container mt-2">
                {role.permissions
                  .reduce((chunks, permission, index) => {
                    const chunkIndex = Math.floor(index / 4);
                    if (!chunks[chunkIndex]) chunks[chunkIndex] = [];
                    chunks[chunkIndex].push(permission);
                    return chunks;
                  }, [])
                  .map((chunk, i) => (
                    <div className="row mb-2" key={i}>
                      {chunk.map((perm, j) => (
                        <div className="col-md-3" key={j}>
                          • {perm.name.replace(/_/g, " ").toUpperCase()}
                        </div>
                      ))}
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-muted mt-2">No permissions assigned.</p>
            )}
          </div>

          <Link to="/roles" className="btn btn-secondary mt-3">
            Back to List
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ShowRole;