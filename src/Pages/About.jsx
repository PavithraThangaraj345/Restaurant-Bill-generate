import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import chefImg from "/public/about1.jpg"; 
import foodImg from "/public/about2.jpg"; 
import stoneImg from "/public/stone.jpg"; 


const About = () => {
  const navigate = useNavigate();

  const chefs = [
  {
    name: "GARY BROOKS",
    role: "CHEF",
    desc: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.",
    image: "/chef2.jpg",
  },
  {
    name: "JOE THOMAS",
    role: "CHEF",
    desc: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.",
    image: "/chef3.jpg",
  },
  {
    name: "CAROL BENNETT",
    role: "COOK",
    desc: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.",
    image: "/chef6.jpg",
  },
  {
    name: "HANNAH CARROLL",
    role: "CHEF",
    desc: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.",
    image: "/chef5.jpg",
  },
  {
    name: "GARY BROOKS",
    role: "CHEF",
    desc: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.",
    image: "/chef4.jpg",
  },
  {
    name: "JOE THOMAS",
    role: "CHEF",
    desc: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.",
    image: "/chef7.jpg",
  },
  {
    name: "CAROL BENNETT",
    role: "COOK",
    desc: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.",
    image: "/chef8.jpg",
  },
  {
    name: "HANNAH CARROLL",
    role: "PÂTISSIER",
    desc: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.",
    image: "/chef9.jpg",
  },
  
];


  const styles = {
    container: {
      textAlign: "center",
      padding: "4rem 2rem",
      backgroundColor: "#fff",
      color: "#333",
    },
    tagline: {
      fontSize: "0.9rem",
      letterSpacing: "2px",
      fontWeight: 500,
      marginBottom: "0.5rem",
      color: "#999",
    },
    title: {
      fontSize: "3rem",
      fontWeight: "bold",
      marginBottom: "1rem",
      letterSpacing: "1px",
    },
    description: {
      fontSize: "1.1rem",
      maxWidth: "700px",
      margin: "0 auto 3rem",
      lineHeight: "1.6",
      color: "#666",
    },
    images: {
      display: "flex",
      justifyContent: "center",
      gap: "2rem",
      flexWrap: "wrap",
    },
    img: {
      width: "400px",
      maxWidth: "90%",
      borderRadius: "6px",
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
    },
    ingredientSection: {
      backgroundColor: "#ebebeb",
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "center",
      padding: "4rem 2rem",
      textAlign: "left",
      gap: "2rem",
    },
    textBlock: {
      maxWidth: "500px",
    },
    ingredientTitle: {
      fontSize: "2.5rem",
      fontWeight: "bold",
      marginBottom: "1rem",
    },
    ingredientDesc: {
      fontSize: "1.1rem",
      color: "#666",
      lineHeight: "1.6",
      marginBottom: "2rem",
    },
    ingredientImages: {
      display: "flex",
      flexDirection: "row",
      gap: "1.5rem",
    },
    smallImg: {
      width: "500px",
      borderRadius: "8px",
    },
    button: {
      padding: "0.8rem 2rem",
      border: "none",
      backgroundColor: "#fff",
      color: "#333",
      fontWeight: "600",
      letterSpacing: "1px",
      cursor: "pointer",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      transition: "all 0.3s ease",
    },
  quoteSection: {
  position: "relative",
  width: "100%",
  height: "80vh",
  backgroundAttachment: "fixed",
  backgroundImage: "url('/quotebg2.jpeg')", 
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
},

quoteOverlay: {
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
},

quoteText: {
  color: "#fff",
  fontSize: "2rem",
  fontStyle: "italic",
  fontWeight: "600",
  textAlign: "center",
  padding: "0 1rem",
  maxWidth: "900px",
  lineHeight: "1.8",
  letterSpacing: "1px",
},

chefsContainer: {
  backgroundColor: "#fff",
  padding: "4rem 2rem",
  textAlign: "center",
},

chefsGrid: {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "2.5rem",
  marginTop: "2rem",
  justifyItems: "center",
},

chefCard: {
  maxWidth: "220px",
},

chefImg: {
  width: "200px",
  height: "200px",
  borderRadius: "50%",
  objectFit: "cover",
  marginBottom: "1rem",
},

chefName: {
  fontWeight: "600",
  fontSize: "1rem",
  letterSpacing: "1px",
  marginBottom: "0.2rem",
},

chefRole: {
  fontSize: "0.85rem",
  color: "#888",
  marginBottom: "0.8rem",
  textTransform: "uppercase",
},

chefDesc: {
  fontSize: "0.9rem",
  color: "#777",
  marginBottom: "1rem",
  lineHeight: "1.4",
},

socialIcons: {
  fontSize: "1rem",
  display: "flex",
  justifyContent: "center",
  gap: "0.8rem",
  color: "#555",
},

  };

  
  const handleNavigate = () => {
    navigate("/menu");
  };

  return (
    <>
      {/* OUR STORY SECTION */}
      <div style={styles.container}>
        <p style={styles.tagline}>TASTY AND CRUNCHY</p>
        <h2 style={styles.title}>OUR STORY</h2>
        <p style={styles.description}>
          From humble beginnings to culinary excellence, our journey has been
          flavored with passion, dedication, and a love for creating unforgettable
          dining experiences. Every dish we serve is a blend of tradition,
          creativity, and carefully selected ingredients.
        </p>

        <div style={styles.images}>
          <img src={chefImg} alt="Chef cooking" style={styles.img} />
          <img src={foodImg} alt="Delicious dish" style={styles.img} />
        </div>
      </div>

      {/* INGREDIENT SECTION */}
      <div style={styles.ingredientSection}>
        <div style={styles.textBlock}>
          <p style={styles.tagline}>TASTY AND CRUNCHY</p>
          <h2 style={styles.ingredientTitle}>INGREDIENTS</h2>
          <p style={styles.ingredientDesc}>
            Our flavors are rooted in authenticity. We source the freshest spices and ingredients, hand-picked and ground with care, to ensure every meal is rich in tradition and taste.
          </p>
          <button style={styles.button} onClick={handleNavigate}>
            VIEW OUR MENU
          </button>
        </div>

        <div style={styles.ingredientImages}>
          <img src={stoneImg} alt="Stone grinder" style={styles.smallImg} />
        
        </div>
      </div>


     {/* QUOTE SECTION (Scroll/Parallax Style) */}
<div style={styles.quoteSection}>
  <div style={styles.quoteOverlay}>
    <p style={styles.quoteText}>
    At the heart of our kitchen lies a commitment to craftsmanship. We combine the finest ingredients with timeless techniques to bring you dishes that are bold, balanced, and beautifully prepared. Your plate is our passion.
    </p>
  </div>
</div>

{/* CHEFS SECTION */}
<div style={styles.chefsContainer}>
  <h2 style={styles.title}>MEET OUR CHEFS</h2>
  <div style={styles.chefsGrid}>
    {chefs.map((chef, index) => (
      <div key={index} style={styles.chefCard}>
        <img src={chef.image} alt={chef.name} style={styles.chefImg} />
        <h4 style={styles.chefName}>{chef.name}</h4>
        <p style={styles.chefRole}>{chef.role}</p>
        <p style={styles.chefDesc}>{chef.desc}</p>
        <div style={styles.socialIcons}>
          <i className="fab fa-vimeo"></i>
          <i className="fab fa-instagram"></i>
          <i className="fab fa-twitter"></i>
          <i className="fab fa-facebook-f"></i>
        </div>
      </div>
    ))}
  </div>
</div>

    </>
  );
};

export default About;
