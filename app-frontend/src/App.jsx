import React, { useEffect, useState } from "react";
import "./app.css";

const API_BASE = "http://localhost:8000/api";

export default function App() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/categories`)
      .then((res) => res.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  useEffect(() => {
    let url = selectedCategory
      ? `${API_BASE}/products?category=${selectedCategory}`
      : `${API_BASE}/products`;
    if (searchTerm) url += `&search=${searchTerm}`;
    fetch(url)
      .then((res) => res.json())
      .then(setProducts)
      .catch(console.error);
  }, [selectedCategory, searchTerm]);

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

  // --- Orders ---
  const placeOrder = () => {
    if (cart.length === 0) return alert("Cart is empty!");
    const orderData = {
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

  // --- Discounts ---
  const applyDiscount = () => {
    if (discountCode === "SAVE10") {
      setDiscountApplied(true);
      alert("10% discount applied!");
    } else {
      alert("Invalid code");
      setDiscountApplied(false);
    }
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discountedTotal = discountApplied
    ? (cartTotal * 0.9).toFixed(2)
    : cartTotal.toFixed(2);

  return (
    <div className="app-container">
      <h1>📦 UrbanEase Delivery</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {/* Categories */}
      <div className="categories">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={
              selectedCategory === c.id ? "category-btn active" : "category-btn"
            }
          >
            {c.name}
          </button>
        ))}
        <button
          onClick={() => setSelectedCategory(null)}
          className="category-btn all-btn"
        >
          All
        </button>
      </div>

      {/* Price Filter */}
      <div className="price-filters">
        <button
          onClick={() => setProducts(products.filter((p) => p.price < 5))}
        >
          Under $5
        </button>
        <button
          onClick={() =>
            setProducts(products.filter((p) => p.price >= 5 && p.price <= 20))
          }
        >
          $5–$20
        </button>
        <button
          onClick={() => setProducts(products.filter((p) => p.price > 20))}
        >
          Above $20
        </button>
      </div>

      {/* Products */}
      <div className="products-grid">
        {products.map((p) => (
          <div key={p.id} className="product-card">
            <h3>{p.name}</h3>
            <p>Price: ${p.price}</p>
            <button onClick={() => addToCart(p)} className="add-cart-btn">
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Cart */}
      <div className="cart-section">
        <h2>🛒 Cart ({cart.length})</h2>
        {cart.length === 0 ? (
          <p>No items in cart.</p>
        ) : (
          <>
            <ul>
              {cart.map((item) => (
                <li key={item.id}>
                  {item.name} - ${item.price} x {item.quantity}
                  <button onClick={() => changeQuantity(item.id, 1)}>+</button>
                  <button onClick={() => changeQuantity(item.id, -1)}>-</button>
                  <button onClick={() => removeFromCart(item.id)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <p>Total: ${discountedTotal}</p>
            <input
              type="text"
              placeholder="Discount code"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
            />
            <button onClick={applyDiscount}>Apply Discount</button>
            <button onClick={clearCart}>Clear Cart</button>
            <button onClick={placeOrder}>Place Order</button>
          </>
        )}
      </div>

      {/* Orders */}
      <div className="orders-section">
        <h2>📦 Orders ({orders.length})</h2>
        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <ul>
            {orders.map((o) => (
              <li key={o.id} className="order-card">
                <strong>Order #{o.id}</strong> - Status:{" "}
                <span
                  className={o.status === "Delivered" ? "delivered" : "pending"}
                >
                  {o.status}
                </span>
                <button onClick={() => cancelOrder(o.id)}>Cancel</button>
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
