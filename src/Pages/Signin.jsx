import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from '../axios'; // Use your configured axios instance
import { useUser } from '../context/UserContext';

const SignIn = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const [activeRole, setActiveRole] = useState("user");
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleToggle = (role) => {
    setActiveRole(role);
    setInput({ email: "", password: "" });
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { // Use the configured api instance
        email: input.email,
        password: input.password,
        role: activeRole,
      });

      login(res.data);

      if (activeRole === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed. Please try again.");
    }
  };
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Sign In</h2>
      <div style={styles.toggleContainer}>
        <button
          onClick={() => handleToggle("user")}
          style={{
            ...styles.toggleButton,
            backgroundColor: activeRole === "user" ? "#e63946" : "#333",
          }}
        >
          User
        </button>
        <button
          onClick={() => handleToggle("admin")}
          style={{
            ...styles.toggleButton,
            backgroundColor: activeRole === "admin" ? "#e63946" : "#333",
          }}
        >
          Admin
        </button>
      </div>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="email"
          name="email"
          placeholder={`${activeRole === "admin" ? "Admin" : "User"} Email`}
          style={styles.input}
          onChange={handleChange}
          value={input.email}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          style={styles.input}
          onChange={handleChange}
          value={input.password}
        />
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" style={styles.button}>
          {activeRole === "admin" ? "Login as Admin" : "Login as User"}
        </button>
        {/* <p style={styles.extra}>
          <span style={styles.link}>Forgot password?</span>
        </p> */}
        <p style={styles.extra}>
          Not signed up?{" "}
          <Link to="/signup" style={{ color: "#e63946", textDecoration: "underline" }}>
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
};
const styles = {
  container: {
    maxWidth: "400px",
    margin: "80px auto",
    backgroundColor: "#1a1a1a",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.3)",
    color: "#fff",
    fontFamily: "'Open Sans', sans-serif",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "28px",
  },
  toggleContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
    gap: "10px",
  },
  toggleButton: {
    flex: 1,
    padding: "10px 0",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
    transition: "background-color 0.3s ease",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    marginBottom: "15px",
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    fontSize: "14px",
  },
  button: {
    backgroundColor: "#e63946",
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px",
  },
  error: {
    color: "#ff4f4f",
    marginBottom: "10px",
    fontSize: "14px",
  },
  extra: {
    marginTop: "12px",
    fontSize: "14px",
    textAlign: "center",
  },
  link: {
    color: "#ccc",
    textDecoration: "underline",
    cursor: "pointer",
  },
};

export default SignIn;
