import React, { useState, useEffect } from "react";
import axios from "axios";

function DeliveryApp() {
  // --- STATE: DATA ---
  const [drivers, setDrivers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);

  // --- STATE: FORMS ---
  const [driverName, setDriverName] = useState("");
  const [driverPhone, setDriverPhone] = useState("");
  const [driverCarNumber, setDriverCarNumber] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  // Load customers from localStorage on mount
  useEffect(() => {
    const savedCustomers = localStorage.getItem("customers");
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    }
  }, []);

  // Save customers to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("customers", JSON.stringify(customers));
  }, [customers]);

  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [quantity, setQuantity] = useState(1);

  // --- FETCH INITIAL DATA ---
  useEffect(() => {
    fetchDrivers();
    fetchCustomers();
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchDrivers = () => {
    axios
      .get("http://127.0.0.1:8000/drivers")
      .then((res) => setDrivers(res.data))
      .catch((err) =>
        console.error("Error fetching drivers:", err.response || err)
      );
  };

  const fetchCustomers = () => {
    axios
      .get("http://127.0.0.1:8000/customers")
      .then((res) => setCustomers(res.data))
      .catch((err) =>
        console.error("Error fetching customers:", err.response || err)
      );
  };

  const fetchProducts = () => {
    axios
      .get("http://127.0.0.1:8000/products")
      .then((res) => setProducts(res.data))
      .catch((err) =>
        console.error("Error fetching products:", err.response || err)
      );
  };

  // --- HANDLERS ---
  const handleAddDriver = (e) => {
    e.preventDefault();
    const newDriver = {
      name: driverName,
      phone: driverPhone,
      car_number: driverCarNumber,
    };
    axios
      .post("http://127.0.0.1:8000/drivers/", newDriver)
      .then((res) => {
        setDrivers([...drivers, res.data]);
        setDriverName("");
        setDriverPhone("");
        setDriverCarNumber("");
      })
      .catch((err) =>
        console.error("Error adding driver:", err.response || err)
      );
  };

  const handleAddCustomer = (e) => {
    e.preventDefault();
    const newCustomer = {
      name: customerName,
      email: customerEmail,
      phone: customerPhone,
    };
    axios
      .post("http://127.0.0.1:8000/customers/", newCustomer)
      .then((res) => {
        setCustomers([...customers, res.data]);
        setCustomerName("");
        setCustomerEmail("");
        setCustomerPhone("");
      })
      .catch((err) =>
        console.error("Error adding customer:", err.response || err)
      );
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!productName || quantity <= 0) return;
    const existing = cart.find((p) => p.name === productName);
    if (existing) {
      setCart(
        cart.map((p) =>
          p.name === productName ? { ...p, qty: p.qty + Number(quantity) } : p
        )
      );
    } else {
      setCart([
        ...cart,
        {
          name: productName,
          qty: Number(quantity),
          price: Number(productPrice),
        },
      ]);
    }
    setProductName("");
    setProductPrice("");
    setQuantity(1);
  };

  const handleRemoveFromCart = (name) => {
    setCart(cart.filter((p) => p.name !== name));
  };

  const handlePlaceOrder = () => {
    if (!customerName || cart.length === 0) {
      alert("Enter customer name and add products");
      return;
    }
    const customer = customers.find((c) => c.name === customerName);
    if (!customer) {
      alert("Customer not found. Please add the customer first.");
      return;
    }
    const promises = cart.map((item) => {
      const orderData = {
        customer_id: customer.id,
        item: item.name,
        quantity: item.qty,
      };
      return axios
        .post("http://127.0.0.1:8000/orders/", orderData)
        .catch((err) =>
          console.error("Error placing order:", err.response || err)
        );
    });
    Promise.all(promises).then(() => {
      fetchOrders();
      setCart([]);
      setCustomerName("");
      setCustomerPhone("");
      setCustomerEmail("");
      alert("Order placed successfully!");
    });
  };

  const fetchOrders = () => {
    axios
      .get("http://127.0.0.1:8000/orders")
      .then((res) => setOrders(res.data))
      .catch((err) =>
        console.error("Error fetching orders:", err.response || err)
      );
  };

  // --- STYLES ---
  const inputStyle = {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #6e3d3dff",
    fontSize: "14px",
  };
  const cardStyle = {
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  };

  return (
    <div
      style={{
        fontFamily: "Segoe UI",
        padding: "40px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: "2.5rem" }}>🚚 Delivery Dashboard</h1>
      {/* ADD DRIVER & CUSTOMER */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
          marginBottom: "40px",
        }}
      >
        {/* DRIVER FORM */}
        <div style={{ ...cardStyle, background: "#aebec9ff" }}>
          <h2>Add Driver</h2>
          <form
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            onSubmit={handleAddDriver}
          >
            <input
              placeholder="Name"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              style={inputStyle}
            />
            <input
              placeholder="Phone"
              value={driverPhone}
              onChange={(e) => setDriverPhone(e.target.value)}
              style={inputStyle}
            />
            <input
              placeholder="Car Number"
              value={driverCarNumber}
              onChange={(e) => setDriverCarNumber(e.target.value)}
              style={inputStyle}
            />
            <button
              type="submit"
              style={{
                padding: "12px",
                background: "#0288d1",
                color: "#070505ff",
                border: "none",
                borderRadius: "6px",
              }}
            >
              Create Driver
            </button>
          </form>

          <h3>Drivers Added ({drivers.length > 0 ? 1 : 0})</h3>
          {drivers.map((d, i) => (
            <div
              key={i}
              style={{
                background: "#8ca9c0ff",
                padding: "10px",
                marginBottom: "5px",
                borderRadius: "6px",
              }}
            >
              {d.name} - {d.phone} - {d.car_number}
            </div>
          ))}
        </div>

        {/* CUSTOMER FORM */}
        <div style={{ ...cardStyle, background: "#996868ff" }}>
          <h2>Add Customer</h2>
          <form
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            onSubmit={handleAddCustomer}
          >
            <input
              placeholder="Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              style={inputStyle}
            />
            <input
              placeholder="Email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              style={inputStyle}
            />
            <input
              placeholder="Phone"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              style={inputStyle}
            />
            <button
              type="submit"
              style={{
                padding: "12px",
                background: "#4caf50",
                color: "#421c1cff",
                border: "none",
                borderRadius: "6px",
              }}
            >
              Create Customer
            </button>
          </form>

          <h3>Customers Added ({customers.length})</h3>
          {customers.map((c, i) => (
            <div
              key={i}
              style={{
                background: "#5676a7ff",
                padding: "10px",
                marginBottom: "5px",
                borderRadius: "6px",
              }}
            >
              <p style={{ margin: "5px 0", fontWeight: "bold" }}>
                Name: {c.name}
              </p>
              <p style={{ margin: "5px 0" }}>Phone: {c.phone}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CART & PRODUCTS */}
      <div
        style={{ ...cardStyle, background: "#a19c94ff", marginBottom: "40px" }}
      >
        <h2>Add Product & Cart</h2>
        <form
          style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
          onSubmit={handleAddToCart}
        >
          <input
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Price"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            style={inputStyle}
          />
          <input
            type="number"
            min="1"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            style={{ ...inputStyle, width: "80px" }}
          />
          <button
            type="submit"
            style={{
              padding: "12px 24px",
              background: "#242221ff",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
            }}
          >
            Add to Cart
          </button>
        </form>

        {cart.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <h4>Cart</h4>
            {cart.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <span>
                  {item.name} x{item.qty} (${item.price * item.qty})
                </span>
                <button
                  onClick={() => handleRemoveFromCart(item.name)}
                  style={{
                    background: "#e53935",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={handlePlaceOrder}
              style={{
                padding: "12px 24px",
                background: "#1976d2",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                marginBottom: "40px",
              }}
            >
              Place Order
            </button>
          </div>
        )}
      </div>
      {/* ORDERS SUMMARY */}
      <div
        style={{
          background: "#337033ff",
          padding: "20px",
          borderRadius: "12px",
        }}
      >
        <h2>Orders Summary</h2>
        {orders.length === 0 ? (
          <p>No orders placed yet.</p>
        ) : (
          orders.map((order, i) => {
            const customer = customers.find((c) => c.id === order.customer_id);
            return (
              <div
                key={i}
                style={{
                  background: "#5c755dff",
                  padding: "10px",
                  marginBottom: "10px",
                  borderRadius: "6px",
                }}
              >
                <p>Customer: {customer ? customer.name : "Unknown"}</p>
                <p>Item: {order.item}</p>
                <p>Quantity: {order.quantity}</p>
                <p>Status: {order.status}</p>
                <p>Created At: {new Date(order.created_at).toLocaleString()}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default DeliveryApp;
