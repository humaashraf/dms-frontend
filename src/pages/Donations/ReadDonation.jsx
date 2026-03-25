import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const API_URL = import.meta.env.VITE_API_BASE_URL;

function ReadDonations() {
  const location = useLocation();
  const navigate = useNavigate();

  const [apiData, setApiData] = useState([]);
  const [dateFormat, setDateFormat] = useState(''); 
  const [message, setMessage] = useState('');

  const laravelToDateFns = (format) => {
    return format
      .replace(/d/g, 'dd')
      .replace(/m/g, 'MM')
      .replace(/Y/g, 'yyyy')
      .replace(/H/g, 'HH')
      .replace(/i/g, 'mm')
      .replace(/s/g, 'ss')
      .replace(/A/g, 'aa');
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

  // Fetch donations from API with token
  function getData() {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    axios.get(`${API_URL}/api/donations/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setApiData(response.data.data.donations || []);
        setDateFormat(response.data.data.dateFormat || 'd-m-Y');
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          alert('Session expired. Please login again.');
          localStorage.removeItem('token');
          navigate('/');
        } else {
          setMessage("Failed to fetch donations.");
        }
      });
  }

  // Delete donation with token
  function handleDelete(id) {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not logged in. Redirecting to login page.');
      navigate('/');
      return;
    }

    if (window.confirm("Are you sure you want to delete this Donation?")) {
      axios.delete(`${API_URL}/api/donations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          setMessage(res.data.message || 'Donation deleted successfully!');
          getData();
        })
        .catch((error) => {
          if (error.response?.status === 401) {
            alert('Session expired. Please login again.');
            localStorage.removeItem('token');
            navigate('/');
          } else {
            setMessage(error.response?.data?.message || 'Deletion failed.');
          }
        });
    }
  }

  function setDataToStorage(donation) {
    localStorage.setItem('id', donation.id);
    localStorage.setItem('first_name', donation.first_name);
    localStorage.setItem('last_name', donation.last_name);
    localStorage.setItem('email', donation.email);
    localStorage.setItem('phone', donation.phone);
    localStorage.setItem('city', donation.city);
    localStorage.setItem('address', donation.address);
    localStorage.setItem('donation_category_id', donation.donation_category_id);
    localStorage.setItem('bank_account_id', donation.bank_account_id);
    localStorage.setItem('amount', donation.amount);
    localStorage.setItem('payment_method_id', donation.payment_method_id);
    localStorage.setItem('date', donation.date);
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
            <h5 className="mx-1 mt-2">Donations</h5>
            <Link to='/donations/create' className="btn btn-danger ms-auto m-2">
              Add New Donation
            </Link>
          </div>

          <div className="card-body">
            <div className="table-responsive">
              <table className="table align-middle text-center mb-0">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Email</th>
                    <th>City</th>
                    <th>Amount</th>
                    <th>Payment Method</th>
                    <th>Donation Category</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {apiData.length > 0 ? (
                    apiData.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.first_name}</td>
                        <td>{item.email}</td>
                        <td>{item.city}</td>
                        <td>{item.amount}</td>
                        <td>{item.payment_method?.name || 'N/A'}</td>
                        <td>{item.category?.name || 'N/A'}</td>
                        <td>
                          <Link to={`/donations/show/${item.id}`}>
                            <button className="btn btn-sm text-primary me-2">
                              <i className="bi bi-eye"></i>
                            </button>
                          </Link>

                          <Link to={`/donations/edit/${item.id}`}>
                            <button
                              className="btn btn-sm text-success me-2"
                              onClick={() => setDataToStorage(item)}
                            >
                              <i className="bi bi-pencil-square"></i>
                            </button>
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
                      <td colSpan="13" className="text-muted">No donations found</td>
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

export default ReadDonations;
