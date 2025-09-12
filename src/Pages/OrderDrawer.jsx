import React from "react";
import "./OrderDrawer.css";

const OrderDrawer = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div
        className="drawer"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="drawer-header">
          <h2>Order Details</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="drawer-content">
          <div className="section">
            <h3>Customer Info</h3>
            <p>
              <strong>Name:</strong> {order.user?.firstName}{" "}
              {order.user?.lastName}
            </p>
            <p>
              <strong>Email:</strong> {order.user?.email}
            </p>
            <p>
              <strong>Phone:</strong> {order.shipping?.phone}
            </p>
            <p>
              <strong>Address:</strong>{" "}
              {`${order.shipping?.city}, ${order.shipping?.region}, ${order.shipping?.country}`}
            </p>
          </div>

          <div className="section">
  <h3>Order Items</h3>
  {order.items?.length > 0 ? (
    <ul className="items-list">
      {order.items.map((item, idx) => (
        <li key={idx} className="item-row">
          <img
            src={item.product?.mainImage || "/placeholder.png"}
            alt={item.product?.name || "Product"}
            className="item-image"
          />
          <div>
            <p className="item-name">{item.product?.name || "Unnamed Product"}</p>
            <p className="item-variant">
              {item.variant?.color || "N/A"} | {item.variant?.size || "N/A"}
            </p>
            <p>
              Qty: {item.quantity} × GHS {item.price?.toFixed(2) || "0.00"}
            </p>
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <p>No items in this order.</p>
  )}
</div>


          <div className="section">
            <h3>Payment & Status</h3>
            <p>
              <strong>Payment Method:</strong> {order.paymentMethod}
            </p>
            <p>
              <strong>Payment Status:</strong> {order.paymentStatus}
            </p>
            <p>
              <strong>Order Status:</strong> {order.status}
            </p>
            <p>
              <strong>Total:</strong>{" "}
              <span className="order-total">
                GHS {order.totalAmount.toFixed(2)}
              </span>
            </p>
          </div>

          {order.orderNotes && (
            <div className="section">
              <h3>Notes</h3>
              <p>{order.orderNotes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDrawer;
