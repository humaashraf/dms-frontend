import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE_URL;

function EditDonation() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [paymentMethodId, setPaymentMethodId] = useState("");
  const [donationCategoryId, setDonationCategoryId] = useState("");
  const [bankAccountId, setBankAccountId] = useState("");

  // Dropdown data
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const donationRes = await axios.get(`${API_URL}/api/donations/edit/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = donationRes.data.data;

        if (!data || !data.donation) {
          throw new Error("Donation data not found");
        }

        const donation = data.donation;

        // Format date for input type="date"
        const formattedDate = donation.date ? donation.date.split("T")[0] : "";

        // Set form fields
        setFirstName(donation.first_name || "");
        setLastName(donation.last_name || "");
        setEmail(donation.email || "");
        setPhone(donation.phone || "");
        setCity(donation.city || "");
        setAddress(donation.address || "");
        setAmount(donation.amount || "");
        setDate(formattedDate);
        setPaymentMethodId(donation.payment_method_id?.toString() || "");
        setDonationCategoryId(donation.donation_category_id?.toString() || "");
        setBankAccountId(donation.bank_account_id?.toString() || "");

        // Set dropdown lists safely
        setPaymentMethods(Array.isArray(data.paymentMethods) ? data.paymentMethods : []);
        setCategories(Array.isArray(data.categories) ? data.categories : []);
        setBankAccounts(Array.isArray(data.bankAccounts) ? data.bankAccounts : []);

        setLoading(false);
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
        } else {
          console.error("Error fetching data:", error);
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleUpdate = (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    axios
      .put(
        `${API_URL}/api/donations/update/${id}`,
        {
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          city,
          address,
          amount,
          date,
          payment_method_id: paymentMethodId,
          donation_category_id: donationCategoryId,
          bank_account_id: bankAccountId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        navigate("/donations", {
          state: { message: "Donation updated successfully!" },
        });
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
        } else {
          console.error("Update failed:", error);
        }
      });
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="mt-5">
      <div className="card row shadow mx-1 mx-sm-0">
        <div className="card-header">
          <h5>Edit Donation</h5>
        </div>
        <div className="col-md-12">
          <form onSubmit={handleUpdate}>
            <div className="form-group mt-3">
              <label>First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                className="form-control"
                required
              />
            </div>

            <div className="form-group mt-3">
              <label>Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                className="form-control"
                required
              />
            </div>

            <div className="form-group mt-3">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="form-control"
                required
              />
            </div>

            <div className="form-group mt-3">
              <label>Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
                className="form-control"
                required
              />
            </div>

            <div className="form-group mt-3">
              <label>City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="form-control"
                required
              />
            </div>

            <div className="form-group mt-3">
              <label>Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address"
                className="form-control"
                required
              />
            </div>

            <div className="form-group mt-3">
              <label>Amount</label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                className="form-control"
                required
              />
            </div>

            <div className="form-group mt-3">
              <label>Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div className="form-group mt-3">
              <label>Payment Method</label>
              <select
                className="form-control"
                value={paymentMethodId}
                onChange={(e) => setPaymentMethodId(e.target.value)}
                required
              >
                <option value="">Select Payment Method</option>
                {paymentMethods.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group mt-3">
              <label>Donation Category</label>
              <select
                className="form-control"
                value={donationCategoryId}
                onChange={(e) => setDonationCategoryId(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group mt-3">
              <label>Bank Account</label>
              <select
                className="form-control"
                value={bankAccountId}
                onChange={(e) => setBankAccountId(e.target.value)}
              >
                <option value="">Select Bank Account</option>
                {bankAccounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.account_title} ({account.account_number.slice(-4)})
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-danger mb-3 mt-4">
              Update
            </button>
            <Link to="/donations" className="btn btn-secondary mb-3 mt-4 ms-2">
              Cancel
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditDonation;
