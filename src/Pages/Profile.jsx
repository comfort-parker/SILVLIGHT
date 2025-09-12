import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";
import { getProfile, updateProfile } from "../Api"; 
import "./Auth.css";

const Profile = () => {
  const [user, setUser] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  // Fetch user profile on page load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data } = await getProfile();
        setUser({ firstName: data.firstName, lastName: data.lastName, email: data.email, password: "", confirmPassword: "" });
      } catch (err) {
        showToast(err.response?.data?.message || "Failed to fetch profile", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Optional: check password match
    if (user.password && user.password !== user.confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    try {
      setLoading(true);
      const updateData = { firstName: user.firstName, lastName: user.lastName };
      if (user.password) updateData.password = user.password;

      await updateProfile(updateData); 
      showToast("Profile updated successfully!");
      setUser({ ...user, password: "", confirmPassword: "" });
    } catch (err) {
      showToast(err.response?.data?.message || "Profile update failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar solid />
      <div className="auth-wrapper">
        <div className="auth-box">
          <div className="auth-form-container">
            {toast.message && <div className={`toast ${toast.type}`}>{toast.message}</div>}
            <form onSubmit={handleUpdate} className="auth-form">
              <h2>My Profile</h2>
              <input
                name="firstName"
                type="text"
                placeholder="First Name"
                value={user.firstName}
                onChange={handleChange}
                required
              />
              <input
                name="lastName"
                type="text"
                placeholder="Last Name"
                value={user.lastName}
                onChange={handleChange}
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={user.email}
                disabled
              />
              <input
                name="password"
                type="password"
                placeholder="New Password"
                value={user.password}
                onChange={handleChange}
              />
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={user.confirmPassword}
                onChange={handleChange}
              />
              <button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
