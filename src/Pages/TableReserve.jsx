import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import instance from '../axios'; // ⬅️ THIS IS THE NEW IMPORT
import { useUser } from '../context/UserContext';

// Email & Payment based Table Reservation Component
const TableReserve = () => {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const { user, isAuthenticated, loading } = useUser();

  const [visibleCount, setVisibleCount] = useState(9);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    time: "",
    people: 1,
  });
  const [billGenerated, setBillGenerated] = useState(false);
  const [estimatedAmount, setEstimatedAmount] = useState(0);
  const [isPaid, setIsPaid] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState([]);


  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        name: user.username, // Assuming your user object has a `username` field
        email: user.email,
      }));
    }
  }, [isAuthenticated, user]);


  // ⏱️ Show more gallery images
  const showMore = () => setVisibleCount(12);

  // 📦 Load selected menu items from localStorage (optional)
  useEffect(() => {
    const menu = JSON.parse(localStorage.getItem("selectedMenu")) || [];
    setSelectedMenu(menu);
  }, []);

  // 🔁 Form input handling
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 📅 Date range
  const today = new Date();
  const fiveDaysLater = new Date();
  fiveDaysLater.setDate(today.getDate() + 5);
  const formatDate = (date) => date.toISOString().split("T")[0];
  const minDate = formatDate(today);
  const maxDate = formatDate(fiveDaysLater);

  // 🧾 Reserve (Estimate)
  const handleReserve = () => {
    const amount = formData.people * 100;
    setEstimatedAmount(amount);
    setBillGenerated(true);
  };

  // 👇 Scroll to form
  const handleScrollToForm = () => {
    const formElement = document.getElementById("reserveForm");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 💳 Pay Now + Email PDF

  const handlePayNow = async () => {
    if (!isAuthenticated) {
      alert("You must be logged in to make a reservation.");
      navigate("/signin");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Authentication failed. Please log in again.");
        navigate("/signin");
        return;
      }

      // Create the configuration object with headers
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // This is the crucial line
        }
      };

      const payload = {
        name: user.username,
        email: user.email,
        date: formData.date,
        time: formData.time,
        people: formData.people,
        amount: estimatedAmount,
        menuItems: selectedMenu,
        paymentStatus: "Pending"
      };

      // Pass the payload AND the config object
      await instance.post("/reservations", payload, config); // ⬅️ THIS IS THE NEW CALL

      alert("Reservation submitted successfully! Awaiting admin confirmation.");
      setIsPaid(true);
      navigate("/mybooking");
    } catch (err) {
      console.error("Reservation failed:", err);
      alert("Something went wrong with your reservation.");
    }
  };
  if (loading) {
    return <div>Loading user data...</div>;
  }

  const images = [
    "table1.jpg", "table2.jpg", "table3.jpg",
    "table4.jpg", "table5.jpg", "table6.jpg",
    "table7.jpg", "table8.jpg", "table9.jpg",
    "table10.jpg", "table11.jpg", "table12.jpg"
  ];

  return (
    <>
      {/* Hero Section */}
      <div style={styles.heroSection}>
        <div style={styles.heroOverlay}>
          <h1 style={styles.heroTitle}>Reserve Your Table</h1>
          <p style={styles.heroSubtitle}>“Delightful dining starts with a reservation.”</p>
          <button onClick={handleScrollToForm} style={styles.heroButton}>Reserve Now ↓</button>
        </div>
      </div>
      <div style={styles.reserveIntro} id="reserveForm">
        <p style={styles.reserveLabel}>EASY & CONVENIENT</p>
        <h2 style={styles.reserveHeading}>Reserve Your Table</h2>
        <p style={styles.reserveSubheading}>
          Book your table effortlessly for a delightful dining experience. Choose your time and let us handle the rest.
        </p>
      </div>
      <button
        style={styles.menuButton}
        onClick={() => navigate("/menu")}
        onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
      >
        Our menu
      </button>

      {/* Reservation Form */}
      <div ref={formRef} style={styles.container}>
        <form

          style={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            handleReserve();
          }}
        >

          <input type="text" name="name" placeholder="Your Name" style={styles.input} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email Address" style={styles.input} onChange={handleChange} required />
          <input type="date" name="date" style={styles.input} onChange={handleChange} required min={minDate} max={maxDate} />
          <input type="time" name="time" style={styles.input} onChange={handleChange} required />
          <input type="number" name="people" placeholder="No. of People" style={styles.input} min="1" max="10" onChange={handleChange} required />
          <button type="submit" style={styles.button}>Reserve Table</button>

        </form>

        {/* Bill Display */}
        {billGenerated && !isPaid && (
          <div style={styles.billBox}>
            <h4>Estimated Bill</h4>
            <p>Name: {formData.name}</p>
            <p>Email: {formData.email}</p>
            <p>Date: {formData.date}</p>
            <p>Time: {formData.time}</p>
            <p>People: {formData.people}</p>
            <p>Menu Items: {selectedMenu.length > 0 ? selectedMenu.join(', ') : "None"}</p>
            <p>Total: ₹{estimatedAmount}.00</p>
            <p>(₹100 per person – paid at restaurant)</p>
            <button
              style={{ ...styles.downloadButton, backgroundColor: "#28a745", marginTop: "1rem" }}
              onClick={handlePayNow}
            >
              Pay Now & Get Email with PDF
            </button>
          </div>
        )}
        {/* Confirmation Message */}
        {isPaid && (
          <div style={styles.billBox}>
            <h4>✅ Payment Successful!</h4>
            <p>Thank you, {formData.name}. Your reservation is confirmed.</p>
            <p>Confirmation has been sent to <strong>{formData.email}</strong>.</p>
          </div>
        )}
      </div>

      {/* Info + Video Section */}
      <div style={styles.infoGrid}>
        <div style={styles.infoText}>
          <h2 style={styles.infoHeading}>About Reservation</h2>
          <p style={styles.infoPara}>
            Book a table up to <strong>5 days in advance</strong> and a minimum of <strong>2 hours before</strong> your arrival.
          </p>
          <ul style={styles.infoList}>
            <li>Tables are reserved for <strong>3 hours</strong> from the time mentioned.</li>
            <li>Food orders are taken <strong>only at the restaurant</strong>.</li>
            <li>Please be on time. After 30 mins delay, booking may be canceled.</li>
            <li>You will receive an email confirmation.</li>
            <li>Maximum people allowed: <strong>10 per reservation</strong>.</li>
          </ul>

          <h3 style={styles.contactHeading}>Need Help?</h3>
          <p style={styles.contactInfo}>
            📞 <strong>Call Center:</strong> +91 98765 43210 <br />
            🕒 <strong>Working Hours:</strong> 10 AM – 10 PM, All Days
          </p>
        </div>

        {/* RIGHT: Refund & Cancellation Policy */}
        <div style={styles.infoPolicy}>
          <h3 style={styles.policyHeading}>Refund & Cancellation Policy</h3>
          <ul style={styles.policyList}>
            <li>Cancellations made <strong>24 hours</strong> before the reservation time are eligible for a <strong>full refund</strong>.</li>
            <li>Cancellations made within <strong>6–24 hours</strong> of the reservation will receive a <strong>50% refund</strong>.</li>
            <li><strong>No refund</strong> for cancellations made within <strong>6 hours</strong> of the reservation.</li>
            <li>To cancel your reservation, please contact our support at <a href="mailto:reservations@yourrestaurant.com" style={styles.emailLink}>reservations@yourrestaurant.com</a>.</li>
            <li>Refunds will be processed within <strong>3–5 working days</strong>.</li>
          </ul>
        </div>

      </div>


      <div className="gallery-container">
        <h2 className="gallery-title">Dining Gallery</h2>

        <div className="gallery-grid">
          {images.slice(0, visibleCount).map((img, idx) => (
            <div className="gallery-card" key={idx}>
              <img src={`/images/${img}`} alt={`table-${idx + 1}`} />
              <div className="gallery-overlay">
                <a href="/menu">View Menu</a>
              </div>
            </div>
          ))}
        </div>

        {visibleCount < 12 && (
          <button onClick={showMore} style={buttonStyle}>
            Show More
          </button>
        )}
      </div>
      {/* Inline CSS inside JSX */}
      <style>
        {`
          .gallery-container {
            padding: 60px 40px;
            background-color: #000000ff;
            color: #fff;
            text-align: center;
            font-family: 'Open Sans', sans-serif;
            margin:0;
          }
          .gallery-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 2.8rem;
            color: #e63946;
            margin-bottom: 30px;
          }
          .gallery-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            justify-content: center;
          }
          .gallery-card {
          position: relative;
          width: 100%;
          height: 250px; /* 🔴 Fixed height for all cards */
           overflow: hidden;
          // border-radius: 12px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
          }
          .gallery-card img {
            width: 100%;
            height: 250px;
            display: block;
            transition: transform 0.3s ease;
          }
          .gallery-card:hover img {
            transform: scale(1.05);
          }
          .gallery-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.6);
            opacity: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity 0.3s ease;
          }
          .gallery-card:hover .gallery-overlay {
            opacity: 1;
          }
          .gallery-overlay a {
            // background-color: #222121ff;
            color: #fff;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 12px;
            letter-spacing: 1px;
            word-spacing: 2px;

            font-size: 1rem;
            font-family: 'Poppins', sans-serif;
          }
          .gallery-button {
            margin-top: 30px;
            background-color: #e63946;
            color: #fff;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 0.5rem;
            font-weight: bold;
            transition: background 0.3s ease;
          }
        `}
      </style>

    </>
  );
};

