import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';

const API_URL = import.meta.env.VITE_API_BASE_URL;

function ShowExpense() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [expense, setExpense] = useState({});
  const [dateFormat, setDateFormat] = useState('Y-m-d'); // Laravel default format
  const [loading, setLoading] = useState(true);

  // Convert Laravel date format to date-fns format
  const laravelToDateFns = (formatStr) => {
    return formatStr
      .replace(/d/g, 'dd')
      .replace(/m/g, 'MM')
      .replace(/Y/g, 'yyyy')
      .replace(/H/g, 'HH')
      .replace(/i/g, 'mm')
      .replace(/s/g, 'ss')
      .replace(/A/g, 'aa'); // AM/PM
  };

  // Format date
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

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/'); // Redirect to login if token is missing
      return;
    }

    if (id) {
      axios
        .get(`${API_URL}/api/expenses/show/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setExpense(response.data.data);
          setDateFormat(response.data.dateFormat || 'Y-m-d');
          setLoading(false);
        })
        .catch((error) => {
          if (error.response?.status === 401) {
            localStorage.removeItem('token');
            navigate('/'); // Redirect if unauthorized
          } else {
            console.error('Error fetching expense:', error);
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
          <h5 className="mb-0">Expense Details</h5>
        </div>

        <div className="card-body">
          <div className="mb-3"><strong>ID:</strong> {expense.id}</div>
          <div className="mb-3"><strong>Amount:</strong> {expense.amount}</div>
          <div className="mb-3"><strong>Date:</strong> {formatDate(expense.date)}</div>
          <div className="mb-3"><strong>Details:</strong> {expense.details}</div>
          <div className="mb-3"><strong>Receipt:</strong> {expense.receipt}</div>

          <div className="mb-3"><strong>Expense Category:</strong> {expense.category ? expense.category.name : 'N/A'}</div>
          <div className="mb-3"><strong>Wire Transfer:</strong> {expense.wire_transfer ? expense.wire_transfer.name : 'N/A'}</div>
          <div className="mb-3"><strong>Bank Account:</strong> {expense.wire_transfer && expense.wire_transfer.bank_account ? expense.wire_transfer.bank_account.account_title : 'N/A'}</div>

          <Link to="/expenses" className="btn btn-secondary mt-3">Back to List</Link>
        </div>
      </div>
    </div>
  );
}

export default ShowExpense;
