// src/components/EventHallBooking.jsx

import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios";
import jsPDF from "jspdf";
import { useUser } from "../context/UserContext";

const EventHallBooking = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "",
    occasion: "",
    message: "",
  });

  const { user, isAuthenticated, loading } = useUser();
  const [billGenerated, setBillGenerated] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isPaid, setIsPaid] = useState(false);
  const [estimatedAmount, setEstimatedAmount] = useState(0);
  const [advanceAmount, setAdvanceAmount] = useState(0);
  const [balanceAmount, setBalanceAmount] = useState(0);
  const formRef = useRef(null);
  const navigate = useNavigate();

  const [visibleCount, setVisibleCount] = useState(9);
  const showMore = () => setVisibleCount(12);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("eventSelection")) || [];
    setSelectedItems(stored);

    const eventItem = stored.find((item) => item.category === "Event");
    if (eventItem) {
      setFormData((prev) => ({ ...prev, occasion: eventItem.name }));
    }

    if (isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        name: user.username || user.name,
        email: user.email,
        phone: user.phone || ""
      }));
    }
  }, [isAuthenticated, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + 30);
  const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const minDate = formatDate(today);
  const maxDate = formatDate(futureDate);

  const generateAndDownloadPDF = (bookingData) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Event Hall Booking Confirmation", 20, 20);
    doc.setFontSize(12);
    doc.text(`Name: ${bookingData.name}`, 20, 40);
    doc.text(`Email: ${bookingData.email}`, 20, 50);
    doc.text(`Phone: ${bookingData.phone}`, 20, 60);
    doc.text(`Date: ${bookingData.date}`, 20, 70);
    doc.text(`Time: ${bookingData.time}`, 20, 80);
    doc.text(`Event Type: ${bookingData.occasion}`, 20, 90);
    doc.text(`Guests: ${bookingData.guests}`, 20, 100);
    doc.text(`Requests: ${bookingData.message || "None"}`, 20, 110);

    let y = 120;
    doc.text("Selected Items:", 20, y);
    y += 10;
    bookingData.selectedItems.forEach((item) => {
      doc.text(`- ${item.name} - ₹${item.price}`, 20, y);
      y += 10;
    });

    y += 10;
    doc.text(`Total Amount: ₹${bookingData.amount}.00`, 20, y);
    y += 10;
    doc.text(`Advance Paid: ₹${bookingData.advanceAmount}.00`, 20, y);
    y += 10;
    doc.text(`Balance Due: ₹${bookingData.balanceAmount}.00`, 20, y);

    doc.save("EventHallBooking.pdf");
  };

  // The new function to generate the bill
  const handleGenerateBill = (e) => {
    e.preventDefault();
    if (selectedItems.length === 0) {
      alert("Please select items for your event before generating the bill.");
      return;
    }

    const totalAmount = selectedItems.reduce((acc, item) => acc + item.price, 0);
    const advance = totalAmount * 0.4;
    const balance = totalAmount - advance;

    setEstimatedAmount(totalAmount);
    setAdvanceAmount(advance);
    setBalanceAmount(balance);
    setBillGenerated(true);
  };

  const handlePayNow = async () => {
    if (!user || !user.email) {
      alert("You must be logged in to make an event booking.");
      navigate("/signin");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        date: formData.date,
        time: formData.time,
        guests: formData.guests,
        occasion: formData.occasion,
        message: formData.message,
        amount: estimatedAmount,
        advanceAmount: advanceAmount,
        balanceAmount: balanceAmount,
        paymentStatus: "Advance Paid",
        selectedItems: selectedItems,
      };

      await api.post("/eventbookings", payload);

      alert("Event hall booking submitted! A confirmation will be sent after admin approval.");
      setIsPaid(true);
      navigate("/mybooking");
    } catch (error) {
      console.error("❌ Booking failed:", error);
      alert("Something went wrong with the booking. Please try again.");
    }
  };


  const eventImages = [
    "event1.jpg", "event2.jpg", "event3.jpg",
    "event4.jpg", "event5.jpg", "event6.jpg",
    "event7.jpg", "event8.jpg", "event9.jpg",
    "event10.jpg", "event11.jpg", "event12.jpg"
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div style={{ ...styles.heroSection }}>
        <div style={styles.heroOverlay}>
          <h1 style={styles.heroTitle}>Book Our Event Hall</h1>
          <p style={styles.heroSubtitle}>Perfect for concerts, shows, and large gatherings</p>
          <button onClick={() => formRef.current.scrollIntoView({ behavior: "smooth" })} style={styles.heroButton}>Book Now ↓</button>
        </div>
      </div>

      <div style={styles.reserveIntro} ref={formRef}>
        <p style={styles.reserveLabel}>ENERGY & ENTERTAINMENT</p>
        <h2 style={styles.reserveHeading}>Event Hall Reservation</h2>
        <p style={styles.reserveSubheading}>Host unforgettable experiences in our fully equipped event hall tailored for live audiences and performances.</p>
      </div>

      <div style={styles.container}>
        <button
          style={styles.menuButton}
          onClick={() => navigate("/menu4")}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
          Our menu
        </button>
        <form style={styles.form} onSubmit={handleGenerateBill}>
          <input style={styles.input} type="text" name="name" placeholder="Full Name" onChange={handleChange} value={formData.name} required />
          <input style={styles.input} type="email" name="email" placeholder="Email Address" onChange={handleChange} value={formData.email} required />
          <input style={styles.input} type="tel" name="phone" placeholder="Phone Number" onChange={handleChange} value={formData.phone} required />
          <input style={styles.input} type="date" name="date" onChange={handleChange} min={minDate} max={maxDate} required />

          <div style={styles.slotContainer}>
            {[
              "10:00 AM - 12:00 PM",
              "12:30 PM - 2:30 PM",
              "3:00 PM - 6:00 PM",
              "6:00 PM - 8:00 PM",
              "6:30 PM - 10:30 PM"
            ].map((slot) => (
              <button
                key={slot}
                type="button"
                style={{
                  ...styles.slotButton,
                  backgroundColor: formData.time === slot ? "#a42021" : "#f0f0f0",
                  color: formData.time === slot ? "#fff" : "#333",
                }}
                onClick={() => handleChange({ target: { name: "time", value: slot } })}
              >
                {slot}
              </button>
            ))}
          </div>

          <input type="number" name="guests" min="10" max="1000" placeholder="No. of Guests" style={styles.input} onChange={handleChange} required />

          <select name="occasion" style={styles.input} value={formData.occasion} onChange={handleChange} required>
            <option value="">-- Select Event Type --</option>
            <option>Music Concert</option>
            <option>Cultural Night</option>
            <option>Tech Fest</option>
            <option>Corporate Expo</option>
            <option>Comedy Show</option>
            <option>Award Ceremony</option>
          </select>

          <textarea name="message" style={styles.textarea} placeholder="Additional Message (optional)" onChange={handleChange}></textarea>

          <button style={styles.button} type="submit">Generate Estimated Bill</button>
        </form>

        {billGenerated && !isPaid && (
          <div style={styles.billBox} id="billContent">
            <h3>Estimated Bill</h3>
            <p><strong>Name:</strong> {formData.name}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Date:</strong> {formData.date}</p>
            <p><strong>Time:</strong> {formData.time}</p>
            <p><strong>Guests:</strong> {formData.guests}</p>
            <p><strong>Occasion:</strong> {formData.occasion}</p>

            <ul>
              {selectedItems.map((item, idx) => (
                <li key={idx}>{item.name} - ₹{item.price}</li>
              ))}
            </ul>

            <p><strong>Total:</strong> ₹{estimatedAmount}</p>
            <p style={{ color: "#a42021", fontWeight: "bold" }}>Advance (40%):₹{advanceAmount}</p>
            <p style={{ color: "#555" }}>Balance at Venue: ₹{balanceAmount}</p>

            <button style={styles.downloadButton} onClick={() => generateAndDownloadPDF({ ...formData, amount: estimatedAmount, advanceAmount, balanceAmount, selectedItems })}>
              Download Bill PDF
            </button>
            <button style={styles.payButton} onClick={handlePayNow}>
              Pay Now
            </button>
          </div>
        )}

        {isPaid && (
          <div style={styles.billBox}>
            <h4>✅ Booking Submitted!</h4>
            <p>Thank you, {formData.name}. Your booking request is being reviewed.</p>
            <p>A confirmation email will be sent to <strong>{formData.email}</strong> once approved.</p>
          </div>
        )}
      </div>

      <div style={styles.infoGrid}>
        {/* About Event Hall Section */}
        <div style={styles.infoText}>
          <h2 style={styles.infoHeading}>About Event Hall</h2>
          <ul style={styles.policyList}>
            <li>Reserve <strong>at least 10 days</strong> in advance.</li>
            <li>Capacity: <strong>up to 1000 guests</strong>.</li>
            <li>Customizable stage, lighting, seating & branding allowed.</li>
            <li>All setup & guest info must be submitted 5 days prior.</li>
            <li>Security, cleaning & tech support provided on event day.</li>
            <li>No third-party food or equipment allowed without approval.</li>
          </ul>
        </div>

        {/* Refund & Cancellation Policy */}
        <div style={styles.infoPolicy}>
          <h3 style={styles.policyHeading}>Refund & Cancellation Policy</h3>
          <ul style={styles.policyList}>
            <li><strong>100% refund</strong> if cancelled before 7 days.</li>
            <li><strong>50% refund</strong> if cancelled between 3–7 days.</li>
            <li><strong>No refund</strong> within 72 hours of event.</li>
            <li><strong>One-time rescheduling</strong> allowed 5+ days prior.</li>
            <li>Email: <a href="mailto:eventhall@yourrestaurant.com" style={styles.emailLink}>eventhall@yourrestaurant.com</a></li>
          </ul>
        </div>
      </div>

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

      <div className="gallery-container">
        <h2 className="gallery-title">Event Hall Showcase</h2>
        <div className="gallery-grid">
          {eventImages.slice(0, visibleCount).map((img, idx) => (
            <div className="gallery-card" key={idx}>
              <img src={`/images/${img}`} alt={`event-${idx + 1}`} />
              <div className="gallery-overlay">
                <a href="/menu4">View Menu</a>
              </div>
            </div>
          ))}
        </div>
        {visibleCount < 12 && (
          <button onClick={showMore} className="gallery-button">
            Show More
          </button>
        )}
      </div>
    </>
  );
};

// Styles for the component...
const styles = {
  heroSection: {
    width: "100vw",
    height: "100vh",
    backgroundImage: "url('/eventhall1.jpeg')",
    backgroundSize: "cover",
    backgroundAttachment: "fixed",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
    imageRendering: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    filter: "none",
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
  slotContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "1rem",
  },
  slotButton: {
    padding: "10px 20px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    cursor: "pointer",
    fontWeight: "500",
  },
  button: {
    padding: "0.9rem",
    backgroundColor: "#a42021",
    color: "#fff",
    border: "none",
    fontWeight: "bold",
    borderRadius: "5px",
  },
  billBox: {
    marginTop: "2rem",
    padding: "1rem",
    border: "1px dashed #aaa",
    borderRadius: "6px",
    backgroundColor: "#f5f5f5",
  },
  downloadButton: {
    marginTop: "1rem",
    padding: "0.6rem 1.5rem",
    backgroundColor: "#444",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    marginRight: "1rem",
  },
  payButton: {
    padding: "0.6rem 1.5rem",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
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
    backgroundColor: "#fdf8f4",
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
    color: "#a3472f",
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
};

export default EventHallBooking;