// src/Components/Layout.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Sidebar from './Sidebar';     
import Navbar from './Navbar';        

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (location.state?.successMessage) {
      setMessage(location.state.successMessage);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="w-100 d-flex align-items-stretch justify-content-between">
      <Sidebar />

      <div className="w-100 d-flex flex-column">
        <Navbar />
        {message && (
          <div className="alert alert-success mx-4 mt-2" role="alert">
            {message}
          </div>
        )}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
