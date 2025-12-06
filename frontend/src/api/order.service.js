const API_BASE_URL = "http://localhost:8000"; // Adjust based on your backend URL

export const createOrder = async (orderData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) {
      throw new Error("Failed to create order");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const fetchOrdersByCustomer = async (customerName) => {
  const response = await fetch(`${API_BASE_URL}/api/orders/${customerName}`);
  return await response.json();
};
