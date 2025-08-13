// src/pages/Menu.jsx
import React, { useEffect, useState } from "react";

const specials = [
  {
    title: "Spicy Masala Dosa",
    description: "Crispy South Indian crepe filled with a spicy potato masala. Served with coconut chutney and sambar.",
    image: "/special1.jpeg",
  },
  {
    title: "Filter Coffee Delight",
    description: "Traditional strong South Indian filter coffee brewed to perfection. Aromatic, rich, and comforting.",
    image: "/special2.jpeg",
  },
  {
    title: "Mini Idli Sambar Bowl",
    description: "Soft mini idlis soaked in piping hot sambar, topped with ghee and crunchy tempered spices.",
    image: "/special3.jpeg",
  },
  {
    title: "Coconut Chutney Medley",
    description: "A trio of coconut chutneys – plain, mint, and red chili – served with crispy snacks.",
    image: "/special4.jpeg",
  },
  {
    title: "Tamarind Rice Burst",
    description: "Tangy tamarind rice tempered with mustard seeds, curry leaves, and peanuts. A traditional treat.",
    image: "/special5.jpeg",
  },
  {
    title: "South Special Thali",
    description: "A full vegetarian platter with rice, chapati, curry, curd, papad, pickle, and sweet – all in one!",
    image: "/special6.jpeg",
  },
];

const lunchSpecials = [
  {
    title: "Thali Feast",
    description: "A traditional lunch thali including rice, sambar, rasam, poriyal, curd, pickle, and dessert.",
    image: "/lunch1.jpeg",
  },
  {
    title: "Paneer Pulao",
    description: "Fragrant basmati rice with marinated paneer cubes, cooked in mild spices and herbs.",
    image: "/lunch2.jpeg",
  },
  {
    title: "Vegetable Biryani",
    description: "Long-grain rice cooked with mixed vegetables, saffron, and aromatic.",
    image: "/lunch3.jpeg",
  },
  {
    title: "Coconut Curry Rice",
    description: "Mild coconut-based curry served with steamed rice and crispy.",
    image: "/lunch4.jpeg",
  },
  {
    title: "Mango Mor Kuzhambu",
    description: "Buttermilk curry with mango chunks served over rice – a South Indian delicacy.",
    image: "/lunch5.jpeg",
  },
  {
    title: "South Indian Fried Rice",
    description: "Fusion rice with curry leaves, vegetables, and a spicy twist of Southern flavor.",
    image: "/lunch6.jpeg",
  },
];

const dinnerSpecials = [
  {
    title: "Chapati & Kurma",
    description: "Soft chapatis paired with flavorful South Indian-style kurma.",
    image: "/dinner1.jpeg"
  },
  {
    title: "Veg Uthappam",
    description: "Thick dosa topped with fresh vegetables and served with chutney.",
    image: "/dinner2.jpeg"
  },
  {
    title: "Mini Tiffin",
    description: "A sampler of dosa, idli, pongal, and vada – perfect for dinner variety.",
    image: "/dinner5.jpeg"
  },
  {
    title: "Rava Dosa",
    description: "Crispy, golden semolina dosa with spicy potato filling and coconut.",
    image: "/dinner4.jpeg"
  },
  {
    title: "Curd Semiya",
    description: "Cool and light curd vermicelli with mustard tempering – a dinner.",
    image: "/dinner5.jpeg"
  },
  {
    title: "Tomato Bath",
    description: "Spicy tomato-flavored rice with roasted peanuts and curry leaves.",
    image: "/dinner6.jpg"
  },
];




