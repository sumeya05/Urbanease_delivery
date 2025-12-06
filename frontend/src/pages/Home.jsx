import React, { useState, useEffect } from "react";
import { fetchCategories } from "../api/category.service";
import { fetchProducts } from "../api/product.service";
import CategoryNav from "../components/store/CategoryNav";
import ProductList from "../components/store/ProductList";
import { useCart } from "../hooks/useCart";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategories();
      setCategories(data);
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts(selectedCategory);
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
      }
    };
    loadProducts();
  }, [selectedCategory]);

  return (
    <div className="home">
      <CategoryNav
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <ProductList products={products} onAddToCart={addToCart} />
    </div>
  );
};

export default Home;