// Reuse your same styles from earlier — no changes needed
const styles = {
  heroSection: {
    width: "100vw",
    height: "100vh",
    backgroundImage: "url('/reserve1.jpeg')",
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
    animation: "fadeInUp 1.2s ease-out forwards",
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
  heroButton: {
    padding: "1rem 2rem",
    fontSize: "1rem",
    fontWeight: "bold",
    backgroundColor: "#a42021",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "transform 0.3s",
  },
  container: {
    maxWidth: "700px",
    margin: "auto",
    padding: "2rem",
  },
  reserveIntro: {
    textAlign: "center",
    marginBottom: "3rem",
  },

  reserveLabel: {
    fontSize: "0.8rem",
    color: "#999",
    letterSpacing: "2px",
    textTransform: "uppercase",
    fontWeight: "500",
    marginBottom: "0.5rem",
    fontFamily: "'Poppins', sans-serif",
  },

  reserveHeading: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "66px",
    fontWeight: "700",
    marginBottom: "20px",
  },

  reserveSubheading: {
    fontSize: "1.1rem",
    color: "#666",
    maxWidth: "700px",
    margin: "0 auto",
    lineHeight: "1.6",
    fontFamily: "'Poppins', sans-serif",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "0.8rem",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "0.9rem",
    backgroundColor: "#a42021",
    color: "#fff",
    border: "none",
    fontWeight: "bold",
    borderRadius: "5px",
  },
  // Corrected code for the style object

  menuButton: {
    display: "block", // Move this to the top
    padding: "0.9rem 2rem",
    backgroundColor: "#a42021",
    color: "#fff",
    fontSize: "1.1rem",
    fontWeight: "300",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(164, 32, 33, 0.3)",
    transition: "all 0.3s ease-in-out",
    margin: "1rem auto", // Use the final, desired margin value
  },
  billBox: {
    marginTop: "2rem",
    padding: "1rem",
    backgroundColor: "#f7f7f7",
    borderRadius: "6px",
    textAlign: "center",
    border: "1px dashed #aaa",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "3rem",
    marginTop: "5rem",
    padding: "2rem 0",
    alignItems: "start",
    width: "100%",
  },
  infoText: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: "1rem",
    lineHeight: "1.8",
    color: "#444",
  },
  infoHeading: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "42px",
    fontWeight: "bold",
    marginBottom: "1rem",
    color: "#111",
  },
  infoPara: {
    marginBottom: "1.2rem",
    color: "#555",
  },
  infoPolicy: {
    backgroundColor: "#fdf8f4", // elegant cream background
    color: "#3e3e3e",
    padding: "2.5rem",
    borderRadius: "1rem",
    fontFamily: "'Poppins', sans-serif",
    lineHeight: "1.9",
    boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
  },
  policyHeading: {
    fontSize: "2rem",
    fontFamily: "'Cormorant Garamond', serif",
    color: "#a3472f", // warm reddish-brown accent
    marginBottom: "1.5rem",
    fontWeight: "600",
    letterSpacing: "0.5px",
  },
  policyList: {
    listStyleType: "disc",
    paddingLeft: "1.5rem",
    fontSize: "1rem",
    color: "#555",
  },
  emailLink: {
    color: "#a3472f",
    textDecoration: "underline",
    fontWeight: "500",
  },

  contactHeading: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
    color: "#333",
  },
  contactInfo: {
    fontSize: "1rem",
    lineHeight: "1.6",
    color: "#444",
  },

  galleryContainer: {
    padding: "60px 40px",
    backgroundColor: "#1a1a1a",
    color: "#fff",
    textAlign: "center",
    fontFamily: "'Open Sans', sans-serif",
  },
  title: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "2.8rem",
    color: "#e63946",
    marginBottom: "30px",
  },

  button: {
    marginTop: "30px",
    backgroundColor: "#e63946",
    color: "#fff",
    border: "none",
    padding: "12px 24px",
    borderRadius: "25px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "bold",
    transition: "background 0.3s ease",
  },
};
const buttonStyle = {
  marginTop: "30px",
  backgroundColor: "#e63946",
  color: "#fff",
  border: "none",
  padding: "12px 24px",
  borderRadius: "25px",
  cursor: "pointer",
  fontSize: "1rem",
  fontWeight: "bold",
  transition: "background 0.3s ease",
};


export default TableReserve;