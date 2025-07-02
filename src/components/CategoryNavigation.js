import React from 'react';

const CategoryNavigation = ({
  categoriesWithCounts, // Expects an array of objects: { name: string, count: number }
  selectedCategory,
  onSelectCategory
}) => {
  // Calculate total products for "All Products"
  // This count should ideally be of *all* products before any search/category filter
  // If categoriesWithCounts only contains filtered counts, this might be tricky.
  // For simplicity, let's assume categoriesWithCounts.allProductsCount provides this
  const allProductsCount = categoriesWithCounts.allProductsCount || categoriesWithCounts.list.reduce((sum, cat) => sum + cat.count, 0);


  return (
    <div className="category-navigation-sidebar">
      <h3>Categories</h3>
      <ul>
        <li>
          <button
            onClick={() => onSelectCategory(null)}
            className={!selectedCategory ? 'active' : ''}
          >
            All Products
            {typeof allProductsCount === 'number' && <span className="category-count">{allProductsCount}</span>}
          </button>
        </li>
        {categoriesWithCounts.list.map((categoryItem) => (
          <li key={categoryItem.name}>
            <button
              onClick={() => onSelectCategory(categoryItem.name)}
              className={selectedCategory === categoryItem.name ? 'active' : ''}
            >
              {categoryItem.name}
              <span className="category-count">{categoryItem.count}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryNavigation;