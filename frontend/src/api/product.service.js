const API_BASE_URL = "http://localhost:8000"; // Adjust based on your backend URL

export const fetchProducts = async (categoryId = null) => {
  const url = categoryId
    ? `${API_BASE_URL}/api/products?category_id=${categoryId}`
    : `${API_BASE_URL}/api/products`;
  const response = await fetch(url);
  return await response.json();
};
