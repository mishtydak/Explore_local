/**
 * Comment Box Component
 * Displays comments and allows replying (Q&A)
 */

import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { addComment, addReply } from '../services/placeService';

const CommentBox = ({ place, onCommentUpdate }) => {
  const { isAuthenticated, user } = useContext(AuthContext);

  const [commentText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyIndex, setReplyIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Safety: if place not loaded yet (hooks must run before returns)
  if (!place) return null;

  // Add new comment
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setMessage('Please login to comment');
      return;
    }

    if (!commentText.trim()) {
      setMessage('Comment cannot be empty');
      return;
    }

    if (!place._id) {
      setMessage('Invalid place');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await addComment(place._id, commentText);
      setCommentText('');
      setMessage('Comment added successfully!');
      onCommentUpdate && onCommentUpdate();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  // Add reply to a comment
  const handleReplySubmit = async (index) => {
    if (!replyText.trim()) return;

    try {
      await addReply(place._id, index, replyText);
      setReplyText('');
      setReplyIndex(null);
      onCommentUpdate && onCommentUpdate();
    } catch (error) {
      alert('Failed to add reply');
    }
  };

  return (
    <div className="comments-section">
      <h3>Comments ({place.comments?.length || 0})</h3>

      {/* Add Comment */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <div className="form-group">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              rows="3"
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Posting...' : 'Post Comment'}
          </button>
          {message && (
            <p
              style={{
                marginTop: '0.5rem',
                color: message.includes('success')
                  ? '#27ae60'
                  : '#e74c3c',
              }}
            >
              {message}
            </p>
          )}
        </form>
      ) : (
        <p style={{ color: '#999', marginBottom: '2rem' }}>
          Please login to add a comment
        </p>
      )}

      {/* Show Comments */}
      <div>
        {place.comments && place.comments.length > 0 ? (
          place.comments.map((comment, index) => (
            <div key={index} className="comment">
              <div className="comment-header">
                <span className="comment-author">
                  {comment.username || 'User'}
                </span>
                <span className="comment-date">
                  {comment.createdAt
                    ? new Date(comment.createdAt).toLocaleDateString()
                    : ''}
                </span>
              </div>

              <div className="comment-text">{comment.text}</div>

              {/* Reply Button */}
              {isAuthenticated && (
                <button
                  className="btn btn-link"
                  onClick={() =>
                    setReplyIndex(replyIndex === index ? null : index)
                  }
                >
                  Reply
                </button>
              )}

              {/* Reply Input */}
              {replyIndex === index && (
                <div style={{ marginLeft: '1rem', marginTop: '0.5rem' }}>
                  <textarea
                    rows="2"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                  />
                  <button
                    className="btn btn-primary"
                    onClick={() => handleReplySubmit(index)}
                  >
                    Post Reply
                  </button>
                </div>
              )}

              {/* Show Replies */}
              {comment.replies &&
                comment.replies.map((reply, i) => (
                  <div
                    key={i}
                    style={{
                      marginLeft: '1.5rem',
                      marginTop: '0.5rem',
                      fontSize: '0.9rem',
                    }}
                  >
                    <strong>{reply.username || 'User'}:</strong>{' '}
                    {reply.text}
                  </div>
                ))}
            </div>
          ))
        ) : (
          <p style={{ color: '#999' }}>
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
};

export default CommentBox;
