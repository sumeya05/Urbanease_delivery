import React, { useState } from "react";
import { useCart } from "../hooks/useCart";
import { createOrder } from "../api/order.service";

const Checkout = () => {
  const { cart, getTotalPrice, clearCart } = useCart();
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderData = {
      customer: customerDetails,
      items: cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      total_price: getTotalPrice(),
    };
    await createOrder(orderData);
    clearCart();
    alert("Order placed successfully!");
  };

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="order-summary">
        <h3>Order Summary</h3>
        <ul>
          {cart.map((item) => (
            <li key={item.id}>
              {item.name} x {item.quantity} - ${item.price * item.quantity}
            </li>
          ))}
        </ul>
        <p>Total: ${getTotalPrice()}</p>
      </div>
      <form onSubmit={handleSubmit}>
        <h3>Customer Details</h3>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={customerDetails.name}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Phone:
          <input
            type="tel"
            name="phone"
            value={customerDetails.phone}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Address:
          <textarea
            name="address"
            value={customerDetails.address}
            onChange={handleInputChange}
            required
          />
        </label>
        <button type="submit">Place Order</button>
      </form>
    </div>
  );
};

export default Checkout;
