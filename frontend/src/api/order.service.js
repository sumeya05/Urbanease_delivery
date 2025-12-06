import React, { useState } from "react";
import { createOrder, fetchOrdersByCustomer } from "./api"; // adjust path

const OrdersComponent = () => {
  const [loading, setLoading] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  const handleCreateOrder = async () => {
    setLoading(true);
    setError(null);

    const orderData = {
      customerName: "John Doe",
      items: [{ productId: 1, quantity: 2 }],
    };

    try {
      const result = await createOrder(orderData);
      console.log("Order created:", result);
      alert("Order created successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchOrders = async () => {
    if (!customerName) {
      alert("Please enter a customer name");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchOrdersByCustomer(customerName);
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Orders</h2>

      {/* Create Order */}
      <button onClick={handleCreateOrder} disabled={loading}>
        {loading ? "Creating..." : "Create Order"}
      </button>

      {/* Fetch Orders */}
      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
        <button onClick={handleFetchOrders} disabled={loading}>
          {loading ? "Loading..." : "Fetch Orders"}
        </button>
      </div>

      {/* Error Message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Orders List */}
      {orders.length > 0 && (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              Order #{order.id} - {order.customerName} - {order.items.length}{" "}
              items
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrdersComponent;
