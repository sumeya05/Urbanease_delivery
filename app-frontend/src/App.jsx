import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8000/api";

function App() {
  // --- STATE: DATA ---
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  // --- STATE: FORMS ---
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  const [orderSearch, setOrderSearch] = useState("");
  const [statusUpdateOrderId, setStatusUpdateOrderId] = useState("");
  const [statusUpdateValue, setStatusUpdateValue] = useState("");
  const [driverName, setDriverName] = useState("");

  const [activePanel, setActivePanel] = useState("products"); // sidebar

  const [cartMessage, setCartMessage] = useState("");
  const [discountMessage, setDiscountMessage] = useState("");
  const [adminMessage, setAdminMessage] = useState("");

  const [sortOption, setSortOption] = useState("");

  // --- INITIAL LOAD ---
  useEffect(() => {
    fetchCategories();
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchCategories = () =>
    axios.get(`${API_BASE}/categories`).then((res) => setCategories(res.data));
  const fetchProducts = () =>
    axios.get(`${API_BASE}/products`).then((res) => setProducts(res.data));
  const fetchOrders = () =>
    axios.get(`${API_BASE}/orders`).then((res) => setOrders(res.data));

  // --- HANDLERS ---
  const addToCart = (product) => {
    const existing = cart.find((p) => p.id === product.id);
    if (existing)
      setCart(
        cart.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        )
      );
    else setCart([...cart, { ...product, quantity: 1 }]);
    setCartMessage(`${product.name} added to cart`);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((p) => p.id !== id));
    setCartMessage("Item removed");
  };

  const clearCart = () => {
    setCart([]);
    setCartMessage("Cart cleared");
    setDiscountApplied(false);
  };

  const changeQuantity = (id, delta) => {
    setCart(
      cart.map((p) =>
        p.id === id ? { ...p, quantity: Math.max(1, p.quantity + delta) } : p
      )
    );
  };

  const placeOrder = () => {
    if (!customerName || !customerPhone || !customerAddress) {
      setCartMessage("Fill all customer details");
      return;
    }
    if (cart.length === 0) {
      setCartMessage("Cart empty");
      return;
    }

    const data = {
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_address: customerAddress,
      items: cart.map((p) => ({ product_id: p.id, quantity: p.quantity })),
    };
    axios
      .post(`${API_BASE}/orders`, data)
      .then((res) => {
        setOrders([...orders, res.data]);
        setCart([]);
        setDiscountApplied(false);
        setCartMessage("Order placed successfully!");
      })
      .catch(console.error);
  };

  const applyDiscount = () => {
    if (discountCode === "SAVE10") {
      setDiscountApplied(true);
      setDiscountMessage("10% off applied!");
    } else {
      setDiscountApplied(false);
      setDiscountMessage("Invalid code");
    }
  };

  const updateStatus = () => {
    if (!statusUpdateOrderId || !statusUpdateValue) {
      setAdminMessage("Provide Order ID & status");
      return;
    }
    axios
      .put(
        `${API_BASE}/delivery/${statusUpdateOrderId}/status?status=${statusUpdateValue}&driver_name=${driverName}`
      )
      .then(() => {
        setAdminMessage("Status updated!");
        fetchOrders();
      })
      .catch(console.error);
  };

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

  const inputStyle = {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    width: "100%",
    boxSizing: "border-box",
    fontSize: "14px",
  };
  const cardStyle = {
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    background: "#fff",
    marginBottom: "20px",
  };

  return (
    <div
      style={{
        fontFamily: "Segoe UI, sans-serif",
        padding: "30px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ color: "#ff5722", textAlign: "center" }}>
        🌈 UrbanEase Dashboard
      </h1>

      <div style={{ display: "flex", gap: "20px", marginTop: "30px" }}>
        {/* Sidebar */}
        <div
          style={{
            width: "220px",
            background: "#ff9800",
            padding: "15px",
            borderRadius: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <h2 style={{ color: "#fff" }}>Menu</h2>
          <button onClick={() => setActivePanel("products")}>Products</button>
          <button onClick={() => setActivePanel("cart")}>Cart</button>
          <button onClick={() => setActivePanel("orders")}>Orders</button>
          <button onClick={() => setActivePanel("admin")}>Admin</button>

          <h3 style={{ color: "#fff", marginTop: "20px" }}>Categories</h3>
          {categories.map((c) => (
            <button key={c.id} onClick={() => setSelectedCategory(c.id)}>
              {c.name}
            </button>
          ))}
          <button onClick={() => setSelectedCategory(null)}>All</button>

          <h3 style={{ color: "#fff", marginTop: "20px" }}>Sort</h3>
          <select
            onChange={(e) => setSortOption(e.target.value)}
            style={inputStyle}
          >
            <option value="">Default</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>

        {/* Main Panel */}
        <div style={{ flex: 1 }}>
          {/* Products Panel */}
          {activePanel === "products" && (
            <div style={cardStyle}>
              <h2 style={{ color: "#d84315" }}>Products</h2>
              <input
                style={inputStyle}
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "15px",
                  marginTop: "15px",
                }}
              >
                {products.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      padding: "15px",
                      background: "#ffccbc",
                      borderRadius: "10px",
                      flex: "1 1 150px",
                      textAlign: "center",
                    }}
                  >
                    <h3 style={{ color: "#d84315" }}>{p.name}</h3>
                    <p>${p.price}</p>
                    <button
                      onClick={() => addToCart(p)}
                      style={{
                        padding: "8px",
                        background: "#ff5722",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                      }}
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cart Panel */}
          {activePanel === "cart" && (
            <div style={cardStyle}>
              <h2 style={{ color: "#2e7d32" }}>🛒 Cart ({cart.length})</h2>
              {cartMessage && (
                <div
                  style={{
                    background: "#ffe082",
                    padding: "5px",
                    borderRadius: "5px",
                    marginBottom: "10px",
                  }}
                >
                  {cartMessage}
                </div>
              )}
              <ul>
                {cart.map((item) => (
                  <li key={item.id} style={{ marginBottom: "8px" }}>
                    {item.name} x {item.quantity} (${item.price})
                    <button onClick={() => changeQuantity(item.id, 1)}>
                      +
                    </button>
                    <button onClick={() => changeQuantity(item.id, -1)}>
                      -
                    </button>
                    <button onClick={() => removeFromCart(item.id)}>
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <p>Total: ${discountedTotal}</p>
              <input
                style={inputStyle}
                placeholder="Discount code"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
              />
              <button onClick={applyDiscount}>Apply Discount</button>
              {discountMessage && <div>{discountMessage}</div>}

              <input
                style={inputStyle}
                placeholder="Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
              <input
                style={inputStyle}
                placeholder="Phone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
              <input
                style={inputStyle}
                placeholder="Address"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
              />

              <button onClick={clearCart}>Clear Cart</button>
              <button onClick={placeOrder}>Place Order</button>
            </div>
          )}

          {/* Orders Panel */}
          {activePanel === "orders" && (
            <div style={cardStyle}>
              <h2>📦 Orders</h2>
              <input
                style={inputStyle}
                placeholder="Search order ID / customer"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
              />
              <table
                style={{
                  width: "100%",
                  marginTop: "10px",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Items</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((o) => (
                    <tr
                      key={o.id}
                      style={{
                        background:
                          o.status === "Delivered" ? "#c8e6c9" : "#ffe0b2",
                      }}
                    >
                      <td>{o.id}</td>
                      <td>{o.customer_name}</td>
                      <td>{o.status}</td>
                      <td>
                        {o.items.map((i) => (
                          <div key={i.product_id}>
                            {i.name} x {i.quantity}
                          </div>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Admin Panel */}
          {activePanel === "admin" && (
            <div style={cardStyle}>
              <h2>🛠 Admin / Driver</h2>
              {adminMessage && (
                <div
                  style={{
                    background: "#ffe082",
                    padding: "5px",
                    borderRadius: "5px",
                  }}
                >
                  {adminMessage}
                </div>
              )}
              <input
                style={inputStyle}
                placeholder="Order ID"
                value={statusUpdateOrderId}
                onChange={(e) => setStatusUpdateOrderId(e.target.value)}
              />
              <input
                style={inputStyle}
                placeholder="New Status"
                value={statusUpdateValue}
                onChange={(e) => setStatusUpdateValue(e.target.value)}
              />
              <input
                style={inputStyle}
                placeholder="Driver Name"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
              />
              <button onClick={updateStatus}>Update Status</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
