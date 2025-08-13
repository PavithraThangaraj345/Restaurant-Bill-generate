import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import instance from "../axios"; // ⬅️ IMPORT YOUR CUSTOM AXIOS INSTANCE

const SignUp = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => { // Made handleSubmit async
    e.preventDefault();
    const { username, email, password, confirmPassword } = input;
    setError(""); // Clear previous errors

    if (!username || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    // Password match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Regex validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError("Password must be at least 8 characters, include 1 uppercase, 1 number, and 1 special character.");
      return;
    }

    try {
      // ⬅️ REPLACED 'axios' with 'instance' and removed the base URL
      const res = await instance.post("/auth/register", {
        username,
        email,
        password,
      });

      alert("Sign up successful! Please login.");
      navigate("/signin");
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Sign Up</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          style={styles.input}
          onChange={handleChange}
          value={input.username}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
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
        <input
          type="password"
          name="confirmPassword"
          placeholder="Re-enter Password"
          style={styles.input}
          onChange={handleChange}
          value={input.confirmPassword}
        />
        <small style={{ color: "#aaa", fontSize: "12px" }}>
          Password must be 8+ chars with 1 uppercase, 1 number & 1 special character.
        </small>

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" style={styles.button}>
          Create Account
        </button>

        <p style={styles.extra}>
          Already have an account?{" "}
          <Link to="/signin" style={{ color: "#e63946", textDecoration: "underline" }}>
            Sign In
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
};

export default SignUp;
