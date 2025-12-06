import React, { useState } from "react";

const OrderStatusUpdater = ({ orderId, currentStatus, onUpdateStatus }) => {
  const [status, setStatus] = useState(currentStatus);
  const [driverName, setDriverName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateStatus(orderId, status, driverName);
  };

  return (
    <form onSubmit={handleSubmit} className="order-status-updater">
      <h3>Update Order {orderId}</h3>
      <label>
        Status:
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Pending">Pending</option>
          <option value="Not Assigned">Not Assigned</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Delivered">Delivered</option>
        </select>
      </label>
      <label>
        Driver Name:
        <input
          type="text"
          value={driverName}
          onChange={(e) => setDriverName(e.target.value)}
          placeholder="Optional"
        />
      </label>
      <button type="submit">Update Status</button>
    </form>
  );
};

export default OrderStatusUpdater;
