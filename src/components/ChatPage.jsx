import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();
  const chatRef = useRef(null);

  const quickReplies = [
    "Reserve a table",
    "Book a private hall",
    "View today's menu",
    "Check my booking status",
    "Cancel my booking",
    "Restaurant location & timings",
    "Contact staff for help",
    "What kind of events do you host?",
    "Tell me about your special offers"
  ];

  const botReplies = {
    "reserve a table": {
      text: "🍽️ To book a table, please visit our reservation page. You can choose your preferred date, time, and number of guests. We look forward to seeing you!",
      link: "/table-reserve",
      linkLabel: "Go to Table Booking"
    },
    "book a private hall": {
      text: "🎉 We have several options for private events. You can book our party hall for larger gatherings or a private hall for a more intimate setting. Which one are you interested in?",
      link: "/party-booking",
      linkLabel: "View Hall Options"
    },
    "view today's menu": {
      text: "📋 Our menu features a variety of delicious dishes and daily specials! You can browse our full menu online to see what we have to offer today.",
      link: "/menu",
      linkLabel: "View Full Menu"
    },
    "check my booking status": {
      text: "🔍 You can view and manage all your current and past reservations in your personal profile dashboard. You'll need to be signed in to access this.",
      link: "/profile",
      linkLabel: "Go to My Profile"
    },
    "cancel my booking": {
      text: "❌ You can cancel a booking from your profile. Please find the reservation you wish to cancel and follow the instructions there. Note that our cancellation policy may apply.",
      link: "/profile",
      linkLabel: "Cancel from My Profile"
    },
    "restaurant location & timings": {
      text: "🕒 We're located at [Your Restaurant Address, e.g., 123 Main Street, City]. We're open from 9 AM to 11 PM every day. Feel free to drop by!",
    },
    "contact staff for help": {
      text: "📞 Our friendly staff is ready to assist you. You can reach us via our contact page for any questions or special requests.",
      link: "/contact",
      linkLabel: "Contact Us"
    },
    "what kind of events do you host?": {
      text: "🎭 We host a variety of events, including live music nights, special holiday dinners, and private parties. Check out our events page for a full schedule!",
      link: "/event-hall",
      linkLabel: "View Event Schedule"
    },
    "tell me about your special offers": {
      text: "⭐ We frequently have special promotions and offers for our valued customers! Keep an eye on our website's homepage or social media for the latest deals.",
      link: "/",
      linkLabel: "See Our Offers"
    },
  };

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setMessages([
        { sender: "bot", text: "👋 Hello! I'm the INN Dine Assistant. How can I help you today?" },
        { sender: "bot", text: "I can help you with bookings, menus, finding information, and more. Try one of the quick questions below to get started!" }
      ]);
    }, 500);
  }, []);

  const handleQuickReply = (msg) => {
    setMessages((prev) => [...prev, { sender: "user", text: msg }]);

    setTimeout(() => {
      const lower = msg.toLowerCase();
      let replyFound = false;

      // Find a reply that contains the user's message
      for (const [key, value] of Object.entries(botReplies)) {
        if (lower.includes(key)) {
          setMessages((prev) => [
            ...prev,
            { sender: "bot", text: value }
          ]);
          replyFound = true;
          break; // Stop after finding the first match
        }
      }

      if (!replyFound) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "I'm sorry, I didn't quite catch that. Could you please rephrase or try a different quick question?" }
        ]);
      }
    }, 800);
  };

  useEffect(scrollToBottom, [messages]);

  const styles = {
    wrapper: {
      minHeight: "100vh",
      backgroundColor: "#111",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      fontFamily: "'Open Sans', sans-serif",
    },
    chatContainer: {
      width: "100%",
      maxWidth: "450px",
      height: "90vh",
      backgroundColor: "#1a1a1a",
      borderRadius: "16px",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      boxShadow: "0 0 20px rgba(0,0,0,0.4)",
    },
    header: {
      backgroundColor: "#e63946",
      padding: "14px 20px",
      fontSize: "1rem",
      color: "#fff",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontWeight: "bold",
    },
    backBtn: {
      backgroundColor: "#fff",
      color: "#e63946",
      padding: "6px 10px",
      border: "none",
      borderRadius: "6px",
      fontSize: "0.85rem",
      cursor: "pointer",
    },
    chatBox: {
      flex: 1,
      padding: "16px",
      overflowY: "auto",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    userMsg: {
      alignSelf: "flex-end",
      backgroundColor: "#e63946",
      color: "#fff",
      padding: "10px 14px",
      borderRadius: "16px 16px 0 16px",
      maxWidth: "75%",
      fontSize: "0.9rem",
    },
    botMsg: {
      alignSelf: "flex-start",
      backgroundColor: "#333",
      color: "#fff",
      padding: "10px 14px",
      borderRadius: "16px 16px 16px 0",
      maxWidth: "75%",
      fontSize: "0.9rem",
    },
    quickSection: {
      borderTop: "1px solid #444",
      padding: "14px 18px",
      backgroundColor: "#1a1a1a",
    },
    quickTitle: {
      marginBottom: "10px",
      color: "#ccc",
      fontWeight: 500,
      fontSize: "0.85rem",
    },
    quickGrid: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
    },
    quickBtn: {
      backgroundColor: "#e63946",
      color: "#fff",
      padding: "6px 12px",
      border: "none",
      borderRadius: "20px",
      cursor: "pointer",
      fontSize: "0.8rem",
      transition: "background 0.3s ease",
    },
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.chatContainer}>
        <div style={styles.header}>
          Chat Assistant — INN Dine
          <button style={styles.backBtn} onClick={() => navigate(-1)}>← Back</button>
        </div>

        <div style={styles.chatBox} ref={chatRef}>
          {messages.map((msg, idx) => (
            <div key={idx} style={msg.sender === "user" ? styles.userMsg : styles.botMsg}>
              {typeof msg.text === "string" ? (
                msg.text
              ) : (
                <>
                  {msg.text.text}
                  <br />
                  {msg.text.link && (
                    <Link to={msg.text.link} style={{ color: "#e63946", textDecoration: "underline" }}>
                      {msg.text.linkLabel}
                    </Link>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        <div style={styles.quickSection}>
          <div style={styles.quickTitle}>Quick Questions:</div>
          <div style={styles.quickGrid}>
            {quickReplies.map((q, i) => (
              <button key={i} style={styles.quickBtn} onClick={() => handleQuickReply(q)}>
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;