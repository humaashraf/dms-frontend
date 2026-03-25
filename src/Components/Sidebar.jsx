import React from 'react';
import ProfilePic from './../assets/dms.png';
import { Link } from 'react-router-dom';
// import React, { useState, useEffect } from 'react';



function Sidebar() {
 
  return (
    <>

      {/* Large Screen Sidebar */}
      <aside
        className="sidebar bg-white d-none d-md-block p-5 w-26 custom-scroll bg-light"
        style={{ height: '100vh', overflowY: 'auto' }}
      >
        {renderSidebarContent()}
      </aside>

      {/*  Offcanvas Sidebar for Small Screens */}
      <div
        className="offcanvas offcanvas-start w-100"
        tabIndex="-1"
        id="sidebarOffcanvas"
        aria-labelledby="sidebarLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="sidebarLabel">AA Solutions</h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body custom-scroll p-4">
          {renderSidebarContent()}
        </div>
      </div>
    </>
  );
}

function renderSidebarContent() {
  return (
    <>
      <h1 className="text-uppercase fw-bold fs-4 d-none d-md-block">AA Solutions</h1>

      <div className="mt-4 p-3 shadow-sm rounded d-flex align-items-center bg-white gap-3">
        <img src={ProfilePic} alt="DMS pic" className="rounded-circle" width="60" height="60" />
        <div className="w-100">
          <h3 className="userName mb-1">DMS</h3>
          <p className="fs-6 lead mb-0">Empowering change through organized giving.</p>
        </div>
      </div>

      <ul className="pt-5 w-100 list-unstyled">
        <li className="sidebar-header mb-4">Donation Management System</li>
        <li className="sidebar-link active d-flex align-items-center gap-2">
          <Link to="/dashboard" className="d-flex align-items-center gap-2 text-decoration-none text-dark">
            <i className="bi bi-house"></i><span>Dashboard</span>
          </Link>
        </li>


        <li className="sidebar-link d-flex align-items-center gap-2">
        <Link to="/donations" className="d-flex align-items-center gap-2 text-decoration-none text-dark">
          <i className="bi bi-heart"></i><span>Donation</span>
        </Link>
        </li>

        <li className="sidebar-link d-flex align-items-center gap-2">
        <Link to="/wire-transfers" className="d-flex align-items-center gap-2 text-decoration-none text-dark">
          <i className="bi bi-wifi"></i><span>Wire Transfer</span>
        </Link>
        </li>

        <li className="sidebar-link d-flex align-items-center gap-2">
        <Link to="/expenses" className="d-flex align-items-center gap-2 text-decoration-none text-dark">
          <i className="bi bi-box-seam"></i><span>Expenses</span>
        </Link>
        </li>

        <li className="sidebar-link d-flex align-items-center gap-2">
          <i className="bi bi-bar-chart"></i><span>Reports</span>
        </li>

        <li className="sidebar-link d-flex align-items-center gap-2">
        <Link to="/users" className="d-flex align-items-center gap-2 text-decoration-none text-dark">
          <i className="bi bi-person"></i><span>User</span>
        </Link>
        </li>

        <li className="sidebar-link d-flex align-items-center gap-2">
          <Link to="/bank-accounts" className="d-flex align-items-center gap-2 text-decoration-none text-dark">
          <i className="bi bi-credit-card"></i><span>Bank Account</span>
          </Link>
        </li>

        <li className="sidebar-link d-flex align-items-center gap-2">
          <Link to="/donation-categories" className="d-flex align-items-center gap-2 text-decoration-none text-dark">
            <i className="bi bi-coin"></i><span>Donation Categories</span>
          </Link>
        </li>


        <li className="sidebar-link d-flex align-items-center gap-2">
          <Link to="/expense-categories" className="d-flex align-items-center gap-2 text-decoration-none text-dark">
            <i className="bi bi-box-seam"></i><span>Expense Categories</span>
          </Link>
        </li>

        <li className="sidebar-link d-flex align-items-center gap-2" data-bs-toggle="collapse" href="#settingsMenu">
          <i className="bi bi-gear"></i><span>Settings</span><i className="bi bi-arrow-right ms-auto"></i>
        </li>
        <li className="sidebar-item collapse-list">
          <ul className="sidebar-dropdown list-unstyled collapse" id="settingsMenu">
            <li className="sidebar-item"><Link to="/general-settings/1" className="sidebar-link p-2 m-0">General Settings</Link></li>
            <li className="sidebar-item"><Link to="/email-settings/1" className="sidebar-link p-2 m-0">Email Settings</Link></li>
            <li className="sidebar-item"><Link to="/currencies" className="sidebar-link p-2 m-0">Manage Currency</Link></li>
            <li className="sidebar-item"><Link to="/payment-methods" className="sidebar-link p-2 m-0">Payment Methods</Link></li>
          </ul>
        </li>

        <li className="sidebar-link d-flex align-items-center gap-2" data-bs-toggle="collapse" href="#roleandpermissions">
          <i className="bi bi-truck"></i><span>Roles & Permissions</span><i className="bi bi-arrow-right ms-auto"></i>
        </li>
        <li className="sidebar-item collapse-list">
          <ul className="sidebar-dropdown list-unstyled collapse" id="roleandpermissions">
            <li className="sidebar-item"><Link to="/roles" className="sidebar-link p-2 m-0">Roles</Link></li>
            <li className="sidebar-item"><Link to="/permissions" className="sidebar-link p-2 m-0">Permissions</Link></li>
          </ul>
        </li>


      </ul>
    </>
  );
}


export default Sidebar;
