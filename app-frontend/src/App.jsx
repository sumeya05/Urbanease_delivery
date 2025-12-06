import React, { useEffect, useState } from "react";

const API_BASE = "http://localhost:8000/api";

export default function App() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  // --- Fetch categories ---
  useEffect(() => {
    fetch(`${API_BASE}/categories`)
      .then((res) => res.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  // --- Fetch products ---
  useEffect(() => {
    const url = selectedCategory
      ? `${API_BASE}/products?category=${selectedCategory}`
      : `${API_BASE}/products`;
    fetch(url)
      .then((res) => res.json())
      .then(setProducts)
      .catch(console.error);
  }, [selectedCategory]);

  // --- Fetch orders and poll for updates ---
  const fetchOrders = () => {
    fetch(`${API_BASE}/orders`)
      .then((res) => res.json())
      .then(setOrders)
      .catch(console.error);
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // --- Cart handlers ---
  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  // --- Order placement ---
  const placeOrder = () => {
    if (cart.length === 0) return alert("Cart is empty!");
    const orderData = {
      items: cart.map((p) => ({ product_id: p.id, quantity: 1 })),
    };

    fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    })
      .then((res) => res.json())
      .then((order) => {
        setOrders((prev) => [...prev, order]);
        setCart([]);
        alert("Order placed!");
      })
      .catch(console.error);
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "30px" }}>
      <h1>📦 UrbanEase Delivery</h1>

      {/* Categories */}
      <div style={{ marginBottom: "20px" }}>
        <strong>Categories: </strong>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            style={{
              margin: "0 5px",
              padding: "8px 12px",
              background: selectedCategory === c.id ? "#0288d1" : "#ccc",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {c.name}
          </button>
        ))}
        <button
          onClick={() => setSelectedCategory(null)}
          style={{
            margin: "0 5px",
            padding: "8px 12px",
            background: "#555",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          All
        </button>
      </div>

      {/* Products */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))",
          gap: "20px",
        }}
      >
        {products.map((p) => (
          <div
            key={p.id}
            style={{
              padding: "15px",
              border: "1px solid #ddd",
              borderRadius: "6px",
            }}
          >
            <h3>{p.name}</h3>
            <p>Price: ${p.price}</p>
            <button
              onClick={() => addToCart(p)}
              style={{
                padding: "8px 12px",
                background: "#4caf50",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Cart */}
      <div style={{ marginTop: "40px" }}>
        <h2>🛒 Cart ({cart.length})</h2>
        {cart.length === 0 ? (
          <p>No items in cart.</p>
        ) : (
          <>
            <ul>
              {cart.map((item, i) => (
                <li key={i} style={{ marginBottom: "8px" }}>
                  {item.name} - ${item.price}{" "}
                  <button
                    onClick={() => removeFromCart(i)}
                    style={{
                      padding: "2px 6px",
                      marginLeft: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={placeOrder}
              style={{
                marginTop: "10px",
                padding: "10px 16px",
                background: "#ff9800",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Place Order
            </button>
          </>
        )}
      </div>

      {/* Orders with real-time status */}
      <div style={{ marginTop: "40px" }}>
        <h2>📦 Orders ({orders.length})</h2>
        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <ul>
            {orders.map((o) => (
              <li
                key={o.id}
                style={{
                  marginBottom: "12px",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                }}
              >
                <strong>Order #{o.id}</strong> - Status:{" "}
                <span
                  style={{
                    color: o.status === "Delivered" ? "green" : "orange",
                  }}
                >
                  {o.status}
                </span>
                <br />
                Items:
                <ul>
                  {o.items.map((item) => (
                    <li key={item.product_id}>
                      {item.name} x {item.quantity}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
