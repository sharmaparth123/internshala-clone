import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';
import './PublicSpace.css';

export default function PublicSpace() {
  const { user, posts, createPost, likePost, commentPost, updateUser } = useApp();
  const [content, setContent] = useState('');
  const [commentText, setCommentText] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [posting, setPosting] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friendEmail, setFriendEmail] = useState('');

  const friendCount = (user?.friends || []).length;

  const handlePost = () => {
    if (!content.trim()) return;
    setPosting(true);
    setTimeout(() => {
      const result = createPost(content);
      setPosting(false);
      if (result.error) toast.error(result.error);
      else { setContent(''); toast.success('Posted!'); }
    }, 400);
  };

  const handleAddFriend = () => {
    if (!friendEmail.trim()) return;
    const fakeId = 'friend_' + Date.now();
    updateUser({ friends: [...(user.friends || []), fakeId] });
    toast.success(`Friend added! You now have ${friendCount + 1} friend(s).`);
    setFriendEmail('');
    setShowAddFriend(false);
  };

  const handleComment = (postId) => {
    const text = commentText[postId];
    if (!text?.trim()) return;
    commentPost(postId, text);
    setCommentText(prev => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="public-space-page">
      <div className="container">
        <div className="space-layout">
          {/* Left sidebar */}
          <aside className="space-sidebar">
            <div className="card sidebar-card">
              <div className="sidebar-avatar">{user?.avatar}</div>
              <div className="sidebar-name">{user?.name}</div>
              <div className="sidebar-college">{user?.college}</div>
              <div className="sidebar-friends">
                <span>👥 {friendCount} Friends</span>
              </div>
              <button className="btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: 12, fontSize: 13, padding: '8px' }} onClick={() => setShowAddFriend(!showAddFriend)}>
                + Add Friend
              </button>
              {showAddFriend && (
                <div style={{ marginTop: 12 }}>
                  <input type="email" placeholder="Friend's email" value={friendEmail} onChange={e => setFriendEmail(e.target.value)} style={{ marginBottom: 8 }} />
                  <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 13, padding: '8px' }} onClick={handleAddFriend}>Add</button>
                </div>
              )}
            </div>

            <div className="card sidebar-card">
              <h4>🌐 Community Guidelines</h4>
              <div className="rule-item"><span className="rule-dot green" /> Be respectful and kind</div>
              <div className="rule-item"><span className="rule-dot green" /> Share relevant content</div>
              <div className="rule-item"><span className="rule-dot red" /> No spam or self-promotion</div>
              <div className="rule-item"><span className="rule-dot red" /> No offensive language</div>
            </div>
          </aside>

          {/* Main feed */}
          <main className="space-feed">
            {/* Create Post */}
            <div className="create-post card">
              <div className="create-header">
                <div className="avatar">{user?.avatar}</div>
                <div className="create-input-wrap">
                  <textarea
                    placeholder="Share something with the community..."
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    rows={3}
                    style={{ resize: 'vertical', borderRadius: 10, padding: '10px 14px', fontSize: 14 }}
                  />
                </div>
              </div>
              <div className="create-footer">
                <div className="post-info">
                  <span style={{ color: 'var(--gray-500)', fontSize: 12 }}>
                    {posts.filter(p => p.userId === user?.id && new Date(p.createdAt).toDateString() === new Date().toDateString()).length} posts today
                  </span>
                </div>
                <button
                  className="btn-primary"
                  style={{ padding: '8px 20px' }}
                  onClick={handlePost}
                  disabled={!content.trim() || posting}
                >
                  {posting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>

            {/* Posts Feed */}
            {posts.length === 0 ? (
              <div className="empty-feed">
                <div style={{ fontSize: 56 }}>💬</div>
                <h3>No posts yet</h3>
                <p>Be the first to share something with the community!</p>
              </div>
            ) : (
              posts.map(post => (
                <div key={post.id} className="post-card card">
                  <div className="post-header">
                    <div className="avatar">{post.userAvatar}</div>
                    <div>
                      <div className="post-author">{post.userName}</div>
                      <div className="post-time">{new Date(post.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  </div>
                  <div className="post-content">{post.content}</div>
                  <div className="post-actions">
                    <button
                      className={`action-btn ${post.likes.includes(user?.id) ? 'liked' : ''}`}
                      onClick={() => likePost(post.id)}
                    >
                      {post.likes.includes(user?.id) ? '❤️' : '🤍'} {post.likes.length} Likes
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => setExpandedComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                    >
                      💬 {post.comments.length} Comments
                    </button>
                    <button className="action-btn" onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }}>
                      🔗 Share
                    </button>
                  </div>

                  {expandedComments[post.id] && (
                    <div className="comments-section">
                      {post.comments.map(c => (
                        <div key={c.id} className="comment-item">
                          <div className="comment-avatar">{c.userName[0]?.toUpperCase()}</div>
                          <div className="comment-body">
                            <span className="comment-author">{c.userName}</span>
                            <span className="comment-text">{c.text}</span>
                          </div>
                        </div>
                      ))}
                      <div className="comment-input-row">
                        <div className="avatar" style={{ width: 28, height: 28, fontSize: 12 }}>{user?.avatar}</div>
                        <input
                          type="text"
                          placeholder="Write a comment..."
                          value={commentText[post.id] || ''}
                          onChange={e => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                          onKeyDown={e => e.key === 'Enter' && handleComment(post.id)}
                          style={{ flex: 1, padding: '8px 12px', borderRadius: 20, fontSize: 13 }}
                        />
                        <button className="btn-primary" style={{ padding: '7px 14px', fontSize: 13 }} onClick={() => handleComment(post.id)}>→</button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
