import React from "react";

const Footer = () => {
  return (
    <footer style={styles.footer}>
     

      <div style={styles.footerContent}>
        <div style={styles.iconRow}>
          <span>📍</span>
          <span>📞</span>
          <span>✉️</span>
        </div>

        <div style={styles.navLinks}>
          <a href="/" style={styles.link}>Home</a>
          <a href="/about" style={styles.link}>About</a>
          <a href="/blog" style={styles.link}>Blog</a>
          <a href="/testimonial" style={styles.link}>Testimonial</a>
        </div>

        <div style={styles.social}>
          <span>👍</span>
          <span>💬</span>
          <span>🔗</span>
        </div>

        <p style={styles.copy}>
          © 2025 All Rights Reserved | Built with ❤️ by RedSpice
        </p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    position: "relative",
    backgroundColor: "#8B0000",
    color: "#fff",
    overflow: "hidden", // IMPORTANT
    paddingTop: "100px", // Make room for the upward arc
    marginTop: "100px", // Ensure it's pushed below other content
  },
  footerArc: {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "120px",
    zIndex: 1,
  },
  footerContent: {
    textAlign: "center",
    zIndex: 2,
    position: "relative",
  },
  iconRow: {
    display: "flex",
    justifyContent: "center",
    gap: "40px",
    fontSize: "24px",
    marginBottom: "20px",
  },
  navLinks: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "20px",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
  },
  social: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    fontSize: "20px",
    marginBottom: "20px",
  },
  copy: {
    fontSize: "14px",
    color: "#ddd",
  },
};

export default Footer;
