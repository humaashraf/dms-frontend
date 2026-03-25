import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_BASE_URL;

function EditExpense() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [amount, setAmount] = useState('');
  const [wireTransfer, setWireTransfer] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('');
  const [date, setDate] = useState('');
  const [details, setDetails] = useState('');
  const [receipt, setReceipt] = useState('');

  const [wireTransfers, setWireTransfers] = useState([]);
  const [categories, setCategories] = useState([]);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch expense and dropdown data
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/');
      return;
    }

    axios
      .get(`${API_URL}/api/expenses/edit/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const expense = res.data.expense;

        setAmount(expense.amount);
        const formattedDate = expense.date ? expense.date.split('T')[0] : '';
        setWireTransfer(expense.wire_transfer_id || '');
        setExpenseCategory(expense.expense_category_id);
        setDate(formattedDate);
        setDetails(expense.details);
        setReceipt(expense.receipt);

        // Filter wire transfers to only show those with remaining_amount > 0 OR current selected one
        const transfers = res.data.wire_transfers || [];
        const filteredTransfers = transfers.filter(
          (transfer) => transfer.remaining_amount > 0 || transfer.id === expense.wire_transfer_id
        );
        setWireTransfers(filteredTransfers);

        setCategories(res.data.categories || []);
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/');
        } else {
          setError('Failed to load expense data.');
        }
      });
  }, [id, navigate]);

  // Update Expense
  const handleSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/');
      return;
    }

    axios
      .put(
        `${API_URL}/api/expenses/update/${id}`,
        {
          amount: amount,
          wire_transfer_id: wireTransfer || null,
          expense_category_id: expenseCategory,
          date: date,
          details: details,
          receipt: receipt,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        navigate('/expenses', {
          state: { message: 'Expense updated successfully!' },
        });
      })
      .catch((err) => {
        if (err.response && err.response.status === 422) {
          const errors = err.response.data.errors;
          const messages = Object.values(errors).flat().join(' ');
          setError(messages);
        } else if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/');
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
          <h5>Edit Expense</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Amount */}
            <div className="mb-3">
              <label className="form-label">Amount</label>
              <input
                type="text"
                className="form-control"
                placeholder="Amount"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {/* Wire Transfer */}
            <div className="mb-3">
              <label className="form-label">Wire Transfer</label>
              <select
                className="form-control"
                value={wireTransfer}
                onChange={(e) => setWireTransfer(e.target.value)}
              >
                <option value="">Select Wire Transfer</option>
                {wireTransfers.map((transfer) => (
                  <option key={transfer.id} value={transfer.id}>
                    Name: {transfer.name}
                    {transfer.bankAccount &&
                      ` | Bank: ${transfer.bankAccount.account_title}`}
                    | Remaining: PKR{' '}
                    {Number(transfer.remaining_amount).toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            {/* Expense Category */}
            <div className="mb-3">
              <label className="form-label">Expense Category</label>
              <select
                className="form-control"
                required
                value={expenseCategory}
                onChange={(e) => setExpenseCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
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

            {/* Details */}
            <div className="mb-3">
              <label className="form-label">Details</label>
              <textarea
                className="form-control"
                rows="4"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              ></textarea>
            </div>

            {/* Receipt */}
            <div className="mb-3">
              <label className="form-label">Receipt</label>
              <input
                type="text"
                className="form-control"
                placeholder="Receipt"
                required
                value={receipt}
                onChange={(e) => setReceipt(e.target.value)}
              />
            </div>

            {/* Buttons */}
            <button type="submit" className="btn btn-color">
              Update
            </button>
            <Link to="/expenses" className="btn btn-secondary ms-2">
              Cancel
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditExpense;
