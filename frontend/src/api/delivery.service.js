import React, { useState } from "react";
import { fetchDeliveryStatus, updateDeliveryStatus } from "./api"; // adjust path

const DeliveryStatusComponent = () => {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState("");
  const [driverName, setDriverName] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState(null);

  const handleFetchStatus = async () => {
    const data = await fetchDeliveryStatus(orderId);
    setDeliveryInfo(data);
  };

  const handleUpdateStatus = async () => {
    const data = await updateDeliveryStatus(
      orderId,
      status,
      driverName || null
    );
    setDeliveryInfo(data);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Delivery Status</h2>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />
      </div>

      <button onClick={handleFetchStatus}>Fetch Status</button>

      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="New Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />
        <input
          type="text"
          placeholder="Driver Name (optional)"
          value={driverName}
          onChange={(e) => setDriverName(e.target.value)}
        />
        <button onClick={handleUpdateStatus}>Update Status</button>
      </div>

      {deliveryInfo && (
        <div style={{ marginTop: "20px" }}>
          <h3>Delivery Info:</h3>
          <pre>{JSON.stringify(deliveryInfo, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default DeliveryStatusComponent;
