import React from 'react';
import { FaEdit, FaTrashAlt, FaEye } from 'react-icons/fa';

const DEFAULT_IMAGE = 'https://via.placeholder.com/280x180.png?text=No+Image';

const ProductItem = ({ product, onEdit, onDelete, onViewDetails }) => {
  const isAvailable = product.hasOwnProperty('isAvailable') ? product.isAvailable : true; // Default to true if undefined

  return (
    <div className="product-item">
      <img src={product.imageUrl || DEFAULT_IMAGE} alt={product.name} onError={(e) => e.target.src = DEFAULT_IMAGE} />
      <h3>{product.name}</h3>
      {/* Display Availability Status */}
      <div className={`availability ${isAvailable ? 'available' : 'not-available'}`}>
        {isAvailable ? 'Available' : 'Not Available'}
      </div>
      {product.category && <span className="category">{product.category}</span>}
      <p className="price">${parseFloat(product.price).toFixed(2)}</p>
      <p title={product.description}>{product.description || 'No description available.'}</p>
      <div className="product-actions">
        <button onClick={() => onViewDetails(product)} className="btn-view" title="View Details">
            <FaEye />
        </button>
        <button onClick={() => onEdit(product)} className="btn-edit" title="Edit">
            <FaEdit />
        </button>
        <button onClick={() => onDelete(product.id)} className="btn-delete" title="Delete">
            <FaTrashAlt />
        </button>
      </div>
    </div>
  );
};

export default ProductItem;