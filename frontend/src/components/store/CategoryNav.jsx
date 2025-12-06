import React from "react";

const CategoryNav = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <nav className="category-nav">
      <button
        className={selectedCategory === null ? "active" : ""}
        onClick={() => onSelectCategory(null)}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          className={selectedCategory === category.id ? "active" : ""}
          onClick={() => onSelectCategory(category.id)}
        >
          {category.name}
        </button>
      ))}
    </nav>
  );
};

export default CategoryNav;
