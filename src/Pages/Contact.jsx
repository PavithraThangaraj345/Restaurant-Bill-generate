import React, { useRef, useState } from 'react';

const Contact = () => {
    const contactRef = useRef(null);
    const [userName] = useState("Guest");
    const [userEmail] = useState("guest@example.com");



    const styles = {
        heroSection: {
            width: "100vw",
            height: "100vh",
            backgroundImage: "url('/gallery.jpg')",
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
            padding: "12px 28px",
            backgroundColor: "#ba3b46",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            cursor: "pointer",
        },
        container: {
            display: 'flex',
            flexWrap: 'wrap',
            padding: '60px 40px',
            backgroundColor: '#fdfbf7',
            fontFamily: "'Open Sans', sans-serif",
            color: '#2c2c2c',
            justifyContent: 'space-between',
        },
        left: {
            flex: '1',
            minWidth: '200px',
            paddingRight: '30px',
            marginLeft: '100px',
        },
        right: {
            flex: '1',
            minWidth: '200px',
        },
        heading: {
            fontSize: '48px',
            fontWeight: '700',
            marginBottom: '20px',
            color: '#1c1c1c',
            fontFamily: "'Cormorant Garamond', serif",
        },
        paragraph: {
            color: '#707070',
            fontSize: '16px',
            lineHeight: '1.6',
            marginBottom: '30px',
        },
        label: {
            fontWeight: '600',
            fontSize: '14px',
            marginTop: '10px',
            color: '#3a3a3a',
        },
        value: {
            color: '#555',
            fontSize: '15px',
            marginBottom: '10px',
        },
        icons: {
            display: 'flex',
            gap: '10px',
            marginTop: '15px',
        },
        icon: {
            textDecoration: 'none',
            color: '#2c2c2c',
            fontSize: '18px',
        },
        map: {
            border: 'none',
            width: '100%',
            height: '400px',
            borderRadius: '10px',
        },
        whatsappBtn: {
            backgroundColor: "#25D366",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            fontWeight: "bold",
            marginTop: "15px",
            cursor: "pointer",
        },
    };

    const handleWhatsApp = () => {
        const message = `🌿 *Savory Contact Request*%0A%0A*Name:* ${userName}%0A*Email:* ${userEmail}%0A%0AI would like to connect with you.`;
        const whatsappLink = `https://wa.me/918428903678?text=${encodeURIComponent(message)}`;
        window.open(whatsappLink, "_blank");
    };

    const handleEmail = () => {
        const subject = "Contact Query from Savory Website";
        const body = `Hi Savory,%0A%0AI would like to know more about your services.%0A%0ARegards,%0A${userName} (${userEmail})`;
        const mailLink = `mailto:pavithrathangaraj568@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
        window.open(mailLink, "_blank");
    };


    return (
        <>
            {/* HERO SECTION */}
            <div style={styles.heroSection}>
                <div style={styles.heroOverlay}>
                    <h1 style={styles.heroTitle}>Get in Touch With Us</h1>
                    <p style={styles.heroSubtitle}>
                        We'd love to hear from you — for bookings, queries, or just a hello!
                    </p>
                    <button
                        onClick={() => contactRef.current.scrollIntoView({ behavior: "smooth" })}
                        style={styles.heroButton}
                    >
                        Contact Us ↓
                    </button>
                </div>
            </div>

            {/* CONTACT DETAILS */}
            <div ref={contactRef} style={styles.container}>
                <div style={styles.left}>
                    <h2 style={styles.heading}>Contact Us</h2>
                    <p style={styles.paragraph}>
                        We'd love to hear from you — reach out with any questions, feedback, or booking inquiries.
                    </p>

                    <div>
                        <div style={styles.label}>PHONE</div>
                        <div style={styles.value}>+91 98765 43218</div>

                        <button
                            style={{
                                ...styles.whatsappBtn,
                                backgroundColor: "#D44638",
                                marginTop: "10px",
                            }}
                            onClick={handleEmail}
                        >
                            Email Us
                        </button>


                        <div style={styles.label}>WHATSAPP</div>
                        <button style={styles.whatsappBtn} onClick={handleWhatsApp}>
                            WhatsApp us
                        </button>

                        <div style={styles.label}>ADDRESS</div>
                        <div style={styles.value}>Hudson 487, New York</div>

                        <div style={styles.label}>FOLLOW</div>
                        <div style={styles.icons}>
                            <a href="#" style={styles.icon}><i className="fab fa-vimeo-v" /></a>
                            <a href="#" style={styles.icon}><i className="fab fa-instagram" /></a>
                            <a href="#" style={styles.icon}><i className="fab fa-twitter" /></a>
                            <a href="#" style={styles.icon}><i className="fab fa-facebook-f" /></a>
                        </div>
                    </div>
                </div>

                <div style={styles.right}>
                    <iframe
                        title="Savory Map"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.856235166478!2d-73.93414688459443!3d40.662336979337746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDM5JzQ0LjQiTiA3M8KwNTUnNDEuMCJX!5e0!3m2!1sen!2sus!4v1615334703094!5m2!1sen!2sus"
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        style={styles.map}
                    ></iframe>
                </div>
            </div>
        </>
    );
};

export default Contact;
