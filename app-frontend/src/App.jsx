import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  // --- STATE: DATA ---
  const [drivers, setDrivers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  // --- STATE: FORMS ---
  const [driverName, setDriverName] = useState("");
  const [driverPhone, setDriverPhone] = useState("");

  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [selectedDriver, setSelectedDriver] = useState(drivers[0]?.id || "");

  const [feedbackOrderId, setFeedbackOrderId] = useState(orders[0]?.id || "");
  const [feedbackContent, setFeedbackContent] = useState("");

  // --- INITIAL LOAD ---
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get("http://127.0.0.1:8000/orders")
      .then((res) => setOrders(res.data));
    axios
      .get("http://127.0.0.1:8000/drivers")
      .then((res) => setDrivers(res.data));
    axios
      .get("http://127.0.0.1:8000/feedbacks")
      .then((res) => setFeedbacks(res.data));
  };

  // --- HANDLERS ---
  const handleAddDriver = (e) => {
    e.preventDefault();
    axios
      .post("http://127.0.0.1:8000/drivers", {
        id: 0,
        name: driverName,
        phone: driverPhone,
      })
      .then(() => {
        setDriverName("");
        setDriverPhone("");
        fetchData();
      })
      .catch((err) => console.error(err));
  };

  const handleAddOrder = (e) => {
    e.preventDefault();
    if (!selectedDriver) return alert("Select a driver!");
    axios
      .post("http://127.0.0.1:8000/orders", {
        id: 0,
        item,
        quantity,
        order_date: orderDate,
        driver_id: selectedDriver,
      })
      .then(() => {
        setItem("");
        setQuantity("");
        setOrderDate("");
        fetchData();
      })
      .catch((err) => console.error(err));
  };

  const handleAddFeedback = (e) => {
    e.preventDefault();
    if (!feedbackOrderId) return alert("Select an order!");

    axios
      .post("http://127.0.0.1:8000/feedbacks", {
        id: 0,
        content: feedbackContent,
        order_id: feedbackOrderId,
      })
      .then(() => {
        setFeedbackContent("");
        fetchData();
      })
      .catch((err) => console.error(err));
  };

  // --- STYLES ---
  const inputStyle = {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    width: "100%",
    fontSize: "14px",
  };

  const cardStyle = {
    padding: "20px",
    borderRadius: "10px",
    background: "#f0f0f0",
    color: "#333",
  };

  const sectionTitleStyle = {
    marginTop: 0,
    marginBottom: "15px",
    fontWeight: "bold",
  };

  const buttonStyle = {
    padding: "10px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "30px",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "30px" }}>
        🚚 Urbanease Delivery Dashboard
      </h1>

      {/* FORMS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "30px",
          marginBottom: "30px",
        }}
      >
        {/* Add Driver */}
        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>Add Driver</h2>
          <form
            onSubmit={handleAddDriver}
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <input
              type="text"
              placeholder="Driver Name"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              style={inputStyle}
              required
            />
            <input
              type="text"
              placeholder="Phone"
              value={driverPhone}
              onChange={(e) => setDriverPhone(e.target.value)}
              style={inputStyle}
            />
            <button type="submit" style={buttonStyle}>
              Add Driver
            </button>
          </form>
        </div>

        {/* Add Order */}
        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>Add Order</h2>
          <form
            onSubmit={handleAddOrder}
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <input
              type="text"
              placeholder="Item"
              value={item}
              onChange={(e) => setItem(e.target.value)}
              style={inputStyle}
              required
            />
            <input
              type="text"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Date"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
              style={inputStyle}
            />
            <select
              value={selectedDriver}
              onChange={(e) => setSelectedDriver(e.target.value)}
              style={inputStyle}
            >
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <button type="submit" style={buttonStyle}>
              Add Order
            </button>
          </form>
        </div>
      </div>

      {/* Add Feedback */}
      <div style={{ ...cardStyle, marginBottom: "30px" }}>
        <h2 style={sectionTitleStyle}>Add Feedback</h2>
        <form
          onSubmit={handleAddFeedback}
          style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
        >
          <select
            value={feedbackOrderId}
            onChange={(e) => setFeedbackOrderId(e.target.value)}
            style={inputStyle}
          >
            {orders.map((o) => (
              <option key={o.id} value={o.id}>
                {o.item}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Feedback"
            value={feedbackContent}
            onChange={(e) => setFeedbackContent(e.target.value)}
            style={inputStyle}
            required
          />
          <button type="submit" style={buttonStyle}>
            Submit
          </button>
        </form>
      </div>

      {/* DISPLAY LISTS */}
      <div
        style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "30px" }}
      >
        {/* Orders */}
        <div>
          <h2 style={{ borderBottom: "2px solid #ccc", paddingBottom: "5px" }}>
            Orders ({orders.length})
          </h2>
          {orders.map((order) => {
            const orderFeedbacks = feedbacks.filter(
              (f) => f.order_id === order.id
            );
            return (
              <div
                key={order.id}
                style={{
                  background: "#fff",
                  padding: "15px",
                  marginBottom: "10px",
                  borderRadius: "8px",
                }}
              >
                <h3 style={{ margin: "0 0 5px 0" }}>{order.item}</h3>
                <p style={{ margin: "0 0 5px 0" }}>
                  Quantity: {order.quantity}
                </p>
                <p
                  style={{
                    margin: "0 0 5px 0",
                    fontSize: "0.9rem",
                    color: "#666",
                  }}
                >
                  Driver:{" "}
                  {drivers.find((d) => d.id === order.driver_id)?.name || "N/A"}
                </p>
                <p
                  style={{
                    margin: "0 0 5px 0",
                    fontSize: "0.9rem",
                    color: "#666",
                  }}
                >
                  Date: {order.order_date}
                </p>
                <div>
                  <strong>Feedback:</strong>
                  {orderFeedbacks.length === 0 ? (
                    <p style={{ margin: 0 }}>No feedback yet.</p>
                  ) : (
                    orderFeedbacks.map((f) => (
                      <p key={f.id} style={{ margin: "0 0 3px 0" }}>
                        - {f.content}
                      </p>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Drivers */}
        <div
          style={{
            background: "#f9f9f9",
            padding: "15px",
            borderRadius: "10px",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Drivers</h3>
          <ul>
            {drivers.map((d) => (
              <li key={d.id}>
                {d.name} ({d.phone})
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
