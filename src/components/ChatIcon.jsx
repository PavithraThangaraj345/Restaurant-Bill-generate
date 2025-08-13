import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaComments } from "react-icons/fa";

const ChatIcon = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Optional: Hide on chat page
  if (location.pathname === "/chat") return null;

  return (
    <button
      onClick={() => navigate("/chat")}
      style={{
        position: "fixed",
        bottom: "250px",
        right: "20px",
        backgroundColor: "#e63946",
        border: "none",
        borderRadius: "50%",
        padding: "16px",
        color: "#fff",
        cursor: "pointer",
        zIndex: 999,
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      }}
      title="Chat with us"
    >
      <FaComments size={40} /><br />
    </button>
  );
};

export default ChatIcon;
