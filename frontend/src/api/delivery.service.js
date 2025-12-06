const API_BASE_URL = "http://localhost:8000"; // Adjust based on your backend URL

export const fetchDeliveryStatus = async (orderId) => {
  const response = await fetch(`${API_BASE_URL}/api/delivery/${orderId}`);
  return await response.json();
};

export const updateDeliveryStatus = async (
  orderId,
  status,
  driverName = null
) => {
  const url = new URL(`${API_BASE_URL}/api/delivery/${orderId}/status`);
  url.searchParams.append("status", status);
  if (driverName) {
    url.searchParams.append("driver_name", driverName);
  }
  const response = await fetch(url, {
    method: "PUT",
  });
  return await response.json();
};
