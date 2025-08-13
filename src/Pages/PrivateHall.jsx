import { useState, useRef, useEffect } from "react";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";
import api from "../axios";
import { useUser } from "../context/UserContext";

const PrivateHallBooking = () => {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const { user, isAuthenticated, loading } = useUser();

  const [visibleCount, setVisibleCount] = useState(9);
  const showMore = () => setVisibleCount(12);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    time: "",
    guests: 10,
    eventType: "",
  });

  const [selectedItems, setSelectedItems] = useState([]);
  const [billGenerated, setBillGenerated] = useState(false);
  const [estimatedAmount, setEstimatedAmount] = useState(0);
  const [advanceAmount, setAdvanceAmount] = useState(0);
  const [balanceAmount, setBalanceAmount] = useState(0);
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    // Load pre-selected items from localStorage
    const stored = JSON.parse(localStorage.getItem("privateHallSelection")) || [];
    setSelectedItems(stored);

    const occasion = stored.find((item) => item.category === "Occasion");
    if (occasion) {
      setFormData((prev) => ({ ...prev, eventType: occasion.name }));
    }

    // Load user data if authenticated
    if (isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        name: user.username || user.name,
        email: user.email,
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
    doc.text("Private Hall Booking Confirmation", 20, 20);
    doc.setFontSize(12);
    doc.text(`Name: ${bookingData.name}`, 20, 40);
    doc.text(`Email: ${bookingData.email}`, 20, 50);
    doc.text(`Date: ${bookingData.date}`, 20, 60);
    doc.text(`Time: ${bookingData.time}`, 20, 70);
    doc.text(`Guests: ${bookingData.guests}`, 20, 80);
    doc.text(`Event Type: ${bookingData.eventType}`, 20, 90);
    let y = 100;
    bookingData.selectedItems.forEach((item) => {
      doc.text(`${item.name} - ₹${item.price}`, 20, y);
      y += 10;
    });
    doc.text(`Total: ₹${bookingData.amount}`, 20, y);
    y += 10;
    doc.text(`Advance: ₹${bookingData.advanceAmount}`, 20, y);
    y += 10;
    doc.text(`Balance: ₹${bookingData.balanceAmount}`, 20, y);
    doc.save("PrivateHallBooking.pdf");
  };

  const handleReserve = (e) => {
    e.preventDefault();
    let total = formData.guests * 700;
    selectedItems.forEach((item) => {
      if (item.category !== "Occasion") {
        total += item.price;
      }
    });
    const advance = Math.round(total * 0.4);
    setEstimatedAmount(total);
    setAdvanceAmount(advance);
    setBalanceAmount(total - advance);
    setBillGenerated(true);
  };

  const handlePayNow = async () => {
    if (!user || !user.email) {
      alert("You must be logged in to make a private hall booking.");
      navigate("/signin");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: user.phone || '',
        date: formData.date,
        time: formData.time,
        guests: formData.guests,
        eventType: formData.eventType,
        amount: estimatedAmount,
        advanceAmount: advanceAmount,
        balanceAmount: balanceAmount,
        paymentStatus: "Advance Paid (Pending Confirmation)",
        selectedItems: selectedItems,
      };

      await api.post("/privatehallbookings", payload);

      // Update the alert message to reflect the new workflow
      alert("Booking successful! Your request is pending admin confirmation. We will notify you via email shortly.");
      setIsPaid(true);
      navigate("/mybooking");
    } catch (error) {
      console.error("❌ Booking failed:", error);
      alert("Something went wrong with the booking. Please try again.");
    }
  };

  const privateImages = [
    "private1.jpg", "private2.jpg", "private3.jpg",
    "private4.jpg", "private5.jpg", "private6.jpg",
    "private7.jpg", "private8.jpg", "private9.jpg",
    "private10.jpg", "private11.jpg", "private12.jpg"
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div style={{ ...styles.heroSection, backgroundImage: "url('/privatehall.jpeg')" }}>
        <div style={styles.heroOverlay}>
          <h1 style={styles.heroTitle}>Book Our Private Hall</h1>
          <p style={styles.heroSubtitle}>Exclusive space for your premium celebrations</p>
          <button onClick={() => formRef.current.scrollIntoView({ behavior: "smooth" })} style={styles.heroButton}>Book Now ↓</button>
        </div>
      </div>

      <div style={styles.reserveIntro} ref={formRef}>
        <p style={styles.reserveLabel}>LUXURY & PRIVACY</p>
        <h2 style={styles.reserveHeading}>Private Hall Reservation</h2>
        <p style={styles.reserveSubheading}>Reserve our private hall for exclusive events with tailored menus and private service.</p>
      </div>

      <button
        style={styles.menuButton}
        onClick={() => navigate("/menu3")}
        onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
      >
        Our menu
      </button>

      <div style={styles.container}>
        <form style={styles.form} onSubmit={handleReserve}>
          <input type="text" name="name" placeholder="Your Name" style={styles.input} onChange={handleChange} value={formData.name} required />
          <input type="email" name="email" placeholder="Email Address" style={styles.input} value={formData.email} onChange={handleChange} required />
          <input type="date" name="date" style={styles.input} onChange={handleChange} min={minDate} max={maxDate} required />
          <input type="time" name="time" style={styles.input} onChange={handleChange} required />
          <input type="number" name="guests" min="10" max="25" placeholder="No. of Guests" style={styles.input} onChange={handleChange} required />

          <select name="eventType" style={styles.input} onChange={handleChange} required value={formData.eventType}>
            <option value="">-- Select Event Type --</option>
            <option>Private Dinner</option>
            <option>Business Meeting</option>
            <option>Family Gathering</option>
            <option>Client Presentation</option>
            <option>Small Workshop</option>
            <option>Confidential Interview</option>
            <option>Birthday (Private Setup)</option>
            <option>Romantic Proposal</option>
          </select>
          <button type="submit" style={styles.button}>Get Estimate</button>
        </form>

        {billGenerated && !isPaid && (
          <div style={styles.billBox} id="billContent">
            <h3>Estimated Bill</h3>
            <p><strong>Name:</strong> {formData.name}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Date:</strong> {formData.date}</p>
            <p><strong>Slot:</strong> {formData.time}</p>
            <p><strong>Guests:</strong> {formData.guests}</p>
            <p><strong>Occasion:</strong> {formData.eventType}</p>

            <ul>
              {selectedItems.map((item, idx) => (
                <li key={idx}>{item.name} - ₹{item.price}</li>
              ))}
            </ul>

            <p><strong>Total: ₹{estimatedAmount}</strong></p>
            <p style={{ color: "#a42021", fontWeight: "bold" }}>Advance (40%): ₹{advanceAmount}</p>
            <p style={{ color: "#555" }}>Balance to pay at venue: ₹{balanceAmount}</p>
            <button style={styles.downloadButton} onClick={() => generateAndDownloadPDF({ ...formData, amount: estimatedAmount, advanceAmount, balanceAmount, selectedItems })}>Download Bill PDF</button>
            <button style={styles.payButton} onClick={handlePayNow}>Pay Now</button>
          </div>
        )}

        {isPaid && (
          <div style={styles.billBox}>
            <h4>✅ Booking Confirmed!</h4>
            <p>Thank you, {formData.name}. Your private hall booking is confirmed.</p>
            <p>Details have been emailed to <strong>{formData.email}</strong>.</p>
            <button style={styles.downloadButton} onClick={() => generateAndDownloadPDF({ ...formData, amount: estimatedAmount, advanceAmount, balanceAmount, selectedItems })}>Download Booking PDF</button>
          </div>
        )}
      </div>

      <div style={styles.infoGrid}>
        <div style={styles.infoText}>
          <h2 style={styles.infoHeading}>About Private Hall Booking</h2>
          <p style={styles.infoPara}>
            Host business meetings, private dinners, or small intimate gatherings in a calm, exclusive space with personalized service.
          </p>
          <ul style={styles.infoList}>
            <li>Book <strong>at least 2 days in advance</strong> to ensure availability.</li>
            <li>Select <strong>purpose</strong>, meal options, seating arrangement, and amenities.</li>
            <li>Booking duration is <strong>2–3 hours</strong> depending on the package.</li>
            <li>Ideal for <strong>up to 25 guests</strong>.</li>
            <li>Email confirmation sent after booking and successful payment.</li>
          </ul>
          <h3 style={styles.contactHeading}>Have Questions?</h3>
          <p style={styles.contactInfo}>
            📞 <strong>Private Event Manager:</strong> +91 98765 43210 <br />
            🕒 <strong>Hours:</strong> 9 AM – 7 PM (Mon–Sat)
          </p>
        </div>

        <div style={styles.infoPolicy}>
          <h3 style={styles.policyHeading}>Private Hall Refund & Reschedule Policy</h3>
          <ul style={styles.policyList}>
            <li><strong>100% refund</strong> for cancellations <strong>48+ hours</strong> in advance.</li>
            <li><strong>30% refund</strong> for cancellations made <strong>24–48 hours</strong> prior.</li>
            <li><strong>No refund</strong> if cancelled within <strong>24 hours</strong>.</li>
            <li><strong>Rescheduling allowed</strong> once with a <strong>48-hour</strong> notice.</li>
            <li>Contact: <a href="mailto:privatehall@yourrestaurant.com" style={styles.emailLink}>privatehall@yourrestaurant.com</a></li>
            <li>Refunds issued within <strong>5 business days</strong>.</li>
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
            height: 250px;
            overflow: hidden;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
          }
          .gallery-card img {
            width: 100%;
            height: 250px;
            object-fit: cover;
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
            color: #fff;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 12px;
            font-size: 1rem;
            font-family: 'Poppins', sans-serif;
            letter-spacing: 1px;
            word-spacing: 2px;
          }
          .gallery-button {
            margin-top: 30px;
            background-color: #e63946;
            color: #fff;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: bold;
            transition: background 0.3s ease;
          }
        `}
            </style>
      <div className="gallery-container">
        <h2 className="gallery-title">Elite Celebrations</h2>
        <div className="gallery-grid">
          {privateImages.slice(0, visibleCount).map((img, idx) => (
            <div className="gallery-card" key={idx}>
              <img src={`/images/${img}`} alt={`private-${idx + 1}`} />
              <div className="gallery-overlay">
                <a href="/menu3">View Menu</a>
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
const styles = {
  //... Your original styles object
  heroSection: {
    width: "100vw",
    height: "100vh",
    backgroundImage: "url('/privatehall.jpeg')",
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
};

export default PrivateHallBooking;