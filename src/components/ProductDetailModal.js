import React from 'react';
import { FaTimes } from 'react-icons/fa';

const DEFAULT_IMAGE_DETAIL = 'https://via.placeholder.com/400x300.png?text=No+Image';

const ProductDetailModal = ({ product, onClose }) => {
  if (!product) return null;

  const isAvailable = product.hasOwnProperty('isAvailable') ? product.isAvailable : true; // Default to true if undefined

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content product-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="modal-close-btn"><FaTimes /></button>
        <h2>Product Details</h2>
        <img src={product.imageUrl || DEFAULT_IMAGE_DETAIL} alt={product.name} onError={(e) => e.target.src = DEFAULT_IMAGE_DETAIL}/>
        <h3>{product.name}</h3>
        {/* Display Availability Status */}
        <div className={`availability ${isAvailable ? 'available' : 'not-available'}`} style={{marginBottom: '15px'}}>
          Status: {isAvailable ? 'Available' : 'Not Available'}
        </div>
        {product.category && <span className="category">Category: {product.category}</span>}
        <p className="price">Price: ${parseFloat(product.price).toFixed(2)}</p>
        <p><strong>Description:</strong></p>
        <p>{product.description || 'No description available.'}</p>
      </div>
    </div>
  );
};

export default ProductDetailModal;