const Menu = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeLunchIndex, setActiveLunchIndex] = useState(0);
  const [activeDinnerIndex, setActiveDinnerIndex] = useState(0);


  useEffect(() => {
    const styles = `
      * {
        box-sizing: border-box;
      }

      body {
        font-family: 'Open Sans', sans-serif;
        margin: 0;
        padding: 0;
      }

      .menu-hero-wrapper {
        position: relative;
        width: 100%;
        height: 70vh;
        overflow: hidden;
      }

      .menu-hero-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        filter: brightness(0.6);
      }

      .menu-hero-overlay {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .menu-title {
        color: white;
        font-size: 4rem;
        font-family: 'Cormorant Garamond', serif;
        font-weight: bold;
        text-align: center;
      }

      .menu-section {
        padding: 60px 20px;
        background: #fff;
        text-align: center;
        color: #222;
      }

      .menu-subtitle {
        text-transform: uppercase;
        letter-spacing: 2px;
        font-weight: 500;
        color: #999;
        font-size: 14px;
        margin-bottom: 10px;
        font-family: 'Open Sans', sans-serif;
      }

      .menu-heading {
        font-family: 'Cormorant Garamond', serif;
        font-size: 42px;
        font-weight: 700;
        margin-bottom: 20px;
      }

      .menu-desc {
        max-width: 700px;
        margin: 0 auto 40px;
        color: #777;
        font-size: 16px;
        font-family: 'Open Sans', sans-serif;
      }

      .menu-grid {
        display: flex;
        justify-content: center;
        gap: 50px;
        flex-wrap: wrap;
        max-width: 1200px;
        margin: 0 auto;
        text-align: left;
      }

      .menu-column {
        flex: 1 1 400px;
      }

      .menu-item {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #eee;
        padding: 15px 0;
      }

      .item-info h4 {
        margin: 0;
        font-weight: 600;
        font-size: 16px;
        text-transform: uppercase;
        font-family: 'Open Sans', sans-serif;
      }

      .item-info p {
        margin: 4px 0 0;
        color: #888;
        font-size: 14px;
        font-family: 'Open Sans', sans-serif;
      }

      .item-price {
        font-weight: 600;
        color: #111;
        white-space: nowrap;
        font-family: 'Open Sans', sans-serif;
      }

      .see-more-btn {
        margin-top: 40px;
        background: #e63946;
        color: white;
        padding: 10px 25px;
        font-size: 15px;
        border: none;
        border-radius: 25px;
        cursor: pointer;
        font-family: 'Open Sans', sans-serif;
      }

        .specials-section {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        padding: 60px 20px;
        font-family: 'Open Sans', sans-serif;
      }

      .specials-left {
        flex: 1 1 300px;
        max-width: 400px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 20px;
      }

      .specials-left button {
        background: #fff;
        border: 1px solid #ccc;
        padding: 12px 20px;
        font-size: 1rem;
        font-family: 'Cormorant Garamond', serif;
        cursor: pointer;
        transition: background 0.3s, color 0.3s;
        text-align: left;
      }

      .specials-left button.active {
        background-color: #111;
        color: #fff;
      }

      .specials-right {
        flex: 1 1 400px;
        max-width: 600px;
        padding-left: 40px;
      }

      .specials-heading {
        text-align: center;
        font-family: 'Cormorant Garamond', serif;
        font-size: 2.8rem;
        margin-bottom: 40px;
      }

      .specials-subtitle {
        text-align: center;
        font-family: 'Open Sans', sans-serif;
        font-size: 0.9rem;
        letter-spacing: 2px;
        color: #777;
        text-transform: uppercase;
        margin-bottom: 12px;
      }

      .quote-scroll-section {
  position: relative;
  height: 100vh;
  background-image: url('/quotebg.jpeg');
  background-size: cover;
  background-attachment: fixed;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  scroll-snap-align: start;
}

 .quote-scroll-section2 {
  position: relative;
  height: 100vh;
  background-image: url('/quotebg2.jpeg');
  background-size: cover;
  background-attachment: fixed;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  scroll-snap-align: start;
}

.quote-overlay {
  background-color: rgba(0, 0, 0, 0.5);
  padding: 40px;
  width: 100%;
  text-align: center;
}

.quote-text {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.5rem;
  color: #fff;
  opacity: 0;
  transform: translateY(40px);
  animation: fadeInUp 1s ease-out forwards;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}


      @media (max-width: 768px) {
        .menu-title {
          font-size: 2.5rem;
        }

        .specials-section {
          flex-direction: column;
        }

        .specials-right {
          padding-left: 0;
  }

 
    `;
    const styleTag = document.createElement("style");
    styleTag.innerHTML = styles;
    document.head.appendChild(styleTag);

    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);



  const itemsLeft = [
    { name: "Idli & Sambar", description: "Soft rice cakes with spicy lentil stew.", price: "₹50" },
    { name: "Masala Dosa", description: "Crispy dosa filled with spiced potato.", price: "₹70" },
    { name: "Pongal", description: "Rice & dal porridge with ghee and pepper.", price: "₹60" },
    { name: "Medu Vada", description: "Crispy urad dal donuts & chutney.", price: "₹45" },
    { name: "Upma", description: "Savory semolina breakfast.", price: "₹50" },
  ];

  const itemsRight = [
    { name: "Appam & Stew", description: "Appam with coconut veg stew.", price: "₹80" },
    { name: "Rava Dosa", description: "Thin crepe with crispy edges.", price: "₹70" },
    { name: "Poori Masala", description: "Fluffy pooris with potato curry.", price: "₹65" },
    { name: "Kanchipuram Idli", description: "Spiced idli with cashews.", price: "₹60" },
    { name: "Uthappam", description: "Dosa topped with chopped veggies.", price: "₹75" },
  ];

  const lunchItemsLeft = [
  { name: "Sambar Rice", description: "Steamed rice blended with hot sambar and ghee.", price: "₹80" },
  { name: "Lemon Rice", description: "Tangy rice flavored with lemon juice and mustard seeds.", price: "₹70" },
  { name: "Veg Thali", description: "Complete meal with rice, curry, sabzi, curd, and papad.", price: "₹130" },
  { name: "Bisibele Bath", description: "A spicy Karnataka rice dish made with lentils, vegetables, and tamarind.", price: "₹90" },
{ name: "Vatha Kuzhambu", description: "Tamarind-based curry with sun-dried vegetables, served with hot rice.", price: "₹85" },
];

const lunchItemsRight = [
  { name: "Curd Rice", description: "Cooling rice mixed with curd, tempered with mustard seeds.", price: "₹65" },
  { name: "Tomato Rasam", description: "Spicy and tangy South Indian soup, perfect with rice.", price: "₹40" },
  { name: "Puli Kulambu", description: "Tamarind-based curry rich with spices and vegetables.", price: "₹85" },
  { name: "Cabbage Poriyal", description: "Stir-fried cabbage with coconut and mild spices, a perfect side dish.", price: "₹60" },
{ name: "Jeera Rice with Dal Tadka", description: "Cumin-flavored rice served with yellow dal tempered in ghee.", price: "₹95" },
];

const dinnerItemsLeft = [
  { name: "Chapati & Kurma", description: "Soft chapatis served with rich coconut-based vegetable kurma.", price: "₹90" },
  { name: "Rava Dosa", description: "Crispy thin semolina dosa with chutneys and spicy sambar.", price: "₹85" },
  { name: "Idiyappam with Stew", description: "Rice noodles served with a mildly spiced coconut vegetable stew.", price: "₹95" },
  { name: "Pesarattu", description: "Moong dal dosa with ginger chutney — protein-packed and healthy.", price: "₹80" },
  { name: "Ghee Pongal", description: "Soft rice and dal cooked with ghee, pepper, and cashews.", price: "₹75" },
];

const dinnerItemsRight = [
  { name: "Set Dosa with Chutney", description: "Fluffy 3-layered mini dosas served with coconut chutney.", price: "₹70" },
  { name: "Veg Uthappam", description: "Thick dosa topped with veggies and served with chutney and sambar.", price: "₹85" },
  { name: "Curd Semiya", description: "Chilled vermicelli mixed with curd, tempered with mustard and curry leaves.", price: "₹60" },
  { name: "Mini Tiffin", description: "A small platter of idli, vada, pongal and dosa — perfect for variety lovers.", price: "₹120" },
  { name: "Tomato Bath", description: "Karnataka-style tomato rice served with raita and chips.", price: "₹70" },
];



  return (
    <>
      <div className="menu-hero-wrapper">
        <img src="/herobgg.jpeg" alt="Menu Background" className="menu-hero-image" />
        <div className="menu-hero-overlay">
          <h1 className="menu-title">Our Menu</h1>
        </div>
      </div>

      <section className="menu-section">
        <p className="menu-subtitle">Tasty and Crunchy</p>
        <h2 className="menu-heading">Breakfast</h2>
        <p className="menu-desc">
          Start your day with our handpicked South Indian breakfast delights, packed with tradition and flavor.
        </p>

        <div className="menu-grid">
          <div className="menu-column">
            {itemsLeft.map((item, i) => (
              <div key={i} className="menu-item">
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p>{item.description}</p>
                </div>
                <div className="item-price">{item.price}</div>
              </div>
            ))}
          </div>

          <div className="menu-column">
            {itemsRight.map((item, i) => (
              <div key={i} className="menu-item">
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p>{item.description}</p>
                </div>
                <div className="item-price">{item.price}</div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* Specials Section */}
      <div className="specials-section">
        <div style={{ width: "100%" }}>
          <p className="specials-subtitle">Check Out Our</p>
          <h2 className="specials-heading">Specials</h2>
        </div>

        <div className="specials-left">
          {specials.map((item, index) => (
            <button
              key={index}
              className={index === activeIndex ? "active" : ""}
              onClick={() => setActiveIndex(index)}
            >
              {item.title}
            </button>
          ))}
        </div>

        <div className="specials-right">
          <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#333" }}>
            {specials[activeIndex].description}
            <img
              src={specials[activeIndex].image}
              alt={specials[activeIndex].title}
              style={{
                marginTop: "30px",
                marginLeft:"30%",
                width: "50%",
                height: "300px",
                borderRadius: "12px",
                boxShadow: "0 6px 20px rgba(0,0,0,0.15)"
              }}
            />

          </p>
        </div>
      </div>

      {/* Quote Scroll Section */}
<div className="quote-scroll-section">
  <div className="quote-overlay">
    <p className="quote-text">“Food is the ingredient that binds us together.”</p>
  </div>
</div>



{/* lunch */}
{/* Lunch Section */}
<section className="menu-section">
  <p className="menu-subtitle">Savory and Satisfying</p>
  <h2 className="menu-heading">Lunch</h2>
  <p className="menu-desc">
    Dive into our hearty South Indian lunch dishes that offer a perfect blend of spice, comfort, and tradition.
  </p>

  <div className="menu-grid">
    <div className="menu-column">
      {lunchItemsLeft.map((item, i) => (
        <div key={i} className="menu-item">
          <div className="item-info">
            <h4>{item.name}</h4>
            <p>{item.description}</p>
          </div>
          <div className="item-price">{item.price}</div>
        </div>
      ))}
    </div>

    <div className="menu-column">
      {lunchItemsRight.map((item, i) => (
        <div key={i} className="menu-item">
          <div className="item-info">
            <h4>{item.name}</h4>
            <p>{item.description}</p>
          </div>
          <div className="item-price">{item.price}</div>
        </div>
      ))}
    </div>
  </div>

</section>
{/* Lunch Specials Section */}
<div className="specials-section">
  <div style={{ width: "100%" }}>
    <p className="specials-subtitle">Explore Our</p>
    <h2 className="specials-heading">Lunch Specials</h2>
  </div>

  <div className="specials-left">
    {lunchSpecials.map((item, index) => (
      <button
        key={index}
        className={index === activeLunchIndex ? "active" : ""}
        onClick={() => setActiveLunchIndex(index)}
      >
        {item.title}
      </button>
    ))}
  </div>

  <div className="specials-right">
    <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#333" }}>
      {lunchSpecials[activeLunchIndex].description}
      <img
        src={lunchSpecials[activeLunchIndex].image}
        alt={lunchSpecials[activeLunchIndex].title}
        style={{
          marginTop: "30px",
          marginLeft: "30%",
          width: "50%",
          height: "250px",
          borderRadius: "12px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.15)"
        }}
      />
    </p>
  </div>
</div>

 {/* Quote Scroll Section */}
<div className="quote-scroll-section2">
  <div className="quote-overlay">
    <p className="quote-text">“Food is the ingredient that binds us together.”</p>
  </div>
</div>


{/* Dinner Section */}
<section className="menu-section">
  <p className="menu-subtitle">Warm and Comforting</p>
  <h2 className="menu-heading">Dinner</h2>
  <p className="menu-desc">
    Unwind with our delicious South Indian dinner options — light, flavorful, and satisfying to end your day.
  </p>

  <div className="menu-grid">
    <div className="menu-column">
      {dinnerItemsLeft.map((item, i) => (
        <div key={i} className="menu-item">
          <div className="item-info">
            <h4>{item.name}</h4>
            <p>{item.description}</p>
          </div>
          <div className="item-price">{item.price}</div>
        </div>
      ))}
    </div>

    <div className="menu-column">
      {dinnerItemsRight.map((item, i) => (
        <div key={i} className="menu-item">
          <div className="item-info">
            <h4>{item.name}</h4>
            <p>{item.description}</p>
          </div>
          <div className="item-price">{item.price}</div>
        </div>
      ))}
    </div>
  </div>

  
</section>


{/* Dinner Specials Section */}
<div className="specials-section">
  <div style={{ width: "100%" }}>
    <p className="specials-subtitle">Relish Our</p>
    <h2 className="specials-heading">Dinner Specials</h2>
  </div>

  <div className="specials-left">
    {dinnerSpecials.map((item, index) => (
      <button
        key={index}
        className={index === activeDinnerIndex ? "active" : ""}
        onClick={() => setActiveDinnerIndex(index)}
      >
        {item.title}
      </button>
    ))}
  </div>

  <div className="specials-right">
    <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#333" }}>
      {dinnerSpecials[activeDinnerIndex].description}
      <img
        src={dinnerSpecials[activeDinnerIndex].image}
        alt={dinnerSpecials[activeDinnerIndex].title}
        style={{
          marginTop: "30px",
          marginLeft: "30%",
          width: "50%",
          height: "250px",
          borderRadius: "12px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.15)"
        }}
      />
    </p>
  </div>
</div>




    </>
  );
};

export default Menu;
