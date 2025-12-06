const API_BASE_URL = "http://localhost:8000"; // Adjust based on your backend URL

export const createOrder = async (orderData) => {
  // Assuming orderData has customer_id and items
  const response = await fetch(`${API_BASE_URL}/api/orders/`, {
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
};

export const fetchOrdersByCustomer = async (customerName) => {
  const response = await fetch(
    `${API_BASE_URL}/api/orders/customer/${customerName}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }
  return await response.json();
};
