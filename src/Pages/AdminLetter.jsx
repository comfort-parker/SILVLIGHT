import React, { useEffect, useState } from "react";
import axios from "axios";
import Topbar from "../Components/Layout/Topbar";
import Sidebar from "../Components/Layout/Sidebar";
import "./AdminLetter.css";

const AdminContentPage = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newsletterModal, setNewsletterModal] = useState(false);
  const [blogModal, setBlogModal] = useState(false);

  // Newsletter form
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [newsletterMsg, setNewsletterMsg] = useState("");
  const [sending, setSending] = useState(false);

  // Blog state
  const [blogs, setBlogs] = useState([]);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogImage, setBlogImage] = useState(null);
  const [blogMsg, setBlogMsg] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:7000/api").replace(/\/$/, "");

  useEffect(() => {
    fetchSubscribers();
    fetchBlogs();
  }, []);

  // ✅ Fetch Subscribers
  const fetchSubscribers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/newsletter/subscribers`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSubscribers(res.data);
    } catch (err) {
      console.error("Failed to load subscribers:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch Blogs
  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${API_BASE}/blogs`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBlogs(res.data);
    } catch (err) {
      console.error("Failed to load blogs:", err);
    }
  };

  // ✅ Send Newsletter
  const handleSendNewsletter = async (e) => {
    e.preventDefault();
    setSending(true);
    setNewsletterMsg("");
    try {
      await axios.post(
        `${API_BASE}/newsletter/send`,
        { subject, htmlContent: content },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setNewsletterMsg("✅ Newsletter sent!");
      setSubject("");
      setContent("");
      setNewsletterModal(false);
    } catch (err) {
      setNewsletterMsg("⚠️ Failed to send newsletter.");
    } finally {
      setSending(false);
    }
  };

  // ✅ Upload Image to Cloudinary
  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    data.append("cloud_name", import.meta.env.VITE_CLOUDINARY_NAME);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload`,
      { method: "POST", body: data }
    );
    return res.json();
  };

  // ✅ Create / Update Blog
  const handleSaveBlog = async (e) => {
    e.preventDefault();
    setCreating(true);
    setBlogMsg("");

    try {
      let imageUrl = editingBlog?.media || "";
      if (blogImage) {
        const uploadRes = await uploadToCloudinary(blogImage);
        imageUrl = uploadRes.secure_url;
      }

      if (editingBlog) {
        // Update existing
        await axios.put(
          `${API_BASE}/blogs/${editingBlog._id}`,
          {
            title: blogTitle,
            content: blogContent,
            media: imageUrl,
            mediaType: "image",
          },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        setBlogMsg("✅ Blog updated!");
      } else {
        // Create new
        await axios.post(
          `${API_BASE}/blogs`,
          {
            title: blogTitle,
            content: blogContent,
            media: imageUrl,
            mediaType: "image",
          },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        setBlogMsg("✅ Blog created!");
      }

      // Reset form
      setBlogTitle("");
      setBlogContent("");
      setBlogImage(null);
      setEditingBlog(null);
      setBlogModal(false);

      fetchBlogs(); // refresh
    } catch (err) {
      console.error("Blog save error:", err);
      setBlogMsg("⚠️ Failed to save blog.");
    } finally {
      setCreating(false);
    }
  };

  // ✅ Delete Blog
  const handleDeleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await axios.delete(`${API_BASE}/blogs/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBlogs((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error("Delete blog error:", err);
      alert("⚠️ Failed to delete blog.");
    }
  };

  // ✅ Start Editing Blog
  const handleEditBlog = (blog) => {
    setEditingBlog(blog);
    setBlogTitle(blog.title);
    setBlogContent(blog.content);
    setBlogImage(null);
    setBlogModal(true);
  };

  return (
    <>
      <Topbar />
      <Sidebar />
      <div className="content-admin-container">
        <h1>Content Management</h1>

        <div className="content-actions">
          <button onClick={() => setNewsletterModal(true)}>Send Newsletter</button>
          <button onClick={() => setBlogModal(true)}>Create Blog</button>
        </div>

        {/* ================= Subscribers ================= */}
        <h2>Subscribers</h2>
        {loading ? (
          <p>Loading subscribers...</p>
        ) : subscribers.length > 0 ? (
          <table className="subscribers-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Subscribed At</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub) => (
                <tr key={sub._id}>
                  <td>{sub.email}</td>
                  <td>{new Date(sub.subscribedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No subscribers yet.</p>
        )}

        {/* ================= Blogs ================= */}
        <h2>Manage Blogs</h2>
        {blogs.length > 0 ? (
          <table className="blogs-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog._id}>
                  <td>{blog.title}</td>
                  <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleEditBlog(blog)}>✏️ Edit</button>
                    <button onClick={() => handleDeleteBlog(blog._id)}>🗑 Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No blogs yet.</p>
        )}

        {/* ================= Newsletter Modal ================= */}
        {newsletterModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Send Newsletter</h2>
              <form onSubmit={handleSendNewsletter}>
                <input
                  type="text"
                  placeholder="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
                <textarea
                  placeholder="Content"
                  rows="6"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
                <div className="modal-actions">
                  <button type="submit" disabled={sending}>
                    {sending ? "Sending..." : "Send"}
                  </button>
                  <button type="button" onClick={() => setNewsletterModal(false)}>
                    Cancel
                  </button>
                </div>
              </form>
              {newsletterMsg && <p className="modal-msg">{newsletterMsg}</p>}
            </div>
          </div>
        )}

        {/* ================= Blog Modal ================= */}
        {blogModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>{editingBlog ? "Edit Blog" : "Create Blog"}</h2>
              <form onSubmit={handleSaveBlog}>
                <input
                  type="text"
                  placeholder="Blog Title"
                  value={blogTitle}
                  onChange={(e) => setBlogTitle(e.target.value)}
                  required
                />
                <textarea
                  placeholder="Blog Content"
                  rows="6"
                  value={blogContent}
                  onChange={(e) => setBlogContent(e.target.value)}
                  required
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setBlogImage(e.target.files[0])}
                />
                <div className="modal-actions">
                  <button type="submit" disabled={creating}>
                    {creating ? (editingBlog ? "Updating..." : "Creating...") : editingBlog ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBlogModal(false);
                      setEditingBlog(null);
                      setBlogTitle("");
                      setBlogContent("");
                      setBlogImage(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
              {blogMsg && <p className="modal-msg">{blogMsg}</p>}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminContentPage;
