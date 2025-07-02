import React from 'react';
import ProductItem from './ProductItem';

const ProductList = ({ products, onEdit, onDelete, onViewDetails }) => {
  if (!products.length) {
    return <p className="no-items-message">No products found. Try adjusting your search or add a new product!</p>;
  }

  return (
    <div className="product-list">
      {products.map((product) => (
        <ProductItem
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};

export default ProductList;