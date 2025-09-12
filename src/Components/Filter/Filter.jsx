import React from "react";
import "./Filter.css";

const ProductFilter = ({ searchQuery, setSearchQuery, category, setCategory, categories }) => {
  return (
    <div className="filter-bar">
      {/* Search box */}
      <input
        type="text"
        className="search-box"
        placeholder="Search by name, size, or category..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Category Filter */}
      <select
        className="category-filter"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">All Categories</option>
        {categories.map((cat, idx) => (
          <option key={idx} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProductFilter;
