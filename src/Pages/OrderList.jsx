import React, { useEffect, useState } from "react";
import { getOrders, updateOrderStatus } from "../Api"; 
import OrderDrawer from "./OrderDrawer";
import Topbar from "../Components/Layout/Topbar";
import Sidebar from "../Components/Layout/Sidebar";
import Pagination from "../Components/Layout/Pagination";
import "./OrderList.css";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Filters
  const [searchCustomer, setSearchCustomer] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // ✅ Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getOrders();
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle status update inline
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus); // pass string only
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
      alert("Order status updated!");
    } catch (err) {
      console.error("Failed to update order:", err);
      alert("Error updating status.");
    }
  };

  // ✅ Filtering logic
  const filteredOrders = orders.filter((order) => {
    const customerName =
      `${order.user?.firstName || ""} ${order.user?.lastName || ""}`.toLowerCase();
    const matchesCustomer = customerName.includes(searchCustomer.toLowerCase());
    const matchesStatus = statusFilter
      ? order.status.toLowerCase() === statusFilter.toLowerCase()
      : true;
    const matchesDate = dateFilter
      ? new Date(order.createdAt).toLocaleDateString() ===
        new Date(dateFilter).toLocaleDateString()
      : true;

    return matchesCustomer && matchesStatus && matchesDate;
  });

  // ✅ Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchCustomer, statusFilter, dateFilter]);

  if (loading) return <p className="loading">Loading orders...</p>;

  return (
    <>
      <Topbar />
      <Sidebar />

      <div className="orders-container">
        <h1 className="orders-title">Orders Management</h1>

        {/* ✅ Filter Section */}
        <div className="orders-filters">
          <div>
            <label>Search Customer:</label>
            <input
              type="text"
              value={searchCustomer}
              onChange={(e) => setSearchCustomer(e.target.value)}
              placeholder="Enter name..."
            />
          </div>
          <div>
            <label>Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label>Date:</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
        </div>

        {/* ✅ Orders Table */}
        <div className="orders-table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="order-id">
                      {order._id.slice(-6).toUpperCase()}
                    </td>
                    <td>
                      {order.user?.firstName} {order.user?.lastName}
                      <br />
                      <span className="customer-email">
                        {order.user?.email}
                      </span>
                    </td>
                    <td className="order-amount">
                      GHS {order.totalAmount.toFixed(2)}
                    </td>
                    <td>{order.paymentMethod}</td>

                    {/* ✅ Inline Status Update */}
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className={`status-select ${order.status.toLowerCase()}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="order-date">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="text-right">
                      <button
                        className="view-btn"
                        onClick={() => setSelectedOrder(order)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-orders">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />

        {/* ✅ Drawer */}
        <OrderDrawer
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      </div>
    </>
  );
};

export default AdminOrdersPage;
