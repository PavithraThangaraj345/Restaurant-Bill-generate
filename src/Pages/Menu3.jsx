import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Menu3 = () => {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedOccasion, setSelectedOccasion] = useState(null);

  const items = [
  { id: 201, name: "Private Dinner", category: "Occasion", price: 3000, image: "/PrivateDinner.jpg" },
{ id: 202, name: "Business Meeting", category: "Occasion", price: 3500, image: "/BusinessMeeting.jpg" },
{ id: 203, name: "Family Gathering", category: "Occasion", price: 4000, image: "/FamilyGathering.jpg" },
{ id: 204, name: "Client Presentation", category: "Occasion", price: 3800, image: "/ClientPresentation.jpg" },
{ id: 205, name: "Small Workshop", category: "Occasion", price: 4200, image: "/SmallWorkshop.jpg" },
{ id: 206, name: "Confidential Interview", category: "Occasion", price: 2500, image: "/Interview.jpg" },
{ id: 207, name: "Birthday (Private Setup)", category: "Occasion", price: 4500, image: "/BirthdayPrivate.jpg" },
{ id: 208, name: "Romantic Proposal", category: "Occasion", price: 5000, image: "/RomanticProposal.jpg" },



    { id: 301, name: "South Indian Veg Combo", category: "Food", price: 400, image: "/SouthVeg.jpg" },
    { id: 302, name: "Continental Plated Set", category: "Food", price: 600, image: "/Continental.jpg" },

    { id: 303, name: "Mocktail Station", category: "Add-on", price: 600, image: "/MocktailStation.jpg" },
    { id: 304, name: "Welcome Gift Box", category: "Add-on", price: 900, image: "/GiftBox.jpg" },

    { id: 305, name: "Projector Setup", category: "Facility", price: 1500, image: "/ProjectorSet.jpg" },
    { id: 306, name: "Minimal Decor", category: "Facility", price: 2000, image: "/MinimalDecor.jpg" },
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
      localStorage.setItem("privateHallSelection", JSON.stringify(updated));
    }
  };

  const goToBooking = () => {
    navigate("/private-hall");
  };

  const getDescription = (title) => {
    switch (title) {
      case "Choose Occasion":
        return "Select the purpose of your gathering for a private and personalized experience.";
      case "Select Food Package":
        return "Choose elegant plated meals or traditional spreads suitable for private halls.";
      case "Add-ons":
        return "Add a touch of charm and warmth to your intimate celebration.";
      case "Facilities":
        return "Support your private session with audio-visual aids and ambience.";
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
    backgroundImage: "url('/images/party5.jpg')",
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

export default Menu3;
