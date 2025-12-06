import React from "react";
import Card from "../common/Card";

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <Card className="product-card">
      <img src={product.image_url} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p className="price">${product.price}</p>
      <button onClick={() => onAddToCart(product)}>Add to Cart</button>
    </Card>
  );
};

export default ProductCard;
