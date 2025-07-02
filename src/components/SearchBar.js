// import React from 'react';
// import { FaSearch } from 'react-icons/fa'; // Optional: for an icon

const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="search-bar-container">
      {/* Optional icon: <FaSearch style={{ marginRight: '8px', color: '#777' }} /> */}
      <input
        type="text"
        placeholder="Search products by name, category, or description..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;