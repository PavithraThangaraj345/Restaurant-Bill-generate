// EditProfileModal.jsx
import React, { useState } from "react";
import axios from "axios";

const EditProfileModal = ({ user, onClose, onProfileUpdate }) => {
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
  });

  const [changingPassword, setChangingPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:5000/api/auth/update-profile",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Profile updated successfully");
      onProfileUpdate(res.data); // refresh parent state
      onClose();
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile");
    }
  };

  const handleSendOTP = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/send-otp", {
        email: formData.email,
      });
      setOtpSent(true);
      alert("OTP sent to your registered email.");
    } catch (err) {
      console.error("OTP Error:", err);
      alert("Failed to send OTP.");
    }
  };

  const handleChangePassword = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/change-password", {
        email: formData.email,
        otp,
        newPassword,
      });
      alert("Password changed successfully.");
      setChangingPassword(false);
      setOtpSent(false);
      setOtp("");
      setNewPassword("");
    } catch (err) {
      console.error("Password change error:", err);
      alert("Invalid OTP or error changing password.");
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>Edit Profile</h2>

        {/* Edit Fields */}
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          style={styles.input}
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          style={styles.input}
        />
        <button style={styles.saveBtn} onClick={handleUpdateProfile}>
          Save Changes
        </button>

        {/* Change Password Flow */}
        <hr />
        {!changingPassword ? (
          <button style={styles.changePwBtn} onClick={() => setChangingPassword(true)}>
            Change Password
          </button>
        ) : (
          <>
            {!otpSent ? (
              <>
                <p>Click below to send OTP to {formData.email}</p>
                <button style={styles.otpBtn} onClick={handleSendOTP}>
                  Send OTP
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  style={styles.input}
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={styles.input}
                />
                <button style={styles.saveBtn} onClick={handleChangePassword}>
                  Submit New Password
                </button>
              </>
            )}
          </>
        )}

        <button style={styles.cancelBtn} onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
  },
  modal: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    width: "400px",
    textAlign: "center",
    color: "#000"
  },
  input: {
    display: "block",
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },
  saveBtn: {
    backgroundColor: "#4caf50",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginBottom: "15px"
  },
  changePwBtn: {
    backgroundColor: "#2196f3",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginBottom: "15px"
  },
  otpBtn: {
    backgroundColor: "#ff9800",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },
  cancelBtn: {
    marginTop: "10px",
    backgroundColor: "#ccc",
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  }
};

export default EditProfileModal;
