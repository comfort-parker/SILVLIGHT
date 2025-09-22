// src/Pages/ViewProduct.jsx
import React, { useEffect, useState } from "react";
import { getProducts } from "../Api";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";
import ProductFilter from "../Components/Filter/Filter";
import { useCart } from "../Components/Cart/CartContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import groceries from "../assets/groceries.gif";
import "./ViewProduct.css";

const ProductsPage = ({ hideNavbar = false, dashboardMode = false }) => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [userName, setUserName] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token")); // ✅ keep token in state

  const categories = [
    "Cosmetics",
    "Hair Care",
    "Groceries",
    "Face Care",
    "Toiletries",
    "Bakeries",
  ];

  const { addToCart } = useCart();

  // ✅ keep token and user info synced with localStorage
  useEffect(() => {
    const syncAuth = () => {
      setToken(localStorage.getItem("token"));

      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.firstName && user?.lastName) {
        setUserName(`${user.firstName} ${user.lastName}`);
      } else if (user?.fullName) {
        setUserName(user.fullName);
      } else {
        setUserName("");
      }
    };

    syncAuth();

    // listen for changes (e.g., login/logout in other tabs)
    window.addEventListener("storage", syncAuth);

    return () => {
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  // ✅ fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        toast.error("❌ Failed to load products.");
      }
    };
    fetchProducts();
  }, []);

  // ✅ render product price
  const renderPrice = (product) => {
    if (product.minPrice && product.maxPrice) {
      return product.minPrice === product.maxPrice
        ? `GHS ${product.minPrice}`
        : `GHS ${product.minPrice} – ${product.maxPrice}`;
    }
    return product.variants?.length
      ? `GHS ${product.variants[0].price}`
      : "Price not available";
  };

  // ✅ add to cart
  const handleAddToCart = async (product) => {
  const token = localStorage.getItem("token"); // ✅ always latest
  if (!token) {
    toast.error("❌ Please log in to add items to your cart!");
    return;
  }

  try {
    const variant = product.variants?.length ? product.variants[0] : null;
    const price = variant ? variant.price : product.price;

    await addToCart(product._id, 1, variant?._id || null, price);
    toast.success("✅ Item added to cart!");
  } catch (err) {
    console.error("Add to cart error:", err);
    toast.error("❌ Failed to add item to cart.");
  }
};


  // ✅ filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.variants?.some((v) =>
        v.size?.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory = category ? p.category === category : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      {/* ✅ Hide Navbar if inside dashboard */}
      {!hideNavbar && <Navbar />}

      {/* Hero section */}
      <div
        className="view-hero"
        style={{ backgroundImage: `url(${groceries})` }}
      >
        <div className="overlay"></div>
        <div className="hero-text">
          {dashboardMode ? (
            <>
              <h1>Welcome to your Dashboard 👋 {userName}</h1>
              <p>
                Here you can manage your profile, check your orders, and shop
                products.
              </p>
            </>
          ) : (
            <>
              <h1>Shop Your Favorite Products</h1>
              <p>Browse our categories and add items to your cart.</p>
            </>
          )}
        </div>
      </div>

      {/* Products */}
      <div className="products-container">
        <h2 className="products-title">Our Products</h2>

        <ProductFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          category={category}
          setCategory={setCategory}
          categories={categories}
        />

        {filteredProducts.length === 0 ? (
          <p>No products available yet.</p>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div key={product._id} className="product-card">
                {product.mainImage && (
                  <img
                    src={product.mainImage}
                    alt={product.name}
                    className="product-image"
                  />
                )}
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <p className="product-price">{renderPrice(product)}</p>
                  <button
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ Footer always visible */}
      <Footer />

      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
};

export default ProductsPage;
