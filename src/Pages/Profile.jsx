import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editedUser, setEditedUser] = useState({
    username: "",
    email: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/signin");
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setEditedUser({
          username: res.data.username,
          email: res.data.email,
        });
        setPreviewAvatar(res.data.avatar || "https://via.placeholder.com/100");
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to fetch profile data. Please try again.");
        if (err.response?.status === 401 || err.response?.status === 403) {
          alert("Session expired or unauthorized. Please login again.");
          localStorage.removeItem("token");
          localStorage.removeItem("userRole");
          navigate("/signin");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/signin");
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAvatar(reader.result);
      };
      reader.readAsDataURL(file);
      setAvatarFile(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("username", editedUser.username);
    formData.append("email", editedUser.email);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    try {
      const res = await axios.put("http://localhost:5000/api/auth/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setUser(res.data.user);
      setPreviewAvatar(res.data.user.avatar || "https://via.placeholder.com/100");
      setShowModal(false);
      setAvatarFile(null);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.msg || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p style={{ color: "#fff", textAlign: "center" }}>Loading...</p>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.avatarContainer}>
        <img
          src={`http://localhost:5000${user.avatar}`}
          alt="avatar"
          style={styles.avatar} // Corrected: apply the avatar style here
        />
      </div>
      <h2 style={styles.title}>Welcome, {user.username}</h2>
      <p style={styles.quote}>"Live life with extra spice!"</p>
      <p style={styles.text}>
        <strong>Email:</strong> {user.email}
      </p>
      {error && <p style={styles.errorText}>{error}</p>}
      <div style={styles.btnGroup}>
        <button style={styles.button} onClick={() => setShowModal(true)}>
          Edit Profile
        </button>
        <button
          style={{ ...styles.button, backgroundColor: "#e63946" }}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Edit Profile</h3>

            <div style={styles.formGroup}>
              <label style={styles.label}>Name</label>
              <input
                type="text"
                value={editedUser.username}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, username: e.target.value })
                }
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                value={editedUser.email}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, email: e.target.value })
                }
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Avatar</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={styles.inputFile}
              />
              {previewAvatar && (
                <img
                  src={previewAvatar}
                  alt="Preview"
                  style={styles.previewImage}
                />
              )}
            </div>

            <div style={styles.modalButtons}>
              <button style={styles.saveButton} onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                style={styles.cancelButton}
                onClick={() => {
                  setShowModal(false);
                  setPreviewAvatar(user.avatar || "https://via.placeholder.com/100");
                  setEditedUser({
                    username: user.username,
                    email: user.email,
                  });
                  setAvatarFile(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "500px",
    margin: "100px auto",
    backgroundColor: "#1a1a1a",
    color: "#fff",
    padding: "30px",
    borderRadius: "12px",
    fontFamily: "Segoe UI, sans-serif",
    textAlign: "center",
  },
  avatarContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  avatar: {
    height: "100px",
    width: "100px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #06d6a0",
  },
  title: {
    fontSize: "28px",
    marginBottom: "10px",
  },
  quote: {
    fontStyle: "italic",
    color: "#ccc",
    marginBottom: "20px",
  },
  text: {
    fontSize: "16px",
    marginBottom: "10px",
  },
  errorText: {
    color: "#ff4f4f",
    marginTop: "10px",
  },
  btnGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "20px",
  },
  button: {
    backgroundColor: "#06d6a0",
    color: "#000",
    padding: "10px 16px",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "25px 30px",
    borderRadius: "10px",
    width: "350px",
    color: "#000",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  modalTitle: {
    textAlign: "center",
    marginBottom: "10px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontWeight: "500",
  },
  input: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  inputFile: {
    padding: "5px 0",
  },
  previewImage: {
    height: "60px",
    width: "60px",
    borderRadius: "50%",
    objectFit: "cover",
    marginTop: "5px",
    alignSelf: "center",
  },
  modalButtons: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  saveButton: {
    padding: "8px 14px",
    backgroundColor: "#06d6a0",
    color: "#000",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "opacity 0.2s",
  },
  cancelButton: {
    padding: "8px 14px",
    backgroundColor: "#ccc",
    color: "#000",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default Profile;
