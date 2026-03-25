import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_BASE_URL;

function CreateWireTransfer() {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [date, setDate] = useState('');

  const [bankAccounts, setBankAccounts] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/"); // Redirect to login if token missing
      return;
    }

    axios
      .get(`${API_URL}/api/wire-transfers/create`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        setBankAccounts(res.data.data.bankAccounts || []);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/"); // Redirect if unauthorized
        } else {
          setError('Failed to load bank accounts.');
        }
      });
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    axios
      .post(`${API_URL}/api/wire-transfers/store`,
        {
          name,
          amount,
          status,
          bank_account_id: bankAccount,
          date,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      .then(() => {
        navigate('/wire-transfers', { state: { message: 'Wire Transfer created successfully!' } });
      })
      .catch((err) => {
        if (err.response && err.response.status === 422) {
          const errors = err.response.data.errors;
          const messages = Object.values(errors).flat().join(' ');
          setError(messages);
        } else if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
        } else {
          setError('Something went wrong!');
        }
      });
  };

  return (
    <div className="mt-5">
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow">
        <div className="card-header">
          <h5>Create Wire Transfer</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Amount */}
            <div className="mb-3">
              <label className="form-label">Amount</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter amount"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {/* Date */}
            <div className="mb-3">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-control"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            {/* Bank Account */}
            <div className="mb-3">
              <label className="form-label">Bank Account</label>
              <select
                className="form-control"
                required
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
              >
                <option value="">Select Bank Account</option>
                {bankAccounts.length > 0 ? (
                  bankAccounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.account_title} - {account.bank_name} ({'****' + account.account_number.slice(-4)})
                    </option>
                  ))
                ) : (
                  <option disabled>No bank accounts available</option>
                )}
              </select>
            </div>

            {/* Status */}
            <div className="mb-3">
              <label className="form-label">Status</label>
              <select
                className="form-control"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="">Select Status</option>
                <option value="0">Completed</option>
                <option value="1">Pending</option>
                <option value="2">Failed</option>
              </select>
            </div>

            {/* Buttons */}
            <button type="submit" className="btn btn-danger">
              Create
            </button>
            <Link to="/wire-transfers" className="btn btn-secondary ms-2">
              Cancel
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateWireTransfer;
