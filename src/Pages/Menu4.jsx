import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Menu4 = () => {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const items = [
    // EVENT TYPE
    { id: 401, name: "Music Concert", category: "Event", price: 50000, image: "/MusicalConcert.jpg" },
    { id: 402, name: "Cultural Night", category: "Event", price: 35000, image: "/CulturalNight.jpg" },
    { id: 403, name: "Tech Fest", category: "Event", price: 60000, image: "/TechFest.jpg" },
    { id: 404, name: "Corporate Expo", category: "Event", price: 80000, image: "/CorporateExpo.jpg" },
    { id: 405, name: "Comedy Show", category: "Event", price: 40000, image: "/Show.jpg" },
    { id: 406, name: "Award Ceremony", category: "Event", price: 70000, image: "/Award.jpg" },

    // SETUP
    { id: 501, name: "Grand Stage Setup", category: "Setup", price: 15000, image: "/Stage.jpg" },
    { id: 502, name: "LED Light Show", category: "Setup", price: 12000, image: "/led.jpg" },

    // FACILITIES
    { id: 601, name: "AV Equipment", category: "Facility", price: 10000, image: "/av.jpg" },
    { id: 602, name: "Green Room Access", category: "Facility", price: 8000, image: "/Greenroom.jpg" },

    // ADD-ONS
    { id: 701, name: "Celebrity Welcome", category: "Add-on", price: 5000, image: "/CelebrityWelcome.jpg" },
    { id: 702, name: "Stage Branding", category: "Add-on", price: 7000, image: "/StageBranding.jpg" },
  ];

  const handleAdd = (item) => {
    const alreadyExists = selectedItems.find((i) => i.id === item.id);
    if (!alreadyExists) {
      let updated;
      if (item.category === "Event") {
        updated = [...selectedItems.filter((i) => i.category !== "Event"), item];
        setSelectedEvent(item);
      } else {
        updated = [...selectedItems, item];
      }
      setSelectedItems(updated);
      localStorage.setItem("eventSelection", JSON.stringify(updated));
    }
  };

  const goToBooking = () => {
    navigate("/event-hall");
  };

  const getDescription = (title) => {
    switch (title) {
      case "Select Event Type":
        return "Choose the event you're hosting – concerts, fests, expos and more.";
      case "Stage & Setup":
        return "Enhance your stage presence with grand setup and light displays.";
      case "Facilities":
        return "Support your performers and audience with essential facilities.";
      case "Add-ons":
        return "Add a personal touch with branding and welcome perks.";
      default:
        return "";
    }
  };

  const renderSection = (category, title) => {
    const filtered = items.filter((item) => item.category === category);
    return (
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <p style={styles.sectionLabel}>EVENT ORGANIZER PANEL</p>
          <h2 style={styles.sectionTitle}>{title}</h2>
          <p style={styles.sectionDesc}>{getDescription(title)}</p>
        </div>
        <div style={styles.grid}>
          {filtered.map((item) => {
            const isEventDisabled =
              item.category === "Event" && selectedEvent && selectedEvent.id !== item.id;
            const isSelected = selectedItems.find((i) => i.id === item.id);

            return (
              <div
                key={item.id}
                style={{
                  ...styles.card,
                  opacity: isEventDisabled ? 0.5 : 1,
                  pointerEvents: isEventDisabled ? "none" : "auto",
                }}
              >
                <img src={item.image} alt={item.name} style={styles.cardImage} />
                <h4>{item.name}</h4>
                <p style={styles.price}>₹{item.price.toLocaleString()}</p>
                <button
                  style={{
                    ...styles.button,
                    backgroundColor: isSelected ? "#ccc" : "#a42021",
                    cursor: isSelected ? "not-allowed" : "pointer",
                  }}
                  disabled={isSelected}
                  onClick={() => handleAdd(item)}
                >
                  {isSelected ? "Added" : "Add to Booking"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Hero Banner */}
      <div style={styles.heroSection}>
        <div style={styles.heroOverlay}>
          <h1 style={styles.heroTitle}>Organize Your Grand Event</h1>
          <p style={styles.heroSubtitle}>
            Choose event type, facilities, and customization options.
          </p>
        </div>
      </div>

      <div style={styles.page}>
        {renderSection("Event", "Select Event Type")}
        {renderSection("Setup", "Stage & Setup")}
        {renderSection("Facility", "Facilities")}
        {renderSection("Add-on", "Add-ons")}

        <button style={styles.backButton} onClick={goToBooking}>
          Proceed to Event Booking
        </button>
      </div>
    </>
  );
};

const styles = {
  heroSection: {
    width: "100vw",
    height: "100vh",
    backgroundImage: "url('/images/event1.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  heroOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: "3rem 2rem",
    textAlign: "center",
    borderRadius: "12px",
    width: "90%",
  },
  heroTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "3.5rem",
    color: "#fff",
    marginBottom: "1rem",
  },
  heroSubtitle: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: "1.3rem",
    color: "#ddd",
    marginBottom: "2rem",
  },
  page: {
    padding: "2rem",
    backgroundColor: "#fff",
    fontFamily: "'Poppins', sans-serif",
  },
  section: {
    marginBottom: "3rem",
  },
  sectionHeader: {
    textAlign: "center",
    marginBottom: "1.5rem",
  },
  sectionLabel: {
    textTransform: "uppercase",
    letterSpacing: "2px",
    fontWeight: "500",
    color: "#999",
    fontSize: "14px",
    marginBottom: "10px",
  },
  sectionTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "42px",
    fontWeight: "700",
    marginBottom: "20px",
  },
  sectionDesc: {
    color: "#666",
    fontSize: "1rem",
    maxWidth: "600px",
    margin: "0 auto",
    lineHeight: "1.6",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    textAlign: "center",
    padding: "1rem",
    border: "1px solid #eee",
  },
  cardImage: {
    width: "90%",
    height: "300px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "1rem",
  },
  price: {
    color: "#555",
    margin: "0.5rem 0 1rem",
    fontWeight: "bold",
  },
  button: {
    padding: "0.6rem 1rem",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "600",
  },
  backButton: {
    marginTop: "2rem",
    padding: "0.8rem 2rem",
    backgroundColor: "#222",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },
};

export default Menu4;
