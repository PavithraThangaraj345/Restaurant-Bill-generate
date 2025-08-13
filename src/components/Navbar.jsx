import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaConciergeBell,
  FaChair,
  FaUsers,
  FaHome,
  FaInfoCircle,
  FaPhone,
  FaSignInAlt,
  FaSpa,
  FaTheaterMasks,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { MdLogin } from "react-icons/md";
import "../styles/Navbar.css";



import { useEffect } from "react";
import { motion, useAnimation, useMotionValue } from "framer-motion";



const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="logo">INN Dine</div>

      {/* Hamburger icon */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
        <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>

        <div className="dropdown">
          <span><FaConciergeBell /> Booking ▾</span>
          <div className="dropdown-content">
            <Link to="/table-reserve"><FaChair /> Table Booking</Link>
            <Link to="/party-booking"><FaUsers /> Party Hall</Link>
            <Link to="/private-hall"><FaSpa /> Private Hall</Link>
            <Link to="/event-hall"><FaTheaterMasks /> Event Night</Link>
          </div>
        </div>

        <Link to="/signin" onClick={() => setMenuOpen(false)}>
          <MdLogin style={{ marginRight: "8px" }} />
          Sign In
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;
