// src/Pages/ProductList.jsx
import React, { useEffect, useState } from "react";
import { getProducts, deleteProduct, updateProduct } from "../Api";
import { Link } from "react-router-dom";
import Pagination from "../Components/Layout/Pagination";

import "./ProductList.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({});
  const [variants, setVariants] = useState([]);

  // state
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  //  filter states
  const [filters, setFilters] = useState({
    name: "",
    size: "",
    category: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      tags: product.tags ? product.tags.join(", ") : "",
      featured: product.featured,
    });
    setVariants(product.variants || []);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleVariantChange = (idx, e) => {
    const { name, value } = e.target;
    const updated = [...variants];
    updated[idx][name] =
      name === "stock" || name === "price" ? Number(value) : value;
    setVariants(updated);
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      { sku: "", color: "", size: "", stock: 0, price: 0 },
    ]);
  };

  const removeVariant = (idx) => {
    setVariants(variants.filter((_, i) => i !== idx));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        tags: formData.tags
          ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
        variants,
      };

      await updateProduct(editingProduct._id, payload);
      alert("Product updated!");
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      console.error("Error updating product:", err);
      alert("Failed to update product");
    }
  };

  const renderPrice = (variants) => {
    if (!variants || variants.length === 0) return "—";
    const prices = variants.map((v) => v.price).filter((p) => p > 0);
    if (prices.length === 0) return "—";
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max
      ? `GHS ${min.toFixed(2)}`
      : `GHS ${min.toFixed(2)} - ${max.toFixed(2)}`;
  };

  // filter logic
  const filteredProducts = products.filter((p) => {
    const nameMatch = p.name
      .toLowerCase()
      .includes(filters.name.toLowerCase());
    const categoryMatch = p.category
      ?.toLowerCase()
      .includes(filters.category.toLowerCase());

    // check if any variant size matches
    const sizeMatch =
      filters.size === "" ||
      p.variants?.some((v) =>
        v.size?.toLowerCase().includes(filters.size.toLowerCase())
      );

    return nameMatch && categoryMatch && sizeMatch;
  });

  //  pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <div className="product-page">
      <div className="product-header">
        <h2>Products</h2>
        <Link to="/admin/products/new" className="btn-add">
          + Add Product
        </Link>
      </div>

      {/*  Filters */}
      <div className="filters">
        <div className="filter-group">
          <label htmlFor="filter-name">Filter by Name</label>
          <input
            id="filter-name"
            type="text"
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="filter-size">Filter by Size</label>
          <input
            id="filter-size"
            type="text"
            value={filters.size}
            onChange={(e) => setFilters({ ...filters, size: e.target.value })}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="filter-category">Filter by Category</label>
          <input
            id="filter-category"
            type="text"
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
          />
        </div>
      </div>

      <table className="product-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Stock</th>
            <th>Price</th>
            <th>Category</th>
            <th>Featured</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedProducts.map((p) => (
            <tr key={p._id}>
              <td>
                {p.mainImage ? (
                  <img
                    src={p.mainImage}
                    alt={p.name}
                    style={{
                      width: "60px",
                      height: "50px",
                      objectFit: "cover",
                      borderRadius: "4px",
                    }}
                  />
                ) : (
                  <span>No Image</span>
                )}
              </td>
              <td>{p.name}</td>
              <td>{p.totalStock}</td>
              <td>{renderPrice(p.variants)}</td>
              <td>{p.category}</td>
              <td>{p.featured ? "Yes" : "No"}</td>
              <td>
                <button
                  onClick={() => handleEditClick(p)}
                  className="btn-small"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="btn-small red"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/*  Edit Modal */}
      {editingProduct && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Product</h3>
            <form onSubmit={handleUpdate} className="edit-form">
              {/* ... form fields stay the same ... */}
            </form>
          </div>
        </div>
      )}

      {/*  Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default ProductList;
