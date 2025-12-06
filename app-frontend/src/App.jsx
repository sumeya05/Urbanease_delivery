import React, { useEffect, useState } from "react";
import "./App.css";

const API_BASE = "http://localhost:8000/api";

export default function App() {
  // --- States ---
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);

  // --- Customer info ---
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  // --- Admin / Tracker ---
  const [orderSearch, setOrderSearch] = useState("");
  const [statusUpdateOrderId, setStatusUpdateOrderId] = useState("");
  const [statusUpdateValue, setStatusUpdateValue] = useState("");
  const [driverName, setDriverName] = useState("");

  // --- Sorting / Product selection ---
  const [sortOption, setSortOption] = useState("");

  // --- Fetch categories ---
  useEffect(() => {
    fetch(`${API_BASE}/categories`)
      .then((res) => res.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  // --- Fetch products ---
  useEffect(() => {
    let url = selectedCategory
      ? `${API_BASE}/products?category=${selectedCategory}`
      : `${API_BASE}/products`;
    if (searchTerm) url += `&search=${searchTerm}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (sortOption === "price-asc") data.sort((a, b) => a.price - b.price);
        if (sortOption === "price-desc") data.sort((a, b) => b.price - a.price);
        if (sortOption === "name")
          data.sort((a, b) => a.name.localeCompare(b.name));
        setProducts(data);
      })
      .catch(console.error);
  }, [selectedCategory, searchTerm, sortOption]);

  // --- Fetch orders (polling every 5s) ---
  const fetchOrders = () => {
    fetch(`${API_BASE}/orders`)
      .then((res) => res.json())
      .then(setOrders)
      .catch(console.error);
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  // --- Cart handlers ---
  const addToCart = (product) => {
    const existing = cart.find((p) => p.id === product.id);
    if (existing) {
      setCart(
        cart.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => setCart(cart.filter((p) => p.id !== id));
  const clearCart = () => setCart([]);
  const changeQuantity = (id, delta) => {
    setCart(
      cart.map((p) =>
        p.id === id ? { ...p, quantity: Math.max(1, p.quantity + delta) } : p
      )
    );
  };

  // --- Place order ---
  const placeOrder = () => {
    if (!customerName || !customerPhone || !customerAddress)
      return alert("Please fill customer details!");
    if (cart.length === 0) return alert("Cart is empty!");
    const orderData = {
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_address: customerAddress,
      items: cart.map((p) => ({ product_id: p.id, quantity: p.quantity })),
    };
    fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    })
      .then((res) => res.json())
      .then((order) => {
        setOrders([...orders, order]);
        setCart([]);
        setDiscountApplied(false);
        alert("Order placed!");
      })
      .catch(console.error);
  };

  const cancelOrder = (id) => {
    fetch(`${API_BASE}/orders/${id}`, { method: "DELETE" })
      .then(() => setOrders(orders.filter((o) => o.id !== id)))
      .catch(console.error);
  };

  // --- Discount ---
  const applyDiscount = () => {
    if (discountCode === "SAVE10") {
      setDiscountApplied(true);
      alert("10% discount applied!");
    } else {
      alert("Invalid code");
      setDiscountApplied(false);
    }
  };

  // --- Admin update ---
  const updateStatus = () => {
    if (!statusUpdateOrderId || !statusUpdateValue)
      return alert("Provide Order ID and new status");
    fetch(
      `${API_BASE}/delivery/${statusUpdateOrderId}/status?status=${statusUpdateValue}&driver_name=${driverName}`,
      { method: "PUT" }
    )
      .then(() => {
        alert("Status updated!");
        fetchOrders();
      })
      .catch(console.error);
  };

  // --- Derived totals ---
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discountedTotal = discountApplied
    ? (cartTotal * 0.9).toFixed(2)
    : cartTotal.toFixed(2);

  const filteredOrders = orderSearch
    ? orders.filter(
        (o) =>
          o.id.toString() === orderSearch ||
          o.customer_name.toLowerCase().includes(orderSearch.toLowerCase())
      )
    : orders;

  return (
    <div className="app-container">
      <h1>🚀 UrbanEase Delivery</h1>

      <div className="main-layout">
        {/* --- Sidebar --- */}
        <div className="sidebar">
          <h3>Categories</h3>
          {categories.map((c) => (
            <button
              key={c.id}
              className={selectedCategory === c.id ? "active" : ""}
              onClick={() => setSelectedCategory(c.id)}
            >
              {c.name}
            </button>
          ))}
          <button onClick={() => setSelectedCategory(null)}>All</button>

          <h3>Products</h3>
          <select onChange={(e) => addToCart(JSON.parse(e.target.value))}>
            <option value="">Select product</option>
            {products.map((p) => (
              <option key={p.id} value={JSON.stringify(p)}>
                {p.name} (${p.price})
              </option>
            ))}
          </select>

          <h3>Customer Info</h3>
          <input
            placeholder="Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
          <input
            placeholder="Phone"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
          />
          <input
            placeholder="Address"
            value={customerAddress}
            onChange={(e) => setCustomerAddress(e.target.value)}
          />

          <h3>Discount</h3>
          <input
            placeholder="Discount code"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
          />
          <button onClick={applyDiscount}>Apply Discount</button>

          <h3>Actions</h3>
          <button onClick={placeOrder}>Place Order</button>
          <button onClick={clearCart}>Clear Cart</button>

          <h3>Admin / Driver</h3>
          <input
            placeholder="Order ID"
            value={statusUpdateOrderId}
            onChange={(e) => setStatusUpdateOrderId(e.target.value)}
          />
          <input
            placeholder="Status"
            value={statusUpdateValue}
            onChange={(e) => setStatusUpdateValue(e.target.value)}
          />
          <input
            placeholder="Driver Name"
            value={driverName}
            onChange={(e) => setDriverName(e.target.value)}
          />
          <button onClick={updateStatus}>Update Status</button>
        </div>

        {/* --- Main Panel --- */}
        <div className="main-panel">
          <h2>🛒 Cart</h2>
          {cart.length === 0 ? (
            <p>Cart is empty</p>
          ) : (
            <ul>
              {cart.map((item) => (
                <li key={item.id}>
                  {item.name} x {item.quantity} (${item.price})
                  <button onClick={() => changeQuantity(item.id, 1)}>+</button>
                  <button onClick={() => changeQuantity(item.id, -1)}>-</button>
                  <button onClick={() => removeFromCart(item.id)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p>Total: ${discountedTotal}</p>

          <h2>📦 Orders</h2>
          <input
            placeholder="Search Order ID / Customer"
            value={orderSearch}
            onChange={(e) => setOrderSearch(e.target.value)}
          />
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Items</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.customer_name}</td>
                  <td>{o.status}</td>
                  <td>
                    {o.items.map((item) => (
                      <div key={item.product_id}>
                        {item.name} x {item.quantity}
                      </div>
                    ))}
                  </td>
                  <td>
                    <button onClick={() => cancelOrder(o.id)}>Cancel</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
