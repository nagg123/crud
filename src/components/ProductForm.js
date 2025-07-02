import React, { useState, useEffect } from 'react';

const ProductForm = ({ onSubmit, initialData, onCancel }) => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    isAvailable: true, // Default to true for new products
  });

  const isEditing = Boolean(initialData);

  useEffect(() => {
    if (isEditing) {
      setProduct({
        ...initialData,
        isAvailable: initialData.hasOwnProperty('isAvailable') ? initialData.isAvailable : true, // Ensure isAvailable exists
      });
    } else {
      setProduct({ name: '', description: '', price: '', category: '', imageUrl: '', isAvailable: true });
    }
  }, [initialData, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!product.name || !product.price || !product.category) {
        alert("Name, Price, and Category are required!");
        return;
    }
    onSubmit(product);
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
      <div>
        <label htmlFor="name">Product Name</label>
        <input type="text" id="name" name="name" value={product.name} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" value={product.description} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="price">Price</label>
        <input type="number" id="price" name="price" value={product.price} onChange={handleChange} required min="0" step="0.01" />
      </div>
      <div>
        <label htmlFor="category">Category</label>
        <input type="text" id="category" name="category" value={product.category} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="imageUrl">Image URL</label>
        <input type="url" id="imageUrl" name="imageUrl" value={product.imageUrl} onChange={handleChange} placeholder="https://example.com/image.jpg" />
      </div>
      {/* New Availability Checkbox */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="checkbox"
          id="isAvailable"
          name="isAvailable"
          checked={product.isAvailable}
          onChange={handleChange}
          style={{ width: 'auto', marginRight: '10px' }}
        />
        <label htmlFor="isAvailable" style={{ marginBottom: '0', fontWeight: 'normal' }}>
          Product is Available
        </label>
      </div>
      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-primary">{isEditing ? 'Update Product' : 'Add Product'}</button>
      </div>
    </form>
  );
};

export default ProductForm;