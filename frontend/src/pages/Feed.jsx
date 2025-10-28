import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search, Plus, Bell, Bookmark, Heart, MessageCircle, Share, ChevronDown,
    User, UserPlus, Edit3, Settings, LogOut, Menu, X, AlertTriangle
} from "lucide-react";
import { getFeed, likePost, savePost, createPost, getPublicReports } from "../api";
import "../theme.css";

export default function Feed() {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedComment, setSelectedComment] = useState({});
    const [newImageUrl, setNewImageUrl] = useState("");
    const [newCaption, setNewCaption] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (!userData) {
            navigate("/login");
            return;
        }
        setUser(JSON.parse(userData));
        loadData();
    }, [navigate]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".user-menu-header")) {
                setShowMenu(false);
            }
        };

        if (showMenu) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showMenu]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
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
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
        return `${Math.floor(diffInSeconds / 604800)}w`;
    };

    const handleLike = async (postId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await likePost(postId, token);
            setPosts(posts.map(post => post.id === postId ? { ...post, liked: response.liked, like_count: response.like_count } : post));
        } catch (error) {
            console.error("Failed to like:", error);
        }
    };

    const handleSave = async (postId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await savePost(postId, token);
            setPosts(posts.map(post => post.id === postId ? { ...post, saved: response.saved } : post));
        } catch (error) {
            console.error("Failed to save:", error);
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
            setShowCreateModal(false);
            setNewImageUrl("");
            setNewCaption("");
            await loadData();
        } catch (err) {
            console.error("Create post failed", err);
        } finally {
            setIsCreating(false);
        }
    };

    const combinedFeed = [
        ...posts.map(p => ({ ...p, type: 'post' })),
        ...reports.map(r => ({ ...r, type: 'report', id: r.ticket }))
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    if (!user) return null;

    return (
        <div className="feed-page">
            {/* Left Sidebar */}
            <aside className="feed-sidebar">
                <div className="sidebar-logo">
                    <div className="brand-logo">*</div>
                    <span>Sluglime</span>
                </div>
            </aside>

            {/* Main Content */}
            <div className="feed-main">
                {/* Header */}
                <header className="feed-header">
                    <div className="header-left">
                        <div className="brand-logo">*</div>
                        <span className="header-logo">Sluglime</span>
                    </div>

                    <div className="header-center">
                        <div className="search-bar-wrapper">
                            <Search size={20} />
                            <input type="text" placeholder="Search Sluglime..." className="search-input-large" />
                        </div>
                    </div>

                    <div className="header-right">
                        <button
                            className="header-btn primary"
                            onClick={() => setShowCreateModal(true)}
                        >
                            <Plus size={20} />
                            <span>Post</span>
                        </button>
                        <button className="header-icon-btn"><Bell size={24} /></button>
                        <button className="header-icon-btn"><Bookmark size={24} /></button>
                        <div className="user-menu-header">
                            <button className="user-avatar-header" onClick={() => setShowMenu(!showMenu)}>
                                <img src="https://via.placeholder.com/40x40/ffd700/000000?text=ME" alt="Profile" />
                                <ChevronDown size={16} />
                            </button>
                            {showMenu && (
                                <div className="user-dropdown-header">
                                    <div className="dropdown-item"><User size={20} /><span>My Profile</span></div>
                                    <div className="dropdown-item"><UserPlus size={20} /><span>Add Account</span></div>
                                    <div className="dropdown-item"><Edit3 size={20} /><span>Settings</span></div>
                                    <div className="dropdown-divider"></div>
                                    <div className="dropdown-item" onClick={handleLogout}><LogOut size={20} /><span>Log Out</span></div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Feed Content */}
                <main className="feed-content">
                    <h1 className="feed-title">Your Feed</h1>

                    <div className="feed-posts">
                        {isLoading ? (
                            <div className="loading-state"><div className="spinner" />Loading...</div>
                        ) : combinedFeed.length === 0 ? (
                            <div className="empty-state">
                                <p>No posts yet. Create your first post!</p>
                            </div>
                        ) : (
                            combinedFeed.map((item) => (
                                <article key={`${item.type}_${item.id}`} className="feed-post-card">
                                    {/* Post Header */}
                                    <div className="post-card-header">
                                        <div className="post-author-info">
                                            <img
                                                src={item.author?.avatar_url || "https://via.placeholder.com/48x48/ffd700/000000?text=U"}
                                                alt={item.author?.name}
                                                className="author-avatar-large"
                                            />
                                            <div className="author-details">
                                                <div className="author-name-row">
                                                    <span className="author-name-large">{item.author?.name || "Anonymous"}</span>
                                                    {item.author?.verified && <span className="verified-badge">✓</span>}
                                                    <span className="post-time-large">{formatTimeAgo(item.created_at)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Post Content */}
                                    <div className="post-card-content">
                                        {item.type === 'post' && item.image_url && (
                                            <div className="post-image-container">
                                                <img src={item.image_url} alt="Post" />
                                            </div>
                                        )}

                                        <div className="post-text-content">
                                            {item.type === 'report' ? (
                                                <>
                                                    <div className="report-text-section">
                                                        <div className="report-badge-large">
                                                            <AlertTriangle size={16} />
                                                            <span>Whistleblower Report</span>
                                                        </div>
                                                        {item.category && <div className="report-category-tag">#{item.category}</div>}
                                                    </div>
                                                    <p className="post-text-large">{item.body}</p>
                                                </>
                                            ) : (
                                                <p className="post-text-large">{item.caption}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Post Engagement */}
                                    {item.type === 'post' && (
                                        <div className="post-engagement">
                                            <div className="engagement-icons">
                                                <button
                                                    className={`icon-btn ${item.liked ? 'active' : ''}`}
                                                    onClick={() => handleLike(item.id)}
                                                >
                                                    <Heart size={24} />
                                                </button>
                                                <button
                                                    className={`icon-btn ${item.saved ? 'active' : ''}`}
                                                    onClick={() => handleSave(item.id)}
                                                >
                                                    <Bookmark size={24} />
                                                </button>
                                                <button className="icon-btn"><MessageCircle size={24} /></button>
                                                <button className="icon-btn"><Share size={24} /></button>
                                            </div>
                                            <div className="engagement-stats">
                                                <span className="stats-text">{item.like_count?.toLocaleString() || 0} likes</span>
                                                <span className="stats-text">{item.comment_count || 0} comments</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Comments Section */}
                                    {item.type === 'post' && item.comment_count > 0 && (
                                        <div className="post-comments-section">
                                            <div className="comment-item">
                                                <img src="https://via.placeholder.com/32x32/ffd700/000000?text=A" alt="Commenter" />
                                                <div className="comment-content">
                                                    <span className="comment-author">Alex_Innovate</span>
                                                    <span className="comment-text">Amazing work! Love the vibrant energy you've captured.</span>
                                                </div>
                                            </div>
                                            <button className="view-more-comments">View all {item.comment_count} comments</button>
                                        </div>
                                    )}

                                    {/* Comment Input - Only for posts */}
                                    {item.type === 'post' && (
                                        <div className="comment-input-section">
                                            <input
                                                type="text"
                                                placeholder="Add a comment..."
                                                className="comment-input-large"
                                                value={selectedComment[item.id] || ""}
                                                onChange={(e) => setSelectedComment({ ...selectedComment, [item.id]: e.target.value })}
                                            />
                                            <button className="comment-post-btn"><Share size={20} /></button>
                                        </div>
                                    )}
                                </article>
                            ))
                        )}
                    </div>
                </main>
            </div>

            {/* Create Post Modal */}
            {showCreateModal && (
                <div className="modal-backdrop" onClick={() => !isCreating && setShowCreateModal(false)}>
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
                                <button type="button" className="btn" onClick={() => setShowCreateModal(false)} disabled={isCreating}>
                                    Cancel
                                </button>
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

