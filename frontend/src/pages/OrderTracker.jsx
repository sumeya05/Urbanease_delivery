import React, { useState } from "react";
import { fetchOrdersByCustomer } from "../api/order.service";
import { fetchDeliveryStatus } from "../api/delivery.service";

const OrderTracker = () => {
  const [customerName, setCustomerName] = useState("");
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deliveryStatus, setDeliveryStatus] = useState(null);

  const handleSearch = async () => {
    const orderData = await fetchOrdersByCustomer(customerName);
    setOrders(orderData);
  };

  const handleOrderSelect = async (orderId) => {
    const status = await fetchDeliveryStatus(orderId);
    setDeliveryStatus(status);
    setSelectedOrder(orderId);
  };

  return (
    <div className="order-tracker">
      <h2>Order Tracker</h2>
      <div>
        <label>
          Customer Name:
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </label>
        <button onClick={handleSearch}>Search Orders</button>
      </div>
      {orders.length > 0 && (
        <div>
          <h3>Your Orders</h3>
          <ul>
            {orders.map((order) => (
              <li key={order.id}>
                <button onClick={() => handleOrderSelect(order.id)}>
                  Order #{order.id} - ${order.total_price}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {deliveryStatus && (
        <div>
          <h3>Delivery Status for Order #{selectedOrder}</h3>
          <p>Status: {deliveryStatus.status}</p>
          <p>Driver: {deliveryStatus.driver_name || "Not assigned"}</p>
          <p>
            Last Updated: {new Date(deliveryStatus.updated_at).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderTracker;
