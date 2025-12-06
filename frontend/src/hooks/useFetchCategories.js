import { useState, useEffect } from "react";
import { fetchCategories } from "../api/category.service";

export const useFetchCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategories();
      setCategories(data);
    };
    loadCategories();
  }, []);

  return { categories };
};
