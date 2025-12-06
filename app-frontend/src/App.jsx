import React, { useEffect, useState } from "react";

const API = "http://127.0.0.1:8000";

function App() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetch(API + "/categories")
      .then((r) => r.json())
      .then(setCategories);
  }, []);

  useEffect(() => {
    fetch(API + `/products?category=${selectedCategory || ""}`)
      .then((r) => r.json())
      .then(setProducts);
  }, [selectedCategory]);

  return (
    <div style={{ padding: 40 }}>
      <h1>UrbanEase Delivery</h1>

      <h2>Categories</h2>
      <div style={{ display: "flex", gap: 10 }}>
        {categories.map((c) => (
          <button key={c.id} onClick={() => setSelectedCategory(c.id)}>
            {c.name}
          </button>
        ))}
      </div>

      <h2>Products</h2>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {products.map((p) => (
          <div key={p.id} style={{ padding: 20, border: "1px solid #ccc" }}>
            <h3>{p.name}</h3>
            <p>${p.price}</p>
            <button onClick={() => setCart([...cart, p])}>Add to cart</button>
          </div>
        ))}
      </div>

      <h2>Cart ({cart.length})</h2>
      <ul>
        {cart.map((item, i) => (
          <li key={i}>
            {item.name} — ${item.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
