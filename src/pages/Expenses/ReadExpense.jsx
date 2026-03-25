import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";

const API_URL = import.meta.env.VITE_API_BASE_URL;

function ReadExpense() {
  const location = useLocation();
  const navigate = useNavigate();

  const [apiData, setApiData] = useState([]);
  const [message, setMessage] = useState("");
  const [dateFormat, setDateFormat] = useState("Y-m-d"); // Default Laravel format

  // Fetch data with token
  function getData() {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // Redirect to login if token is missing
      return;
    }

    axios
      .get(`${API_URL}/api/expenses`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setApiData(response.data.data || []);
        setDateFormat(response.data.dateFormat || "Y-m-d");
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/"); // Redirect if unauthorized
        } else {
          setMessage("Failed to fetch expenses.");
        }
      });
  }

  // Convert Laravel format to date-fns format
  const laravelToDateFns = (format) => {
    return format
      .replace(/d/g, "dd")
      .replace(/m/g, "MM")
      .replace(/Y/g, "yyyy")
      .replace(/H/g, "HH")
      .replace(/i/g, "mm")
      .replace(/s/g, "ss")
      .replace(/A/g, "aa"); // AM/PM
  };

  // Format date based on Laravel format
  function formatDate(dateString) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);

    try {
      const jsFormat = laravelToDateFns(dateFormat);
      return format(date, jsFormat);
    } catch (error) {
      console.error("Date format error:", error);
      return date.toLocaleDateString();
    }
  }

  // Delete Expense with token
  function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      axios
        .delete(`${API_URL}/api/expenses/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setMessage(res.data.message || "Expense deleted successfully!");
          getData();
        })
        .catch((error) => {
          setMessage(error.response?.data?.message || "Deletion failed.");
        });
    }
  }

  function setDataToStorage(expense) {
    localStorage.setItem("id", expense.id);
    localStorage.setItem("wire_transfer_id", expense.wire_transfer_id);
    localStorage.setItem("expense_category_id", expense.expense_category_id);
    localStorage.setItem("amount", expense.amount);
    localStorage.setItem("date", expense.date);
    localStorage.setItem("details", expense.details);
    localStorage.setItem("receipt", expense.receipt);
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
            <h5 className="mx-1 mt-2">Expense List</h5>
            <Link to="/expenses/create" className="btn btn-color ms-auto m-2">
              Add New Expense
            </Link>
          </div>

          <div className="card-body">
            <div className="table-responsive">
              <table className="table align-middle text-center mb-0">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Wire Transfer</th>
                    <th>Bank</th>
                    <th>Expense Category</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Details</th>
                    <th>Receipt</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {apiData.length > 0 ? (
                    apiData.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.wire_transfer?.name || "N/A"}</td>
                        <td>
                          {item.wire_transfer ? (
                            <>
                              Name: {item.wire_transfer.name}
                              {item.wire_transfer.bank_account && (
                                <>
                                  <br />
                                  <small className="text-muted">
                                    Bank: {item.wire_transfer.bank_account.account_title}
                                  </small>
                                </>
                              )}
                              <br />
                              <small className="text-muted">
                                Remaining Amount:{" "}
                                {parseFloat(item.wire_transfer.remaining_amount).toLocaleString()}
                              </small>
                            </>
                          ) : (
                            "N/A"
                          )}
                        </td>
                        <td>{item.category?.name || "N/A"}</td>
                        <td>{item.amount}</td>
                        <td>{formatDate(item.date)}</td>
                        <td>{item.details}</td>
                        <td>{item.receipt}</td>
                        <td>
                          <Link to={`/expenses/show/${item.id}`}>
                            <button className="btn btn-sm text-primary me-2">
                              <i className="bi bi-eye"></i>
                            </button>
                          </Link>

                          <Link to={`/expenses/edit/${item.id}`}>
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
                      <td colSpan="9" className="text-muted">
                        No expenses found
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

export default ReadExpense;
