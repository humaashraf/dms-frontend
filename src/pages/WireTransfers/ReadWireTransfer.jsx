import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const API_URL = import.meta.env.VITE_API_BASE_URL;

function ReadWireTransfer() {
    const location = useLocation();
    const navigate = useNavigate();

    const [apiData, setApiData] = useState([]);
    const [dateFormat, setDateFormat] = useState('');
    const [message, setMessage] = useState('');

    const token = localStorage.getItem("token");

    // Redirect if no token
    useEffect(() => {
        if (!token) {
            navigate("/"); // Go to login page
            return;
        }
    }, [navigate, token]);

    const laravelToDateFns = (format) => {
        return format
            .replace(/d/g, 'dd')
            .replace(/m/g, 'MM')
            .replace(/Y/g, 'yyyy')
            .replace(/H/g, 'HH')
            .replace(/i/g, 'mm')
            .replace(/s/g, 'ss')
            .replace(/A/g, 'aa'); // Fix AM/PM
    };

    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);

        try {
            const jsFormat = laravelToDateFns(dateFormat);
            return format(date, jsFormat);
        } catch (error) {
            console.error('Date format error:', error);
            return date.toLocaleDateString();
        }
    }

    function getData() {
        axios
            .get(`${API_URL}/api/wire-transfers`, {
                headers: { Authorization: `Bearer ${token}` } // Add token
            })
            .then((response) => {
                setApiData(response.data.data.transfers || []);
                setDateFormat(response.data.data.dateFormat || 'd-m-Y'); // Keep Laravel format info
            })
            .catch((error) => {
                if (error.response?.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/"); // Redirect if unauthorized
                } else {
                    setMessage('Failed to fetch wire transfers.');
                }
            });
    }

    function handleDelete(id) {
        if (window.confirm('Are you sure you want to delete this Wire Transfer?')) {
            axios
                .delete(`${API_URL}/api/wire-transfers/${id}`, {
                    headers: { Authorization: `Bearer ${token}` } // Add token
                })
                .then((res) => {
                    setMessage(res.data.message || 'Wire Transfer deleted successfully!');
                    getData();
                })
                .catch((error) => {
                    setMessage(error.response?.data?.message || 'Deletion failed.');
                });
        }
    }

    useEffect(() => {
        getData();
        if (location.state && location.state.message) {
            setMessage(location.state.message);
            navigate(location.pathname, { replace: true });
        }
    }, []);

    return (
        <>
            {message && (
                <div className="alert alert-success mt-3" role="alert">
                    {message}
                </div>
            )}

            <div className="mt-4">
                <div className="card shadow rounded">
                    <div className="card-header d-flex">
                        <h5 className="mx-1 mt-2">Wire Transfers</h5>
                        <Link to="/wire-transfers/create" className="btn btn-danger ms-auto m-2">
                            Add Wire Transfer
                        </Link>
                    </div>

                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table align-middle text-center mb-0">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Amount</th>
                                        <th>Remaining Amount</th>
                                        <th>Bank</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {apiData.length > 0 ? (
                                        apiData.map((item) => (
                                            <tr key={item.id}>
                                                <td>{item.id}</td>
                                                <td>{item.name}</td>
                                                <td>{item.amount}</td>
                                                <td>{item.remaining_amount ?? 'N/A'}</td>

                                                <td>
                                                    {item.bank_account
                                                        ? `${item.bank_account.account_title} - ${item.bank_account.bank_name} - ${'*'.repeat(item.bank_account.account_number.length - 4)}${item.bank_account.account_number.slice(-4)}`
                                                        : 'N/A'}
                                                </td>

                                                <td>
                                                    <span
                                                        className={`badge ${item.status === 0
                                                                ? 'bg-success'
                                                                : item.status === 1
                                                                    ? 'bg-warning text-dark'
                                                                    : 'bg-danger'
                                                            }`}
                                                    >
                                                        {item.status === 0
                                                            ? 'Completed'
                                                            : item.status === 1
                                                                ? 'Pending'
                                                                : 'Failed'}
                                                    </span>
                                                </td>
                                                <td>{formatDate(item.date)}</td>
                                                <td>
                                                    <Link to={`/wire-transfers/show/${item.id}`} className="btn btn-sm text-primary me-2">
                                                        <i className="bi bi-eye"></i>
                                                    </Link>

                                                    <Link to={`/wire-transfers/edit/${item.id}`} className="btn btn-sm text-success me-2">
                                                        <i className="bi bi-pencil-square"></i>
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
                                            <td colSpan="8" className="text-muted">
                                                No wire transfers found
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

export default ReadWireTransfer;
