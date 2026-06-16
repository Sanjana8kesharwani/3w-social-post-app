import React, { useState, useContext } from 'react';
import { Card, CardHeader, CardContent, CardMedia, CardActions, Typography, Avatar, IconButton, Box } from '@mui/material';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { AuthContext } from '../context/AuthContext';
import { PostContext } from '../context/PostContext';
import CommentSection from './CommentSection';

const PostCard = ({ post }) => {
  const { user } = useContext(AuthContext);
  const { likePost } = useContext(PostContext);
  const [showComments, setShowComments] = useState(false);

  // Check if current logged in user has already liked this post
  const isLiked = user ? post.likes.some((like) => like.userId.toString() === user.id.toString()) : false;

  const handleLike = () => {
    if (!user) return;
    likePost(post._id, user);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card variant="outlined" sx={{ mb: 2, borderRadius: 2, backgroundColor: '#ffffff' }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: '#1976d2', fontWeight: 'bold', fontSize: '0.9rem' }}>
            {post.username.charAt(0).toUpperCase()}
          </Avatar>
        }
        title={<Typography sx={{ fontWeight: 600, color: '#333333' }}>{post.username}</Typography>}
        subheader={formatDate(post.createdAt)}
        sx={{ pb: 1 }}
      />

      {post.text && (
        <CardContent sx={{ pt: 0, pb: 1 }}>
          <Typography variant="body1" color="text.primary" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '0.95rem' }}>
            {post.text}
          </Typography>
        </CardContent>
      )}

      {post.image && (
        <CardMedia
          component="img"
          image={post.image}
          alt="Post attached image"
          sx={{
            maxHeight: 400,
            objectFit: 'contain',
            backgroundColor: '#fafafa',
            borderTop: '1px solid #f0f0f0',
            borderBottom: '1px solid #f0f0f0',
          }}
        />
      )}

      <CardActions sx={{ px: 2, py: 0.5, justifyContent: 'space-between', borderTop: '1px solid #fcfcfc' }}>
        <Box display="flex" alignItems="center">
          <IconButton
            onClick={handleLike}
            disabled={!user}
            color={isLiked ? 'primary' : 'default'}
            size="small"
            sx={{ mr: 0.5 }}
          >
            {isLiked ? <ThumbUpAltIcon fontSize="small" /> : <ThumbUpOffAltIcon fontSize="small" />}
          </IconButton>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            {post.likes.length} {post.likes.length === 1 ? 'Like' : 'Likes'}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center">
          <IconButton onClick={() => setShowComments(!showComments)} color="default" size="small" sx={{ mr: 0.5 }}>
            <ChatBubbleOutlineIcon fontSize="small" />
          </IconButton>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 500, cursor: 'pointer' }}
            onClick={() => setShowComments(!showComments)}
          >
            {post.comments.length} {post.comments.length === 1 ? 'Comment' : 'Comments'}
          </Typography>
        </Box>
      </CardActions>

      {showComments && (
        <CommentSection post={post} />
      )}
    </Card>
  );
};

export default PostCard;
