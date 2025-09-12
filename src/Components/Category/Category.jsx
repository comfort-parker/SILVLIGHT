import React, { useEffect, useRef } from "react";
import "./Category.css";
import cosmeticsImg from "../../assets/cosmetics.jpg";
import hairImg from "../../assets/hair.jpg";
import skImg from "../../assets/sk.jpg";
import groceriesImg from "../../assets/groceries.gif";
import cakeImg from "../../assets/cake.jpg";
import toiletriesImg from "../../assets/toileteries.jpg";

const categories = [
  { id: 1, name: "Cosmetics", image: cosmeticsImg, desc: "Explore our beauty products Explore our beauty products ",  Price: "GHS 20 "  },
  { id: 2, name: "Hair Products", image: hairImg, desc: "Best care for your hair Best care for your hair",  Price: "GHS 10 " },
  { id: 3, name: "Skincare", image: skImg, desc: "Glow with confidence Glow with confidence", Price: "GHS 60 "  },
  { id: 4, name: "Groceries", image: groceriesImg, desc: "Everyday essentials Everyday essentials" ,  Price: "GHS 20 "},
  { id: 5, name: "Bakery", image: cakeImg, desc: "Freshly baked goods Freshly baked goods", Price: "GHS 40 " },
  { id: 6, name: "Toiletries", image: toiletriesImg, desc: "Personal care essentials Personal care essentials" , Price: "GHS 20 "},
  { id: 7, name: "Bakery", image: cakeImg, desc: "Freshly baked goods", Price: "GHS 30 " },
  { id: 8, name: "Toiletries", image: toiletriesImg, desc: "Personal care essentials Personal care essentials" , Price: "GHS 200 "},
];

const Category = () => {
  const sliderRef = useRef(null);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let scrollAmount = 0;
    const scrollStep = 1; // speed in px
    const autoScroll = setInterval(() => {
      const maxScroll = slider.scrollWidth - slider.clientWidth; // recalc every tick

      if (scrollAmount >= maxScroll) {
        scrollAmount = 0; // reset
        slider.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollAmount += scrollStep;
        slider.scrollTo({ left: scrollAmount, behavior: "smooth" });
      }
    }, 20); // interval speed (smaller = faster)

    return () => clearInterval(autoScroll);
  }, []);

  return (
    <section className="category-section">
      <h2 className="section-title">Shop Our Collection by Category</h2>
      <div className="category-slider" ref={sliderRef}>
        {categories.map((cat) => (
          <div className="category-card" key={cat.id}>
            <img src={cat.image} alt={cat.name} className="category-img" />
            <h3>{cat.name}</h3>
            <p>{cat.desc}</p>
            <p>{cat.Price}</p>
            <button className="explore-btn">Explore More</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Category;
