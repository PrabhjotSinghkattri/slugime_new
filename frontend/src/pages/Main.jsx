import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home, Search, Plus, Heart, MessageCircle, User,
  MoreHorizontal, Send, Bookmark, Share2,
  Instagram, Settings, LogOut, Camera, Grid3X3, AlertTriangle
} from "lucide-react";
import { getFeed, getPublicReports, likePost, savePost, createPost } from "../api";
import "../theme.css";

export default function Main() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState("home");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newCaption, setNewCaption] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Fetch posts and reports in parallel
      const [feedResponse, reportsResponse] = await Promise.all([
        getFeed(token),
        getPublicReports()
      ]);

      setPosts(feedResponse?.posts || []);
      setReports(reportsResponse?.reports || []);
    } catch (error) {
      console.error("Failed to load data:", error);
      setPosts([]);
      setReports([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(userData));
    loadData();
  }, [navigate]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".user-menu")) setShowUserDropdown(false);
    };

    if (showUserDropdown) document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUserDropdown]);

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await likePost(postId, token);
      setPosts(posts.map(post => post.id === postId ? { ...post, liked: response.liked, like_count: response.like_count } : post));
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  const handleSave = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await savePost(postId, token);
      setPosts(posts.map(post => post.id === postId ? { ...post, saved: response.saved } : post));
    } catch (error) {
      console.error("Failed to save post:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newImageUrl.trim()) return;
    try {
      setIsCreating(true);
      const token = localStorage.getItem("token");
      await createPost({ image_url: newImageUrl.trim(), caption: newCaption.trim() }, token);
      setIsCreateOpen(false);
      setNewImageUrl("");
      setNewCaption("");
      // reload feed
      await loadData();
    } catch (err) {
      // noop – could surface a toast
      console.error("Create post failed", err);
    } finally {
      setIsCreating(false);
    }
  };

  if (!user) return null;

  return (
    <div className="main-page">
      {/* Header */}
      <header className="main-header">
        <div className="header-content">
          <div className="header-left">
            <Link to="/" className="main-logo">
              <Instagram size={32} />
              <span>Sluglime</span>
            </Link>
          </div>

          <div className="header-center">
            <div className="search-bar">
              <Search size={20} />
              <input type="text" placeholder="Search investigations..." />
            </div>
          </div>

          <div className="header-right">
            <button className="icon-btn"><Camera size={24} /></button>
            <button className="icon-btn"><MessageCircle size={24} /></button>

            <div className="user-menu">
              <button className="user-avatar-btn" onClick={() => setShowUserDropdown(!showUserDropdown)}>
                <img src="https://via.placeholder.com/32x32/ffd700/000000?text=ME" alt="Profile" />
              </button>

              {showUserDropdown && (
                <div className="user-dropdown">
                  <div className="dropdown-item"><User size={20} /><span>Profile</span></div>
                  <div className="dropdown-item"><Grid3X3 size={20} /><span>Saved</span></div>
                  <div className="dropdown-item"><Settings size={20} /><span>Settings</span></div>
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-item" onClick={handleLogout}><LogOut size={20} /><span>Log Out</span></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-container">
          {/* Stories */}
          <div className="stories-section">
            <div className="stories-container">
              <div className="story-item add-story">
                <div className="story-avatar"><Plus size={20} /></div>
                <span>Your Story</span>
              </div>
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="story-item">
                  <div className="story-avatar">
                    <img src={`https://via.placeholder.com/60x60/ffd700/000000?text=S${i}`} alt={`Story ${i}`} />
                  </div>
                  <span>User{i}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Posts Feed */}
          <div className="posts-feed">
            {isLoading ? (
              <div className="loading-state"><div className="spinner" />Loading...</div>
            ) : (
              <>
                {posts.map(post => (
                  <article key={`post_${post.id}`} className="post">
                    <div className="post-header">
                      <div className="post-author">
                        <img src={post.author?.avatar_url || "https://via.placeholder.com/40x40/ffd700/000000?text=U"} alt={post.author?.name} />
                        <div className="author-info">
                          <span className="author-name">{post.author?.name}</span>
                          {post.author?.verified && <span className="verified">✓</span>}
                        </div>
                      </div>
                      <button className="post-options"><MoreHorizontal size={24} /></button>
                    </div>

                    <div className="post-image">
                      <img src={post.image_url} alt="Post" />
                    </div>

                    {/* Compact Stats Row */}
                    <div className="post-stats">
                      <div className="stat">
                        <Heart size={18} />
                        <span>{post.like_count ?? 0}</span>
                      </div>
                      <div className="stat">
                        <MessageCircle size={18} />
                        <span>{post.comment_count ?? 0}</span>
                      </div>
                      <div className="stat">
                        <Share2 size={18} />
                      </div>
                    </div>

                    <div className="post-actions">
                      <div className="actions-left">
                        <button className={`action-btn ${post.liked ? 'liked' : ''}`} onClick={() => handleLike(post.id)}><Heart size={24} /></button>
                        <button className="action-btn"><MessageCircle size={24} /></button>
                        <button className="action-btn"><Send size={24} /></button>
                      </div>
                      <button className={`action-btn save-btn ${post.saved ? 'saved' : ''}`} onClick={() => handleSave(post.id)}><Bookmark size={24} /></button>
                    </div>

                    <div className="post-content">
                      <div className="likes-count">{post.like_count?.toLocaleString() || 0} likes</div>
                      <div className="post-caption">
                        <span className="author-name">{post.author?.name}</span>
                        <span className="caption-text">{post.caption}</span>
                      </div>
                      {post.comment_count > 0 && <button className="view-comments">View all {post.comment_count} comments</button>}
                      <div className="post-time">{formatTimeAgo(post.created_at)} ago</div>
                    </div>

                    <div className="comment-input">
                      <input type="text" placeholder="Add a comment..." />
                      <button className="share-btn"><Share2 size={20} /></button>
                    </div>
                  </article>
                ))}

                {reports.map(report => (
                  <article key={`report_${report.ticket}`} className="post report-post">
                    <div className="post-header">
                      <div className="post-author">
                        <img src="https://via.placeholder.com/40x40/ffd700/000000?text=W" alt="Report" />
                        <div className="author-info">
                          <span className="author-name">Anonymous</span>
                          <span className="report-badge"><AlertTriangle size={16} /> Report</span>
                        </div>
                      </div>
                      <button className="post-options"><MoreHorizontal size={24} /></button>
                    </div>

                    <div className="post-content report-content">
                      <div className="report-title">{report.title}</div>
                      {report.category && <div className="report-category">#{report.category}</div>}
                      <div className="report-body">{report.body}</div>
                      <div className="report-actions">
                        <Link to={`/status?ticket=${report.ticket}`} className="btn btn-primary">View Details</Link>
                      </div>
                      <div className="post-time">{formatTimeAgo(report.created_at)} ago</div>
                    </div>
                  </article>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="main-sidebar">
          <div className="user-profile-card">
            <img src="https://via.placeholder.com/60x60/ffd700/000000?text=ME" alt="Your profile" />
            <div className="profile-info">
              <span className="profile-name">{user.name}</span>
              <span className="profile-username">@{user.name}</span>
            </div>
            <button className="switch-btn">Switch</button>
          </div>

          {/* Suggested Users */}
          <div className="suggestions">
            <div className="suggestions-header">
              <span>Suggested Users</span>
              <button>See all</button>
            </div>
            <div className="suggestions-list">
              {[{ id: 1, name: "InnovateHub", followers: "12.5k", avatar: "U1" }, { id: 2, name: "ArtisticFlow", followers: "8.2k", avatar: "U2" }, { id: 3, name: "SoundWaves", followers: "5.1k", avatar: "U3" }, { id: 4, name: "FitLifeCoach", followers: "15k", avatar: "U4" }].map(u => (
                <div key={u.id} className="suggestion-item">
                  <img src={`https://via.placeholder.com/32x32/ffd700/000000?text=${u.avatar}`} alt={u.name} />
                  <div className="suggestion-info">
                    <span className="suggestion-name">{u.name}</span>
                    <span className="suggestion-desc">{u.followers} followers</span>
                  </div>
                  <button className="follow-btn">Follow</button>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}><Home size={24} /></button>
        <button className={`nav-item ${activeTab === 'search' ? 'active' : ''}`} onClick={() => setActiveTab('search')}><Search size={24} /></button>
        <button className="nav-item add-post" onClick={() => setIsCreateOpen(true)}><Plus size={24} /></button>
        <button className={`nav-item ${activeTab === 'activity' ? 'active' : ''}`} onClick={() => setActiveTab('activity')}><Heart size={24} /></button>
        <button className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}><User size={24} /></button>
      </nav>

      {/* Create Post Modal */}
      {isCreateOpen && (
        <div className="modal-backdrop" onClick={() => !isCreating && setIsCreateOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Create new post</h3>
            <form className="modal-form" onSubmit={handleCreatePost}>
              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  className="form-input"
                  placeholder="https://..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Caption (optional)</label>
                <textarea
                  className="form-input"
                  placeholder="Write a caption..."
                  rows={3}
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn" onClick={() => setIsCreateOpen(false)} disabled={isCreating}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isCreating || !newImageUrl.trim()}>
                  {isCreating ? "Posting..." : "Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
