import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from '../axios'; // Correct import path
import { useUser } from '../context/UserContext';

const PartyBooking = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, loading } = useUser();

    // State hooks as before...
    const [visibleCount, setVisibleCount] = useState(9);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        date: "",
        timeSlot: "",
        guests: 1,
    });
    const [billGenerated, setBillGenerated] = useState(false);
    const [estimatedAmount, setEstimatedAmount] = useState(0);
    const [advanceAmount, setAdvanceAmount] = useState(0);
    const [isPaid, setIsPaid] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [eventType, setEventType] = useState("");

    useEffect(() => {
        if (isAuthenticated && user) {
            setFormData(prev => ({
                ...prev,
                name: user.username,
                email: user.email,
            }));
        }
    }, [isAuthenticated, user]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("partySelection")) || [];
        const occasion = stored.find(item => item.category === "Occasion");
        if (occasion) {
            setEventType(occasion.name);
        }
        setSelectedItems(stored);
    }, []);

    const showMore = () => setVisibleCount(12);

    const today = new Date();
    const oneMonthLater = new Date();
    oneMonthLater.setDate(today.getDate() + 30);
    const formatDate = (date) => date.toISOString().split("T")[0];
    const minDate = formatDate(today);
    const maxDate = formatDate(oneMonthLater);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleReserve = (e) => {
        e.preventDefault();
        const baseRate = 500;
        let total = formData.guests * baseRate;
        selectedItems.forEach((item) => {
            if (item.category !== "Occasion") {
                total += item.price;
            }
        });
        setEstimatedAmount(total);
        setBillGenerated(true);
        setIsPaid(false);
    };

    const handleScrollToForm = () => {
        const formElement = document.getElementById("bookingForm");
        if (formElement) {
            formElement.scrollIntoView({ behavior: "smooth" });
        }
    };

    // Corrected function to generate the bill's HTML content
    const generateBillHtml = () => {
        const selectedItemsHtml = selectedItems
            .filter((item) => item.category !== "Occasion")
            .map((item) => `<li><b>${item.name}</b> - ₹${item.price}</li>`)
            .join("");

        return `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #a42021;">Estimated Bill Summary (30% Advance)</h2>
                <p><strong>Name:</strong> ${formData.name}</p>
                <p><strong>Email:</strong> ${formData.email}</p>
                <p><strong>Date:</strong> ${formData.date}</p>
                <p><strong>Slot:</strong> ${formData.timeSlot}</p>
                <p><strong>Guests:</strong> ${formData.guests}</p>
                <p><strong>Occasion:</strong> ${eventType || 'Not specified'}</p>
                ${selectedItems.length > 0 ? `<p><strong>Add-ons Selected:</strong></p><ul>${selectedItemsHtml}</ul>` : ""}
                <p><strong>Total Cost:</strong> ₹${estimatedAmount}</p>
                <p style="color: #a42021; font-weight: bold;">
                    Advance to Pay Now (30%): ₹${Math.round(estimatedAmount * 0.3)}
                </p>
                <p style="color: #555;">
                    Remaining (70%) to be paid at the restaurant: ₹${Math.round(estimatedAmount * 0.7)}
                </p>
            </div>
        `;
    };

    const handlePayNow = async () => {
        if (!user || !user.email) {
            alert("You must be logged in with a valid email to make a party hall booking.");
            navigate("/signin");
            return;
        }

        try {
            const token = localStorage.getItem('token'); // Get the token from local storage
            if (!token) {
                alert("You must be logged in to make a booking.");
                navigate("/signin");
                return;
            }

            const payload = {
                name: user.username,
                email: user.email,
                date: formData.date,
                timeSlot: formData.timeSlot,
                guests: formData.guests,
                amount: estimatedAmount,
                paymentStatus: "Advance Paid",
                selectedItems: selectedItems,
            };

            await axios.post("/partybookings", payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert("Party booking successful! A confirmation email with your bill has been sent.");
            setIsPaid(true);
            navigate("/mybooking");

        } catch (err) {
            console.error("Party booking failed:", err.response.data || err.message);
            alert(`Something went wrong: ${err.response.data.msg || 'Please try again.'}`);
        }
    };

    // The handleDownload function is now uncommented and available
    const handleDownload = () => {
        const bill = document.getElementById("billContent");
        const newWindow = window.open();
        newWindow.document.write(`<html><head><title>Party Booking Bill</title></head><body>${bill.innerHTML}</body></html>`);
        newWindow.document.close();
        newWindow.print();
    };

    if (loading) {
        return <div>Loading user data...</div>;
    }

    const partyImages = [
        "party1.jpg", "party2.jpg", "party3.jpg",
        "party4.jpg", "party5.jpg", "party6.jpg",
        "party7.jpg", "party8.jpg", "party9.jpg",
        "party10.jpg", "party11.jpg", "party12.jpg"
    ];

    return (
        <>
            <div style={styles.heroSection}>
                <div style={styles.heroOverlay}>
                    <h1 style={styles.heroTitle}>Book Your Dream Party Hall</h1>
                    <p style={styles.heroSubtitle}>Celebrate your special moments in style – hassle-free reservations now available!</p>
                    <button onClick={handleScrollToForm} style={styles.heroButton}>Book Now ↓</button>
                </div>
            </div>

            <div style={styles.container}>
                <div style={styles.partyIntro} id="bookingForm">
                    <p style={styles.partyLabel}>ELEGANT AND CELEBRATORY</p>
                    <h2 style={styles.partyHeading}>Party Hall Booking</h2>
                    <p style={styles.partySubheading}>
                        Host unforgettable celebrations in our beautifully designed party halls, perfect for any occasion.
                    </p>
                </div>

                <button
                    style={styles.menuButton}
                    onClick={() => navigate("/menu2")}
                    onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                >
                    Select Food & Facilities
                </button>

                <form style={styles.form} onSubmit={handleReserve}>
                    <input type="text" name="name" placeholder="Your Name" required style={styles.input} value={formData.name} onChange={handleChange} />
                    <input type="email" name="email" placeholder="Email Address" required style={styles.input} value={formData.email} onChange={handleChange} />
                    <select
                        name="eventType"
                        style={styles.input}
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        required
                    >
                        <option value="">-- Select Event Type --</option>
                        <option>Birthday Party</option>
                        <option>Anniversary Celebration</option>
                        <option>Engagement Function</option>
                        <option>Corporate Get-Together</option>
                        <option>Baby Shower</option>
                        <option>Farewell Party</option>
                        <option>Reunion Celebration</option>
                        <option>Festival Gathering</option>
                    </select>

                    <input type="date" name="date" required min={minDate} max={maxDate} style={styles.input} onChange={handleChange} />
                    <select name="timeSlot" required style={styles.input} onChange={handleChange}>
                        <option value="">-- Select Time Slot --</option>
                        <option>Morning (9 AM - 12 PM)</option>
                        <option>Afternoon (1 PM - 4 PM)</option>
                        <option>Evening (6 PM - 9 PM)</option>
                    </select>
                    <input type="number" name="guests" required min="1" max="100" placeholder="Number of Guests" style={styles.input} onChange={handleChange} />
                    <button type="submit" style={styles.button}>Book Now</button>
                </form>

                {billGenerated && !isPaid && (
                    <div style={styles.billBox} id="billContent">
                        <h3>Estimated Bill Summary (30% Advance)</h3>
                        <p><strong>Name:</strong> {formData.name}</p>
                        <p><strong>Email:</strong> {formData.email}</p>
                        <p><strong>Date:</strong> {formData.date}</p>
                        <p><strong>Slot:</strong> {formData.timeSlot}</p>
                        <p><strong>Guests:</strong> {formData.guests}</p>
                        <p><strong>Occasion:</strong> {eventType || 'Not specified'}</p>

                        {selectedItems.length > 0 && (
                            <>
                                <p><strong>Add-ons Selected:</strong></p>
                                <ul>
                                    {selectedItems
                                        .filter((item) => item.category !== "Occasion")
                                        .map((item) => (
                                            <li key={item.id}>{item.name} - ₹{item.price}</li>
                                        ))}
                                </ul>
                            </>
                        )}

                        <p><strong>Total Cost:</strong> ₹{estimatedAmount}</p>
                        <p style={{ color: "#a42021", fontWeight: "bold" }}>
                            Advance to Pay Now (30%): ₹{Math.round(estimatedAmount * 0.3)}
                        </p>
                        <p style={{ color: "#555" }}>
                            Remaining (70%) to be paid at the restaurant: ₹{Math.round(estimatedAmount * 0.7)}
                        </p>

                        <button style={styles.downloadButton} onClick={handleDownload}>Download Bill</button>
                        <button style={styles.payButton} onClick={handlePayNow}>
                            Pay Advance & Confirm
                        </button>
                    </div>
                )}

                {isPaid && (
                    <div style={styles.billBox}>
                        <h4>✅ Payment Successful!</h4>
                        <p>Thank you, {formData.name}. Your party hall booking is confirmed.</p>
                        <p>Confirmation sent to <strong>{formData.email}</strong></p>
                    </div>
                )}
            </div>

            <div style={styles.infoGrid}>
                <div style={styles.infoText}>
                    <h2 style={styles.infoHeading}>About Party Hall Booking</h2>
                    <p style={styles.infoPara}>
                        Celebrate birthdays, anniversaries, reunions, and more in our lively and well-decorated party halls.
                    </p>
                    <ul style={styles.infoList}>
                        <li>Reserve <strong>at least 3 days in advance</strong> for best availability.</li>
                        <li>Choose your <strong>event type</strong>, food packages, music, and add-ons.</li>
                        <li>Booking duration is <strong>4 hours</strong>.</li>
                        <li>Accommodates up to <strong>100 guests</strong>.</li>
                        <li><strong style={{ color: "#a42021" }}>30% advance payment</strong> required to confirm booking.</li>
                        <li><strong style={{ color: "#a42021" }}>70% balance</strong> to be paid at the restaurant on the day of the event.</li>
                        <li>Get confirmation via email after successful advance payment.</li>
                    </ul>
                    <h3 style={styles.contactHeading}>Need Help?</h3>
                    <p style={styles.contactInfo}>
                        📞 <strong>Party Coordinator:</strong> +91 91234 56789 <br />
                        🕒 <strong>Hours:</strong> 10 AM – 8 PM (Mon–Sat)
                    </p>
                </div>

                <div style={styles.infoPolicy}>
                    <h3 style={styles.policyHeading}>Party Hall Refund & Cancellation Policy</h3>
                    <ul style={styles.policyList}>
                        <li><strong>100% refund</strong> of advance for cancellations made <strong>72 hours</strong> in advance.</li>
                        <li><strong>50% refund</strong> of advance for cancellations made <strong>24–72 hours</strong> before the event.</li>
                        <li><strong>No refund</strong> within <strong>24 hours</strong> of the event.</li>
                        <li>Reschedule allowed <strong>once</strong> with <strong>48+ hours</strong> notice.</li>
                        <li>Contact: <a href="mailto:partybookings@yourrestaurant.com" style={styles.emailLink}>partybookings@yourrestaurant.com</a></li>
                        <li>Refunds processed in <strong>5–7 business days</strong>.</li>
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
                <h2 className="gallery-title">Party Hall Moments</h2>
                <div className="gallery-grid">
                    {partyImages.slice(0, visibleCount).map((img, idx) => (
                        <div className="gallery-card" key={idx}>
                            <img src={`/images/${img}`} alt={`party-${idx + 1}`} />
                            <div className="gallery-overlay">
                                <a href="/menu2">View Menu</a>
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
    heroButton: {
        padding: "0.8rem 1.5rem",
        fontSize: "1rem",
        backgroundColor: "#a42021",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    container: {
        maxWidth: "700px",
        margin: "auto",
        padding: "2rem",
    },
    partyIntro: {
        textAlign: "center",
        marginBottom: "3rem",
    },
    partyLabel: {
        fontSize: "0.8rem",
        color: "#999",
        letterSpacing: "2px",
        textTransform: "uppercase",
        fontWeight: "500",
        marginBottom: "0.5rem",
        fontFamily: "'Poppins', sans-serif",
    },
    partyHeading: {
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "66px",
        fontWeight: "700",
        marginBottom: "20px",
    },
    partySubheading: {
        fontSize: "1.1rem",
        color: "#666",
        maxWidth: "700px",
        margin: "0 auto",
        lineHeight: "1.6",
        fontFamily: "'Poppins', sans-serif",
    },
    heading: {
        fontSize: "2.5rem",
        fontWeight: "bold",
        marginBottom: "1rem",
        textAlign: "center",
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
        gap: "2rem",
        marginTop: "4rem",
        padding: "2rem 0",
        alignItems: "start",
        width: "90%",
        margin: "0 auto",
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

export default PartyBooking;