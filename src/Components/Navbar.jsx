import React from 'react';
import avtarImg from './../assets/dms.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    try {
      await axios.post(`${API_URL}/api/logout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove token from localStorage
      localStorage.removeItem('token');

      // Redirect to login page
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      alert('Logout failed, please try again.');
    }
  };

  return (
    <nav className="nav navbar-main bg-white shadow grey m-4 rounded d-flex justify-content-between align-items-center p-2 navbar navbar-expand">
      <button
        className="border-0 d-md-none mt-0 ms-2"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#sidebarOffcanvas"
        style={{ backgroundColor: 'transparent', color: '#d1001f', fontSize: '24px' }}
      >
        <i className="bi bi-list btn"></i>
      </button>

      <form action="" inline="true" className="ps-w w-30 ms-auto">
        <div className="input-group-navbar input-group">
          <input type="text" placeholder="Search" className="form-control rounded shadow-sm grey" />
          <button className="btn ms-2 p-2 rounded shadow-sm" type="submit">
            <i className="bi bi-search"></i>
          </button>
        </div>
      </form>

      <span className="nav-icon cursor-pointer" data-bs-toggle="dropdown">
        <a href="#" className="text-secondary text-decoration-none nav-link dropdown-toggle d-flex align-items-center">
          <img src={avtarImg} alt="" className="avtar rounded-circle me-1 mt-2 mb-2" />
          <span className="ms-1 hide-elem">DMS</span>
        </a>
      </span>

      <div className="dropdown dropdown-menu dropdown-menu3 dropdown-menu-end">
        <a href="#" className="dropdown-item">Profile</a>
        <a href="#" className="dropdown-item">Analytics</a>
        <button onClick={handleLogout} className="dropdown-item text-danger" style={{ border: 'none', background: 'transparent' }}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
