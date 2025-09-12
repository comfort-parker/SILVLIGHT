import React, { useEffect, useState } from "react";
import "./Blog.css";
import Navbar from "../Components/Navbar/Navbar.jsx";
import Footer from "../Components/Footer/Footer.jsx";
import groceries from "../assets/groceries.gif";

// Keep API_BASE consistent with backend
const API_BASE = (import.meta.env.VITE_API_URL).replace(/\/$/, "");
const SERVER_BASE = API_BASE.replace("/api", ""); // for media files

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_BASE}/blogs`);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        let data = await res.json();
        if (!Array.isArray(data)) throw new Error("Invalid data format. Expected an array of posts.");

        // Sort posts by createdAt (latest first)
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Take only the latest 3 posts
        const latestPosts = data.slice(0, 3);

        
       const safePosts = latestPosts.map((post) => ({
          _id: post._id,
          title: post.title || "No title",
          content: post.content || "No content",
          createdAt: post.createdAt || new Date().toISOString(),
          media: post.image || "", 
          mediaType: post.image ? "image" : "none", 
        }));


        setPosts(safePosts);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <Navbar />

      {/* Blog Hero Section */}
      <div className="blog-hero" style={{ backgroundImage: `url(${groceries})` }}>
        <div className="overlay"></div>
        <div className="hero-text">
          <h1>News & Events</h1>
          <p>Stay updated with the latest happenings, events, and stories from our school community.</p>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="blog-container">
        <h2 className="blog-header">Latest News & Events</h2>

        {loading && <p>Loading posts...</p>}
        {error && <p style={{ color: "red" }}>⚠️ {error}</p>}

        <div className="blog-grid">
          {!loading && !error && posts.length === 0 && <p>No posts available yet.</p>}

          {Array.isArray(posts) &&
            posts.map((post, index) => (
              <div key={post._id} className={`blog-card ${index % 2 === 1 ? "reverse" : ""}`}>
                
                {/* Media Section */}
                <div className="blog-image-container">
                  {post.mediaType === "video" && post.media ? (
                    <video className="blog-media" controls>
                      <source
                        src={post.media?.startsWith("http") ? post.media : `${SERVER_BASE}${post.media}`}
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  ) : post.mediaType === "image" && post.media ? (
                    <img
                      src={post.media?.startsWith("http") ? post.media : `${SERVER_BASE}${post.media}`}
                      alt={post.title}
                      className="blog-media"
                    />
                  ) : (
                    <div className="no-media">No Media</div>
                  )}
                </div>

                {/* Content Section */}
                <div className="blog-content">
                  <h3>{post.title}</h3>
                  <p className="blog-date">{new Date(post.createdAt).toDateString()}</p>
                  <p>{post.content}</p>
                  <button className="read-more">Read More</button>
                </div>
              </div>
            ))}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Blog;
