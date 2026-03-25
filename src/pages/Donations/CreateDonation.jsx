import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_BASE_URL;

function CreateDonation() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [donationCategory, setDonationCategory] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [date, setDate] = useState('');

  const [categories, setCategories] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // Redirect if not logged in
      return;
    }

    axios.get(`${API_URL}/api/donations/create`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        setCategories(res.data.data.categories || []);
        setBankAccounts(res.data.data.bankAccounts || []);
        setPaymentMethods(res.data.data.paymentMethods || []);
      })
      .catch(err => {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
        } else {
          setError('Failed to load dropdown data.');
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

    axios.post(`${API_URL}/api/donations`, {
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: phone,
      city: city,
      address: address,
      donation_category_id: donationCategory,
      bank_account_id: bankAccount,
      amount: amount,
      payment_method_id: paymentMethod,
      date: date
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        navigate('/donations', { state: { message: "Donation created successfully!" } });
      })
      .catch(err => {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
        } else if (err.response?.status === 422) {
          const errors = err.response.data.errors;
          const messages = Object.values(errors).flat().join(' ');
          setError(messages);
        } else {
          setError("Something went wrong!");
        }
      });
  };

  return (
    <div className="mt-5">
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow">
        <div className="card-header">
          <h5>Create Donation</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* First Name */}
            <div className="mb-3">
              <label className="form-label">First Name</label>
              <input type="text" className="form-control" placeholder="First Name" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>

            {/* Last Name */}
            <div className="mb-3">
              <label className="form-label">Last Name</label>
              <input type="text" className="form-control" placeholder="Last Name" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            {/* Phone */}
            <div className="mb-3">
              <label className="form-label">Phone</label>
              <input type="text" className="form-control" placeholder="Phone" required value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>

            {/* City */}
            <div className="mb-3">
              <label className="form-label">City</label>
              <input type="text" className="form-control" placeholder="City" required value={city} onChange={(e) => setCity(e.target.value)} />
            </div>

            {/* Address */}
            <div className="mb-3">
              <label className="form-label">Address</label>
              <input type="text" className="form-control" placeholder="Address" required value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>

            {/* Amount */}
            <div className="mb-3">
              <label className="form-label">Amount</label>
              <input type="text" className="form-control" placeholder="Amount" required value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>

            {/* Date */}
            <div className="mb-3">
              <label className="form-label">Date</label>
              <input type="date" className="form-control" required value={date} onChange={(e) => setDate(e.target.value)} />
            </div>

            {/* Payment Method */}
            <div className="mb-3">
              <label className="form-label">Payment Method</label>
              <select className="form-control" required value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="">Select Payment Method</option>
                {paymentMethods.map(method => (
                  <option key={method.id} value={method.id}>{method.name}</option>
                ))}
              </select>
            </div>

            {/* Donation Category */}
            <div className="mb-3">
              <label className="form-label">Donation Category</label>
              <select className="form-control" required value={donationCategory} onChange={(e) => setDonationCategory(e.target.value)}>
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>

            {/* Bank Account */}
            <div className="mb-3">
              <label className="form-label">Bank Account</label>
              <select className="form-control" required value={bankAccount} onChange={(e) => setBankAccount(e.target.value)}>
                <option value="">Select Bank Account</option>
                {bankAccounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.account_title} ({'****' + account.account_number.slice(-4)})
                  </option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <button type="submit" className="btn btn-danger">Create</button>
            <Link to="/donations" className="btn btn-secondary ms-2">Cancel</Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateDonation;
