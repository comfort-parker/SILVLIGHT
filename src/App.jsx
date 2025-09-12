import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CartProvider } from "./Components/Cart/CartContext"; // ✅ import CartProvider
import LandingPage from "./Pages/Landing";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import ForgotPassword from "./Pages/Forgotpass";
import ResetPassword from "./Pages/Resetpass";
import VerifyOtp from "./Pages/Otp";
import Profile from "./Pages/Profile";
import DashboardLayout from "./Pages/DashboardLayout";
import DashboardOverview from "./Pages/Dashview";
import ProductList from "./Pages/ProductList";
import ProductForm from "./Pages/ProductForm";
import ProductsPage from "./Pages/ViewProduct";
import CartPage from "./Pages/Cart";
import UserDashboard from "./Pages/UserDash";
import ProtectedRoute from "./Components/Cart/CartProtect";
import CheckoutPage from "./Components/Order/Order";
import OrderConfirmation from "./Components/Order/ConfirmOrder";
import AdminOrdersPage from "./Pages/OrderList";
import AdminUsers from "./Pages/AdminUser";
import AdminContentPage from "./Pages/AdminLetter";
import Blog from "./Pages/Blog";
import Contactus from "./Pages/ContactUs";

const App = () => {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* Public pages */}
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contactus" element={<Contactus />} />
          <Route 
  path="/cart" 
  element={
    <ProtectedRoute>
      <CartPage />
    </ProtectedRoute>
  } 
/>
          <Route path="/dashboard" element={<UserDashboard />} />

          {/* Admin dashboard */}
          <Route path="/admin" element={<DashboardLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/edit/:id" element={<ProductForm />} />
            <Route path="users" element={<AdminUsers/>} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="analytics" element={<h2>Analytics Page (Coming Soon)</h2>} />
            <Route path="content" element={<AdminContentPage />} />
            <Route path="settings" element={<h2>Settings Page (Coming Soon)</h2>} />
            <Route path="support" element={<h2>Support Page (Coming Soon)</h2>} />
          </Route>
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;
