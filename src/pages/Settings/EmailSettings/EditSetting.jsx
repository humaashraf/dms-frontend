import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE_URL;

function EditSetting() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    smtp_host: "",
    username: "",
    password: "",
    smtp_secure: "",
    port: "",
    from_email: ""
  });

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Axios Interceptor for Authorization
  const token = localStorage.getItem("token");
  const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: { Authorization: token ? `Bearer ${token}` : "" }
  });

  // Fetch Email Settings
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    axiosInstance
      .get(`/api/email-settings/${id}`)
      .then((res) => {
        const data = res.data.data || res.data;
        setFormData({
          smtp_host: data.smtp_host || "",
          username: data.username || "",
          password: data.password || "",
          smtp_secure: data.smtp_secure || "",
          port: data.port || "",
          from_email: data.from_email || ""
        });
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
        } else {
          setErrorMsg("Failed to load data.");
        }
      });
  }, [id, navigate]);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!token) {
      navigate("/");
      return;
    }

    axiosInstance
      .put(`/api/email-settings/${id}`, formData)
      .then(() => {
        setSuccessMsg("Email settings updated successfully!");
      })
      .catch((error) => {
        if (error.response && error.response.status === 422) {
          const errors = error.response.data.errors;
          const messages = Object.values(errors).flat().join(" ");
          setErrorMsg(messages);
        } else if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
        } else {
          setErrorMsg("Something went wrong while updating.");
        }
      });
  };

  return (
    <div className="mt-5">
      {successMsg && (
        <div className="alert alert-success mt-3" role="alert">
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="alert alert-danger mt-3" role="alert">
          {errorMsg}
        </div>
      )}

      <div className="card row shadow mx-1 mx-sm-0">
        <div className="card-header">
          <h5>Edit Email Settings</h5>
        </div>
        <div className="col-md-12">
          <form onSubmit={handleSubmit}>
            {[
              { label: "SMTP Host", type: "text", name: "smtp_host" },
              { label: "Username", type: "text", name: "username" },
              { label: "Password", type: "password", name: "password" },
              { label: "SMTP Secure", type: "text", name: "smtp_secure" },
              { label: "Port", type: "text", name: "port" },
              { label: "From Email", type: "email", name: "from_email" }
            ].map((field) => (
              <div className="form-group mt-3" key={field.name}>
                <label>{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  placeholder={field.label}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
            ))}

            <button type="submit" className="btn btn-color mt-4 mb-3">
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditSetting;
