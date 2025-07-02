import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FaPlusCircle, FaTimes } from 'react-icons/fa';

import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import ProductDetailModal from './components/ProductDetailModal';
import SearchBar from './components/SearchBar';
import NotificationPopup from './components/NotificationPopup';
import CategoryNavigation from './components/CategoryNavigation';
import './App.css';

const LOCAL_STORAGE_KEY = 'reactAdvancedCrudProducts';

const App = () => {
  const [products, setProducts] = useState(() => {
    try {
      const savedProducts = localStorage.getItem(LOCAL_STORAGE_KEY);
      // Ensure isAvailable exists on load, default to true
      const loadedProducts = savedProducts ? JSON.parse(savedProducts) : [];
      return loadedProducts.map(p => ({ ...p, isAvailable: p.hasOwnProperty('isAvailable') ? p.isAvailable : true }));
    } catch (e) {
      console.error("Failed to parse products from localStorage", e);
      return [];
    }
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });

  // --- Calculate available categories with product counts (only truly available products) ---
  const categoriesWithCounts = useMemo(() => {
    const counts = {};
    let totalAvailableProducts = 0;

    products.forEach(product => {
      if (product.isAvailable) { // Only count if product.isAvailable is true
        totalAvailableProducts++;
        if (product.category && product.category.trim() !== '') {
          counts[product.category] = (counts[product.category] || 0) + 1;
        }
      }
    });

    const list = Object.keys(counts)
      .map(categoryName => ({
        name: categoryName,
        count: counts[categoryName]
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return { list, allProductsCount: totalAvailableProducts };
  }, [products]); // Recalculate when products change (e.g., availability status changes)


  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
  };

  const updateProductsAndStorage = (updatedProducts) => {
    setProducts(updatedProducts);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedProducts));
  };

  // CRUD Operations (ensure isAvailable is handled)
  const handleAddProduct = (productData) => {
    const newProduct = {
      ...productData, // includes isAvailable from form
      id: uuidv4(),
      price: parseFloat(productData.price)
    };
    updateProductsAndStorage([...products, newProduct]);
    setIsFormModalOpen(false);
    showNotification('Product added successfully!', 'success');
  };

  const handleUpdateProduct = (updatedProductData) => {
    const updatedProducts = products.map((p) =>
      p.id === updatedProductData.id ?
      { ...p, ...updatedProductData, price: parseFloat(updatedProductData.price) } :
      p
    );
    updateProductsAndStorage(updatedProducts);
    setIsFormModalOpen(false);
    setCurrentProduct(null);
    showNotification('Product updated successfully!', 'success');
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const updatedProducts = products.filter((p) => p.id !== productId);
      updateProductsAndStorage(updatedProducts);
      showNotification('Product deleted successfully!', 'info');
      if (currentProduct && currentProduct.id === productId) {
        setIsDetailModalOpen(false);
        setIsFormModalOpen(false);
        setCurrentProduct(null);
      }
    }
  };

  // Modal & Form Handling (remain the same)
  const openAddForm = () => { setCurrentProduct(null); setIsFormModalOpen(true); };
  const openEditForm = (product) => { setCurrentProduct(product); setIsFormModalOpen(true); };
  const openDetailModal = (product) => { setCurrentProduct(product); setIsDetailModalOpen(true); };
  const closeFormModal = () => { setIsFormModalOpen(false); setCurrentProduct(null); };
  const closeDetailModal = () => { setIsDetailModalOpen(false); setCurrentProduct(null); };

  // localStorage Sync (remains the same)
  const handleStorageChange = useCallback((event) => {
    if (event.key === LOCAL_STORAGE_KEY && event.newValue) {
      try {
        const newRawProducts = JSON.parse(event.newValue);
        const newProductsWithAvailability = newRawProducts.map(p => ({ ...p, isAvailable: p.hasOwnProperty('isAvailable') ? p.isAvailable : true }));

        if (JSON.stringify(products) !== JSON.stringify(newProductsWithAvailability)) {
          setProducts(newProductsWithAvailability);
          console.log("Product list updated from another tab via localStorage event.");
        }
      } catch (e) { console.error("Error parsing localStorage update", e); }
    }
  }, [products]);

  useEffect(() => {
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [handleStorageChange]);

  // --- Filtering Logic (Updated to consider isAvailable for display) ---
  const filteredAndSearchedProducts = useMemo(() => {
    // Start with products that are marked as available
    let tempProducts = products.filter(p => p.isAvailable);

    // 1. Filter by selected category
    if (selectedCategory) {
      tempProducts = tempProducts.filter(p => p.category === selectedCategory);
    }

    // 2. Filter by search term
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      tempProducts = tempProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerSearchTerm) ||
          (p.description && p.description.toLowerCase().includes(lowerSearchTerm)) ||
          (p.category && p.category.toLowerCase().includes(lowerSearchTerm))
          // Removed availabilityText search here as products are already pre-filtered by isAvailable
      );
    }
    return tempProducts;
  }, [products, searchTerm, selectedCategory]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSearchTerm('');
  };

  return (
    <div className="container"> {/* Main container might need adjustments */}
      <NotificationPopup
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: '', type: '' })}
      />

      <div className="app-layout"> {/* Apply the new layout */}
        <aside className="sidebar">
          <CategoryNavigation
            categoriesWithCounts={categoriesWithCounts}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
        </aside>

        <main className="main-content">
          <h1>Product Dashboard</h1> {/* Or something more fitting */}
          <div className="add-product-btn-container" style={{textAlign: "right", marginBottom: "15px"}}> {/* Moved for better flow */}
            <button onClick={openAddForm} className="btn-primary">
              <FaPlusCircle style={{ marginRight: '8px' }} /> Add New Product
            </button>
          </div>
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          <ProductList
            products={filteredAndSearchedProducts}
            onEdit={openEditForm}
            onDelete={handleDeleteProduct}
            onViewDetails={openDetailModal}
          />
        </main>
      </div>

      {isFormModalOpen && (
        <div className="modal-overlay" onClick={closeFormModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeFormModal} className="modal-close-btn"><FaTimes /></button>
            <ProductForm
              onSubmit={currentProduct ? handleUpdateProduct : handleAddProduct}
              initialData={currentProduct}
              onCancel={closeFormModal}
            />
          </div>
        </div>
      )}

      {isDetailModalOpen && currentProduct && (
        <ProductDetailModal product={currentProduct} onClose={closeDetailModal} />
      )}
    </div>
  );
};

export default App;