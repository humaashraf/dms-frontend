import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import avatarImg from './../assets/dms.png';

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // ✅ Check if token exists
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); // Redirect to login if no token
    }

    if (location.state?.successMessage) {
      setMessage(location.state.successMessage);
      navigate(location.pathname, { replace: true }); // remove state after showing message
    }
  }, [location, navigate]);

  return (
    <div className="d-flex flex-column w-100">
      {/* Show success message */}
      {/* {message && (
        <div className="alert alert-success mx-4 mt-4" role="alert">
          {message}
        </div>
      )} */}

      <div className="p-4">
        <h1>Welcome to Dashboard</h1>
        {/* <img src={avatarImg} alt="Avatar" width="80" height="80" /> */}
      </div>
    </div>
  );
}

export default Dashboard;
