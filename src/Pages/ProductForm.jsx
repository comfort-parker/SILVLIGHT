// src/components/ProductForm.jsx
import React, { useState } from "react";
import { createProduct } from "../Api";         
import "./ProductForm.css";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;;                 
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;     
const FOLDER = import.meta.env.VITE_CLOUDINARY_FOLDER || "default_folder";

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    tags: "",
    featured: false,
    mainImage: null, 
  });

  const [variants, setVariants] = useState([
    { sku: "", color: "", size: "", stock: 0, price: 0 },
  ]);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // form fields
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // variants
  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...variants];
    updated[index][name] =
      name === "stock" || name === "price" ? Number(value) : value;
    setVariants(updated);
  };

  const addVariant = () =>
    setVariants([...variants, { sku: "", color: "", size: "", stock: 0, price: 0 }]);

  const removeVariant = (index) =>
    setVariants(variants.filter((_, i) => i !== index));

  // upload file directly to Cloudinary (unsigned preset)
  const uploadToCloudinary = async (file) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", UPLOAD_PRESET);
    fd.append("folder", FOLDER);

    const resp = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: fd,
      }
    );

    if (!resp.ok) {
      const txt = await resp.text();
      throw new Error("Cloudinary upload failed: " + txt);
    }

    const json = await resp.json();
    return json.secure_url;
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // 1) upload image if provided
      let imageUrl = "";
      if (formData.mainImage) {
        imageUrl = await uploadToCloudinary(formData.mainImage);
      }

      // 2) normalize tags and variants
      const tagsArray = formData.tags
        ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [];

      const normalizedVariants = variants.map((v) => ({
        sku: String(v.sku).trim(),
        color: v.color || "",
        size: v.size || "",
        stock: Number(v.stock) || 0,
        price: Number(v.price) || 0,
      }));

      // 3) build payload expected by backend
      const payload = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        tags: tagsArray,
        featured: Boolean(formData.featured),
        variants: normalizedVariants, // array
        mainImage: imageUrl, // Cloudinary URL (backend expects this)
      };

      // 4) send to backend
      const res = await createProduct(payload);
      console.log("Product created:", res.data);
      alert("✅ Product created successfully");

      // reset
      setFormData({
        name: "",
        description: "",
        category: "",
        tags: "",
        featured: false,
        mainImage: null,
      });
      setVariants([{ sku: "", color: "", size: "", stock: 0, price: 0 }]);
      setPreview(null);
    } catch (err) {
      console.error("Failed to create product:", err);
      alert("❌ Failed to create product — check console for details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form-container">
      <h2>Create Product</h2>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <label>
          Product Name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        {/* Description */}
        <label>
          Description
          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </label>

        {/* Category */}
<label>
  Category
  <select
    name="category"
    value={formData.category}
    onChange={handleChange}
    required
  >
    <option value="">-- Select Category --</option>
    <option value="Cosmetics">Cosmetics</option>
    <option value="Hair Care">Hair Care</option>
    <option value="Groceries">Groceries</option>
    <option value="Face Care">Face Care</option>
    <option value="Toiletries">Toiletries</option>
    <option value="Bakeries">Bakeries</option>
  </select>
</label>

         

        {/* Tags */}
        <label>
          Tags (comma separated)
          <input type="text" name="tags" value={formData.tags} onChange={handleChange} />
        </label>

        {/* Featured */}
<div className="form-group checkbox-group">
  <input
    type="checkbox"
    id="featured"
    name="featured"
    checked={formData.featured}
    onChange={handleChange}
  />
  <label htmlFor="featured">Featured Product</label>
</div>


        {/* Image */}
        <label>
          Main Image
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setFormData((p) => ({ ...p, mainImage: file }));
                setPreview(URL.createObjectURL(file));
              }
            }}
          />
        </label>
        {preview && <img src={preview} alt="Preview" className="image-preview" />}

        {/* Variants */}
        <div className="variant-section">
          <h3>Variants</h3>
          {variants.map((variant, idx) => (
            <div key={idx} className="variant-card">
              <h3>Variant {idx + 1}</h3>
              <div className="variant-grid">
                <label>
                  SKU
                  <input
                    type="text"
                    name="sku"
                    value={variant.sku}
                    onChange={(e) => handleVariantChange(idx, e)}
                    required
                  />
                </label>

                <label>
                  Color
                  <input type="text" name="color" value={variant.color} onChange={(e) => handleVariantChange(idx, e)} />
                </label>

                <label>
                  Size
                  <select
                    name="size"
                    value={variant.size}
                    onChange={(e) => handleVariantChange(idx, e)}
                    required
                  >
                    <option value="">-- Select Size --</option>
                    <option value="Big">Big</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Small">Small</option>
                  </select>
                </label>

                <label>
                  Stock
                  <input type="number" name="stock" value={variant.stock} onChange={(e) => handleVariantChange(idx, e)} />
                </label>

                <label>
                  Price
                  <input type="number" name="price" step="0.01" value={variant.price} onChange={(e) => handleVariantChange(idx, e)} required />
                </label>
              </div>

              <button type="button" className="remove-btn" onClick={() => removeVariant(idx)} disabled={variants.length === 1}>
                Remove Variant
              </button>
            </div>
          ))}

          <button type="button" className="add-variant-btn" onClick={addVariant}>
            + Add Variant
          </button>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Saving..." : "Save Product"}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
