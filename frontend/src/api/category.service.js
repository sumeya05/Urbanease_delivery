const API_BASE_URL = "http://localhost:8000"; // Adjust based on your backend URL

export const fetchCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/api/categories`);
  return await response.json();
};
