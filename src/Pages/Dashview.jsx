import React, { useEffect, useState } from "react";
import { getOrderStats, getProfile, getProducts, getOrders } from "../Api";
import SalesChart from "../Components/Layout/Saleschart";
import {
  FaShoppingCart,
  FaMoneyBillWave,
  FaBoxOpen,
  FaCheckCircle,
  FaTags,
} from "react-icons/fa";
import "./Dashview.css";

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalItemsSold: 0,
    ordersByStatus: {},
    productSales: [],
  });
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
 
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getOrderStats();
        setStats({
          totalOrders: res.data.totalOrders,
          totalRevenue: res.data.totalRevenue,
          totalItemsSold: res.data.totalItemsSold,
          ordersByStatus: res.data.ordersByStatus,
          productSales: res.data.productSales || [],
        });
      } catch (err) {
        console.error(err);
      }
    };

    const fetchUser = async () => {
      try {
        const res = await getProfile();
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchOrders = async () => {
      try {
        const res = await getOrders();
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
    fetchUser();
    fetchProducts();
    fetchOrders();
  }, []);

  // Utility
  const safeNumber = (val) => (isNaN(Number(val)) ? 0 : Number(val));

  const calculateProductStock = (product) =>
    product.variants.reduce((sum, v) => sum + safeNumber(v.stock), 0);

  const calculateProductStockValue = (product) =>
    product.variants.reduce(
      (sum, v) => sum + safeNumber(v.stock) * safeNumber(v.price),
      0
    );

  // Category stats
  const categoryStats = {};
  products.forEach((product) => {
    const category = product.category;
    const stock = calculateProductStock(product);
    const stockValue = calculateProductStockValue(product);

    if (!categoryStats[category]) {
      categoryStats[category] = {
        productCount: 0,
        totalStock: 0,
        totalValue: 0,
      };
    }

    categoryStats[category].productCount += 1;
    categoryStats[category].totalStock += stock;
    categoryStats[category].totalValue += stockValue;
  });

  // Helpers
  const getProductStockLeft = (productId) => {
    const product = products.find((p) => p._id === productId);
    if (!product) return 0;
    return calculateProductStock(product);
  };
 
  const normalizeId = (id) => {
  if (!id) return "";
  if (typeof id === "object" && id._id) return String(id._id); // populated object
  return String(id); // raw ObjectId
};

  const getTodaySales = (productId) => {
  const today = new Date().toISOString().split("T")[0];
  let totalQty = 0;
  let totalValue = 0;

  orders.forEach((order) => {
    if (!order.createdAt || !order.items) return;

    const orderDate = new Date(order.createdAt).toISOString().split("T")[0];
    if (orderDate !== today) return;

    order.items.forEach((item) => {
      const id = item.product?.toString(); // product is just an ID string
      if (id === productId?.toString()) {
        const qty = safeNumber(item.quantity);
        const price = safeNumber(item.price); // this is per unit
        totalQty += qty;
        totalValue += qty * price;
      }
    });
  });

  return { totalQty, totalValue };
};


  // ---------- Top Purchased Products ----------
const productRevenueMap = {};
products.forEach((product) => {
  const avgPrice =
    product.variants && product.variants.length > 0
      ? product.variants.reduce((sum, v) => sum + safeNumber(v.price), 0) /
        product.variants.length
      : safeNumber(product.minPrice) || 0;
  productRevenueMap[product._id] = avgPrice;
});

// Sort + enrich
const topProducts = (stats.productSales || [])
  .map((p) => {
    const price = productRevenueMap[p.productId] || 0;
    return {
      ...p,
      totalRevenue: p.totalQuantitySold * price,
    };
  })
  .sort((a, b) => b.totalQuantitySold - a.totalQuantitySold)
  .slice(0, 7);


  // Metrics cards
  const metrics = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: <FaShoppingCart />,
      color: "#4caf50",
    },
    {
      title: "Total Revenue (GHS)",
      value: stats.totalRevenue,
      icon: <FaMoneyBillWave />,
      color: "#2196f3",
    },
    {
      title: "Total Items Sold",
      value: stats.totalItemsSold,
      icon: <FaBoxOpen />,
      color: "#ff9800",
    },
    {
      title: "Delivered Orders",
      value: stats.ordersByStatus.Delivered || 0,
      icon: <FaCheckCircle />,
      color: "#9c27b0",
    },
    {
      title: "Total Products",
      value: products.length,
      icon: <FaTags />,
      color: "#f44336",
    },
  ];

  return (
    <div className="dashboard-container">
      {user && (
        <h2 className="dashboard-welcome">
          Welcome back, <span>{user.firstName}</span> !
        </h2>
      )}

      {/* Metric Cards */}
      <div className="metrics-cards">
        {metrics.map((metric) => (
          <div
            className="metric-card"
            key={metric.title}
            style={{ borderLeft: `5px solid ${metric.color}` }}
          >
            <div className="metric-icon" style={{ color: metric.color }}>
              {metric.icon}
            </div>
            <div className="metric-info">
              <h4>{metric.title}</h4>
              <p>{metric.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="summary-row">
        {/* Top Products */}
{topProducts.length > 0 ? (
  <div className="summary-card">
    <h4 className="product-title">Top Purchased Products</h4>
    <div className="product-header">
      <span>Product</span>
      <span>All Time Sold</span>
      <span>Today Sold</span>
      <span>Stock Left</span>
      <span>Revenue</span>
    </div>
    <div className="summary-list">
      {topProducts.map((p, index) => {
        const stockLeft = getProductStockLeft(p.productId);
        const todaySales = getTodaySales(p.productId);

        return (
          <div key={p.productId} className="product-row">
            <span className="product-name">
              {index + 1}. {p.productName}
            </span>
            <span>{p.totalQuantitySold}</span>
            <span>{todaySales.totalQty}</span>
            <span>{stockLeft}</span>
            <span className="product-value-badge">
              GHS {p.totalRevenue.toFixed(2)}
            </span>
          </div>
        );
      })}
    </div>
  </div>
) : (
  <div className="summary-card">
    <h4 className="product-title">Top Purchased Products</h4>
    <p>No product sales available yet.</p>
  </div>
)}


        {/* Categories */}
        {Object.keys(categoryStats).length > 0 && (
          <div className="summary-card">
            <h4 className="category-title">Product Categories</h4>
            <div className="category-header">
              <span>Category</span>
              <span>Products</span>
              <span>In Stock</span>
              <span>Value</span>
            </div>
            <div className="summary-list">
              {Object.entries(categoryStats).map(([name, stats]) => (
                <div key={name} className="category-row">
                  <span className="category-name">{name}</span>
                  <span>{stats.productCount}</span>
                  <span>{stats.totalStock}</span>
                  <span className="category-revenue-badge">
                    GHS {stats.totalValue.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sales Chart */}
      <div className="sales-chart-card">
        <SalesChart />
      </div>
    </div>
  );
};

export default DashboardOverview;
