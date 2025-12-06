const API_BASE_URL = "http://localhost:8000"; // Adjust based on your backend URL

export const fetchDeliveryStatus = async (orderId) => {
  const response = await fetch(`${API_BASE_URL}/api/delivery/order/${orderId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch delivery status");
  }
  return await response.json();
};

export const updateDeliveryStatus = async (
  orderId,
  status,
  driverName = null
) => {
  const response = await fetch(
    `${API_BASE_URL}/api/delivery/order/${orderId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_id: orderId,
        status,
        driver_name: driverName,
      }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update delivery status");
  }
  return await response.json();
};
