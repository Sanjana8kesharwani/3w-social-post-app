import React, { useState, useContext } from 'react';
import { Box, TextField, Button, Typography, Avatar } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { PostContext } from '../context/PostContext';

const CommentSection = ({ post }) => {
  const { user } = useContext(AuthContext);
  const { commentPost } = useContext(PostContext);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;

    setSubmitting(true);
    const result = await commentPost(post._id, commentText, user);
    setSubmitting(false);

    if (result && result.success) {
      setCommentText('');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box sx={{ p: 2, bgcolor: '#fafafa', borderTop: '1px solid #f0f0f0' }}>
      {user && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <TextField
            fullWidth
            placeholder="Write a comment..."
            variant="outlined"
            size="small"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            disabled={submitting}
            sx={{ bgcolor: '#ffffff' }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="small"
            disabled={submitting || !commentText.trim()}
            sx={{ textTransform: 'none', px: 2, borderRadius: 1.5 }}
          >
            Comment
          </Button>
        </form>
      )}

      <Box display="flex" flexDirection="column" gap={1.5}>
        {post.comments.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontStyle: 'italic', textAlign: 'center', py: 1 }}
          >
            No comments yet.
          </Typography>
        ) : (
          // Sort comments by oldest first, or just show them in array order (newest at bottom)
          post.comments.map((comment) => (
            <Box key={comment._id || comment.createdAt} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
              <Avatar
                sx={{
                  bgcolor: '#b0bec5',
                  width: 28,
                  height: 28,
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                }}
              >
                {comment.username.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1, bgcolor: '#f0f2f5', p: 1, borderRadius: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="baseline" mb={0.25}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#333' }}>
                    {comment.username}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    {formatDate(comment.createdAt)}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontSize: '0.825rem', color: '#444', wordBreak: 'break-word' }}>
                  {comment.comment}
                </Typography>
              </Box>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default CommentSection;
