import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Menu2 = () => {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedOccasion, setSelectedOccasion] = useState(null);

  const items = [
    // In your items array inside Menu2.jsx
    { id: 101, name: "Birthday Party", category: "Occasion", price: 2000, image: "/BirthdayParty.jpg" },
{ id: 102, name: "Anniversary Celebration", category: "Occasion", price: 2500, image: "/AniversaryCelebration.jpg" },
{ id: 103, name: "Engagement Function", category: "Occasion", price: 3500, image: "/EngagementCelebration.jpg" },
{ id: 104, name: "Corporate Get-Together", category: "Occasion", price: 3000, image: "/CorporateGetTogether.jpg" },
{ id: 105, name: "Baby Shower", category: "Occasion", price: 2800, image: "/BabyShower.jpg" },
{ id: 106, name: "Farewell Party", category: "Occasion", price: 2200, image: "/FarwellParty.jpg" },
{ id: 107, name: "Reunion Celebration", category: "Occasion", price: 2400, image: "/ReunionCelebration.jpg" },
{ id: 108, name: "Festival Gathering", category: "Occasion", price: 3200, image: "/FestivalGathering.jpg" },



    { id: 1, name: "Standard Veg Buffet", category: "Food", price: 500, image: "/StandardVegBuffet.jpg" },
    { id: 2, name: "Standard Non-Veg Buffet", category: "Food", price: 700, image: "/StandardNonVegBuffet.jpg" },
    { id: 3, name: "Mini Meal Combo", category: "Food", price: 400, image: "/MiniMealCombo.jpg" },

    { id: 4, name: "Welcome Drink", category: "Add-on", price: 500, image: "/WelcomeDrink.jpg" },
    { id: 5, name: "Custom Cake", category: "Add-on", price: 1000, image: "/CustomCake.jpg" },

    { id: 6, name: "DJ Setup", category: "Facility", price: 2000, image: "/DJSetup.jpg" },
    { id: 7, name: "Decoration", category: "Facility", price: 3000, image: "/Decoration.jpg" },
    { id: 8, name: "Projector", category: "Facility", price: 1500, image: "/Projector.jpg" },
  ];

  const handleAdd = (item) => {
    const alreadyExists = selectedItems.find((i) => i.id === item.id);
    if (!alreadyExists) {
      let updated;
      if (item.category === "Occasion") {
        updated = [...selectedItems.filter((i) => i.category !== "Occasion"), item];
        setSelectedOccasion(item);
      } else {
        updated = [...selectedItems, item];
      }
      setSelectedItems(updated);
      localStorage.setItem("partySelection", JSON.stringify(updated));
    }
  };

  const goToBooking = () => {
    navigate("/party-booking");
  };

  const getDescription = (title) => {
    switch (title) {
      case "Choose Occasion":
        return "Pick a special event that sets the tone for your celebration.";
      case "Select Food Package":
        return "Delight your guests with curated South Indian and fusion menus.";
      case "Add-ons":
        return "Enhance the experience with unique customizations and treats.";
      case "Facilities":
        return "Make it memorable with entertainment, ambiance, and convenience.";
      default:
        return "";
    }
  };

  const renderSection = (category, title) => {
    const filtered = items.filter((item) => item.category === category);
    return (

      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <p style={styles.sectionLabel}>PLAN YOUR EVENT</p>
          <h2 style={styles.sectionTitle}>{title}</h2>
          <p style={styles.sectionDesc}>{getDescription(title)}</p>
        </div>
        <div style={styles.grid}>
          {filtered.map((item) => {
            const isOccasionDisabled =
              item.category === "Occasion" && selectedOccasion && selectedOccasion.id !== item.id;
            const isSelected = selectedItems.find((i) => i.id === item.id);

            return (
              <>

                <div
                  key={item.id}
                  style={{
                    ...styles.card,
                    opacity: isOccasionDisabled ? 0.5 : 1,
                    pointerEvents: isOccasionDisabled ? "none" : "auto",
                  }}
                >
                  <img src={item.image} alt={item.name} style={styles.cardImage} />
                  <h4>{item.name}</h4>
                  <p style={styles.price}>₹{item.price}</p>
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
              </>
            );
          })}
        </div>
      </div>
    );
  };

  return (<>
    {/* Hero Section */}
    <div style={styles.heroSection}>
      <div style={styles.heroOverlay}>
        <h1 style={styles.heroTitle}>Design your dream Party</h1>
        <p style={styles.heroSubtitle}>
          Celebrate your special moments in style – hassle-free reservations now available!
        </p>
      </div>
    </div>

    <div style={styles.page}>

      {renderSection("Occasion", "Choose Occasion")}
      {renderSection("Food", "Select Food Package")}
      {renderSection("Add-on", "Add-ons")}
      {renderSection("Facility", "Facilities")}

      <button style={styles.backButton} onClick={goToBooking}>
        Back to Booking
      </button>
    </div>
  </>
  );
};

const styles = {
  
  heroSection: {
    width: "100vw",
    height: "100vh",
    backgroundImage: "url('/party3.jpg')", 
    backgroundSize: "cover",
    backgroundAttachment: "fixed",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  heroOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: "3rem 2rem",
    width: "100%",
    maxWidth: "90%",
    textAlign: "center",
    borderRadius: "12px",
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
  heading: {
    fontSize: "2.5rem",
    textAlign: "center",
    marginBottom: "2rem",
    fontFamily: "'Playfair Display', serif",
    color: "#333",
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
    fontFamily: "'Open Sans', sans-serif",
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
    gap: "1rem",
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

export default Menu2;
