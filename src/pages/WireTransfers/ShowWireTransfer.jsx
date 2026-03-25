import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;

function ShowWireTransfer() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [apiData, setApiData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        // If no token, redirect to login
        if (!token) {
            navigate("/");
            return;
        }

        if (id) {
            axios
                .get(`${API_URL}/api/wire-transfers/show/${id}`, {
                    headers: { Authorization: `Bearer ${token}` } // Add token to header
                })
                .then((response) => {
                    setApiData(response.data.data);
                    setLoading(false);
                })
                .catch((error) => {
                    if (error.response?.status === 401) {
                        localStorage.removeItem("token");
                        navigate("/"); // Redirect if unauthorized
                    } else {
                        console.error("Error fetching wire transfer:", error);
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
                    <h5 className="mb-0">Wire Transfer Details</h5>
                </div>

                <div className="card-body">
                    <div className="mb-3"><strong>ID:</strong> {apiData.id}</div>
                    <div className="mb-3"><strong>Name:</strong> {apiData.name}</div>
                    <div className="mb-3"><strong>Amount:</strong> {apiData.amount}</div>
                    <div className="mb-3"><strong>Remaining Amount:</strong> {apiData.remaining_amount}</div>

                    <div className="mb-3">
                        <strong>Status:</strong>{' '}
                        <span className={`badge ${apiData.status === 0 ? 'bg-success' : apiData.status === 1 ? 'bg-warning text-dark' : 'bg-danger'}`}>
                            {apiData.status === 0 ? 'Completed' : apiData.status === 1 ? 'Pending' : 'Failed'}
                        </span>
                    </div>

                    <div className="mb-3">
                        <strong>Bank Account:</strong>{' '}
                        {apiData.bank_account
                            ? `${apiData.bank_account.account_title} - ${apiData.bank_account.bank_name} (****${apiData.bank_account.account_number?.slice(-4) || ''})`
                            : 'N/A'}
                    </div>

                    <Link to="/wire-transfers" className="btn btn-secondary mt-3">Back to List</Link>
                </div>
            </div>
        </div>
    );
}

export default ShowWireTransfer;
