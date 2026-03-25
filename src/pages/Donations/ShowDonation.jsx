import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;

function ShowDonation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [donation, setDonation] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/"); // Redirect to login if token missing
      return;
    }

    if (id) {
      axios.get(`${API_URL}/api/donations/show/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((response) => {
          setDonation(response.data.data);
          setLoading(false);
        })
        .catch((error) => {
          if (error.response?.status === 401) {
            localStorage.removeItem("token");
            navigate("/"); // Redirect if unauthorized
          } else {
            console.error("Error fetching donation:", error);
          }
          setLoading(false);
        });
    }
  }, [id, navigate]);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header">
          <h5 className="mb-0">Donation Details</h5>
        </div>

        <div className="card-body">
          <div className="mb-3"><strong>ID:</strong> {donation.id}</div>
          <div className="mb-3"><strong>First Name:</strong> {donation.first_name}</div>
          <div className="mb-3"><strong>Last Name:</strong> {donation.last_name}</div>
          <div className="mb-3"><strong>Email:</strong> {donation.email}</div>
          <div className="mb-3"><strong>Phone:</strong> {donation.phone}</div>
          <div className="mb-3"><strong>City:</strong> {donation.city}</div>
          <div className="mb-3"><strong>Address:</strong> {donation.address}</div>
          <div className="mb-3"><strong>Amount:</strong> {donation.amount}</div>
          <div className="mb-3"><strong>Date:</strong> {donation.date}</div>

          <div className="mb-3">
            <strong>Donation Category:</strong> {donation.donation_category || 'N/A'}
          </div>          
          <div className="mb-3">
            <strong>Bank Account:</strong> {donation.bank_account ? `${donation.bank_account.account_title} (****${donation.bank_account.account_number?.slice(-4) || ''})` : 'N/A'}
          </div>


          <Link to="/donations" className="btn btn-secondary mt-3">Back to List</Link>
        </div>
      </div>
    </div>
  );
}

export default ShowDonation;
