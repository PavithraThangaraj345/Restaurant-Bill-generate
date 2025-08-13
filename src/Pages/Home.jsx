// src/pages/Home.jsx
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const carouselRef = useRef();
  const navigate = useNavigate();

  const scrollLeft = () => {
    carouselRef.current.scrollBy({ left: -220, behavior: "smooth" });
  };

  const scrollRight = () => {
    carouselRef.current.scrollBy({ left: 220, behavior: "smooth" });
  };

  const handleNavigate = () => {
    navigate("/menu");
  };

  const testimonials = [
    { name: "Virginia", feedback: "Great service and food! Highly recommend." },
    { name: "Arun", feedback: "The private hall booking was smooth and perfect." },
    { name: "Sneha", feedback: "Amazing variety and customer support!" },
    { name: "Ravi", feedback: "I love their catering service and ambiance." },
    { name: "Priya", feedback: "My birthday party was so special thanks to them!" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div style={styles.page}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.overlay}>
          <h1 style={styles.heading}>Discover Restaurant and Food</h1>
          <p style={styles.subtext}>Book your table. Reserve your flavour.</p>
        </div>

        <svg viewBox="0 0 1440 200" style={styles.svg}>
          <path fill="#0d0d0d" d="M0,160 C360,240 1080,80 1440,160 L1440,320 L0,320 Z" />
        </svg>
      </div>

      {/* Carousel */}
      <div style={styles.carouselWrapper}>
        <button onClick={scrollLeft} style={styles.arrowBtn}>&lt;</button>
        <div style={styles.dishScroll} ref={carouselRef}>
          {[1, 2, 3, 1, 2, 3, 1,2,3,1,2,3,1].map((_, i) => (
            <img
              key={i}
              src={`/dish${(i % 3) + 1}.jpeg`}
              alt={`Dish ${i + 1}`}
              style={styles.dish}
            />
          ))}
        </div>
        <button onClick={scrollRight} style={styles.arrowBtn}>&gt;</button>
      </div>

      {/* Popular Recipes */}
      <section style={styles.section}>
        <h2 style={styles.title}>
          Our Best <span style={styles.highlight}>Popular Recipes</span>
        </h2>

        <div style={styles.cardContainer}>
          {["Breakfast", "Lunch", "Dinner"].map((meal, i) => (
            <div key={i} style={styles.card}>
              <img src={`../${meal.toLowerCase()}.jpeg`} alt={meal} style={styles.image} />
              <h3 style={styles.label}>{meal}</h3>
              <button style={styles.arrow} onClick={handleNavigate}>➜</button>
            </div>
          ))}
        </div>

        <button style={styles.orderNow} onClick={handleNavigate}>See more</button>
      </section>

      {/* Testimonials */}
      <section style={styles.testimonialSection}>
        <h2 style={styles.title}>
          <span style={styles.highlight}>Testimonial</span>
        </h2>

        <h3 style={styles.testimonialAuthor}>{testimonials[currentIndex].name}</h3>
        <p style={styles.testimonialText}>{testimonials[currentIndex].feedback}</p>

        <div style={styles.quoteWrap}>
          <span style={styles.quoteMark}>❝</span>
          <div style={styles.testimonialNav}>
            <button
              style={styles.testimonialBtn}
              onClick={() =>
                setCurrentIndex((currentIndex - 1 + testimonials.length) % testimonials.length)
              }
            >
              ⬅
            </button>
            <button
              style={styles.testimonialBtn}
              onClick={() => setCurrentIndex((currentIndex + 1) % testimonials.length)}
            >
              ➡
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

const styles = {
  page: {
    fontFamily: "'Open Sans', sans-serif",
    backgroundColor: "#fcfcfc",
    color: "#fff",
    overflowX: "hidden",
  },
  hero: {
    position: "relative",
    height: "70vh",
    backgroundImage: "url('/hero.jpeg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    clipPath: "ellipse(80% 80% at 48% 10%)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    height: "100%",
    textAlign: "center",
    paddingTop: "140px",
  },
  heading: {
    fontSize: "2.8rem",
    color: "#e63946",
    marginBottom: "10px",
    fontFamily: "'Cormorant Garamond', serif",
  },
  subtext: {
    color: "#ccc",
    fontSize: "1.1rem",
  },
  svg: {
    position: "absolute",
    bottom: "-1px",
    width: "100%",
    height: "200px",
  },
  carouselWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "-100px",
    position: "relative",
    zIndex: 10,
    padding: "0 20px",
  },
  dishScroll: {
    display: "flex",
    overflowX: "auto",
    gap: "20px",
    padding: "20px 0",
    scrollBehavior: "smooth",
    scrollbarWidth: "none",
  },
  dish: {
    width: "200px",
    height: "200px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #e63946",
    flexShrink: 0,
    boxShadow: "0 4px 10px rgba(255, 0, 0, 0.4)",
  },
  arrowBtn: {
    backgroundColor: "#e63946",
    color: "#fff",
    fontSize: "1.5rem",
    padding: "10px 16px",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    zIndex: 20,
  },
  section: {
    padding: "60px 20px",
    backgroundColor: "#fff",
    textAlign: "center",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "40px",
    fontFamily: "'Cormorant Garamond', serif",
    color: "#222",
  },
  highlight: {
    borderBottom: "3px solid orange",
    paddingBottom: "5px",
  },
  cardContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "40px",
    flexWrap: "wrap",
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: "20px",
    boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
    overflow: "hidden",
    width: "280px",
    paddingBottom: "20px",
  },
  image: {
    width: "100%",
    height: "350px",
    objectFit: "cover",
  },
  label: {
    fontSize: "1.1rem",
    fontWeight: "600",
    marginTop: "10px",
    fontFamily: "'Cormorant Garamond', serif",
    color: "#222",
  },
  arrow: {
    marginTop: "10px",
    backgroundColor: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "32px",
    height: "32px",
    fontSize: "1rem",
    cursor: "pointer",
  },
  orderNow: {
    marginTop: "40px",
    padding: "12px 30px",
    fontSize: "1rem",
    borderRadius: "30px",
    backgroundColor: "#facc15",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    color: "#000",
    fontFamily: "'Open Sans', sans-serif",
  },
  testimonialSection: {
    padding: "60px 20px",
    backgroundColor: "#fff",
    textAlign: "center",
    position: "relative",
    color: "#222",
  },
  testimonialAuthor: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginTop: "20px",
    fontFamily: "'Cormorant Garamond', serif",
  },
  testimonialText: {
    maxWidth: "700px",
    margin: "20px auto",
    fontSize: "1rem",
    lineHeight: "1.6",
    color: "#444",
    fontFamily: "'Open Sans', sans-serif",
  },
  quoteWrap: {
    position: "relative",
    marginTop: "30px",
  },
  quoteMark: {
    fontSize: "2rem",
    color: "#4f46e5",
    display: "block",
    marginBottom: "10px",
  },
  testimonialBtn: {
    backgroundColor: "#facc15",
    color: "#000",
    border: "none",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    fontSize: "1rem",
    cursor: "pointer",
    margin: "0 10px",
    fontWeight: "bold",
  },
  testimonialNav: {
    display: "flex",
    justifyContent: "center",
    marginTop: "10px",
  },
};

export default Home;
