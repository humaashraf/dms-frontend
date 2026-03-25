import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE_URL;

function EditGeneralSetting() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    app_name: "",
    timezone: "",
    datetime_format: "",
    currency_id: ""
  });

  const [currencies, setCurrencies] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const token = localStorage.getItem("token");

  // Axios instance with token
  const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  // Fetch General Settings
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    axiosInstance
      .get(`/api/general-settings/${id}`)
      .then((res) => {
        const setting = res.data.setting || {};
        setFormData({
          app_name: setting.app_name || "",
          timezone: setting.timezone || "",
          datetime_format: setting.datetime_format || "",
          currency_id: setting.currency_id || "",
        });
        setCurrencies(res.data.currencies || []);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
        } else {
          setErrorMsg("Failed to load data");
        }
      });
  }, [id, navigate]);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Update General Settings
  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    axiosInstance
      .put(`/api/general-settings/${id}`, formData)
      .then(() => {
        setSuccessMsg("Settings updated successfully!");
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
          setErrorMsg("Error updating settings");
        }
      });
  };

  return (
    <div className="container mt-5">
      {successMsg && (
        <div className="alert alert-success">{successMsg}</div>
      )}
      {errorMsg && (
        <div className="alert alert-danger">{errorMsg}</div>
      )}

      <div className="card shadow">
        <div className="card-header">
          <h5>Edit General Settings</h5>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* App Name */}
            <div className="mb-3">
              <label className="form-label">App Name</label>
              <input
                type="text"
                name="app_name"
                className="form-control"
                placeholder="App Name"
                value={formData.app_name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Timezone */}
            <div className="mb-3">
              <label className="form-label">Timezone</label>
              <select
                name="timezone"
                className="form-control"
                value={formData.timezone}
                onChange={handleChange}
                required
              >
                <option value="">Select TimeZone</option>
                <option value="UTC">(UTC+00:00) UTC</option>
                <option value="Asia/Karachi">(UTC+05:00) Islamabad, Karachi</option>
                <option value="Asia/Dubai">(UTC+04:00) Abu Dhabi, Dubai</option>
                <option value="Asia/Kolkata">(UTC+05:30) Mumbai, Kolkata</option>
                <option value="Asia/Riyadh">(UTC+03:00) Riyadh</option>
                <option value="Europe/London">(UTC+00:00) London</option>
                <option value="Europe/Berlin">(UTC+01:00) Berlin</option>
                <option value="America/New_York">(UTC-05:00) New York</option>
                <option value="America/Chicago">(UTC-06:00) Chicago</option>
                <option value="America/Denver">(UTC-07:00) Denver</option>
                <option value="America/Los_Angeles">(UTC-08:00) Los Angeles</option>
                <option value="Pacific/Honolulu">(UTC-10:00) Honolulu</option>
              </select>
            </div>

            {/* Currency */}
            <div className="mb-3">
              <label className="form-label">Currency</label>
              <select
                name="currency_id"
                className="form-control"
                value={formData.currency_id}
                onChange={handleChange}
              >
                <option value="">Select Currency</option>
                {currencies.map((currency) => (
                  <option key={currency.id} value={currency.id}>
                    {currency.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date & Time Format */}
            <div className="mb-3">
              <label className="form-label">Date & Time Format</label>
              <select
                name="datetime_format"
                className="form-control"
                value={formData.datetime_format}
                onChange={handleChange}
                required
              >
                <option value="">Select Time Format</option>
                <optgroup label="12hr format">
                  <option value="d/m/Y h:i A">24/06/2025 12:06 PM</option>
                  <option value="d-m-Y h:i A">24-06-2025 12:06 PM</option>
                  <option value="m-d-Y h:i A">06-24-2025 12:06 PM</option>
                  <option value="Y/m/d h:i A">2025/06/24 12:06 PM</option>
                  <option value="Y-m-d h:i A">2025-06-24 12:06 PM</option>
                </optgroup>
                <optgroup label="24hr format">
                  <option value="d/m/Y H:i">24/06/2025 12:06</option>
                  <option value="d-m-Y H:i">24-06-2025 12:06</option>
                  <option value="m-d-Y H:i">06-24-2025 12:06</option>
                  <option value="Y/m/d H:i">2025/06/24 12:06</option>
                  <option value="Y-m-d H:i">2025-06-24 12:06</option>
                </optgroup>
              </select>
            </div>

            <button type="submit" className="btn btn-color">Update</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditGeneralSetting;
