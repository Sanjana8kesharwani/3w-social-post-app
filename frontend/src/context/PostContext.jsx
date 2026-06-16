import React, { createContext, useState } from 'react';
import api from '../utils/api';

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchPosts = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const res = await api.get(`/posts?page=${page}&limit=${limit}`);
      setPosts(res.data.posts);
      setPagination({
        currentPage: res.data.currentPage,
        totalPages: res.data.totalPages,
        totalPosts: res.data.totalPosts,
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (formData, showToast) => {
    try {
      setLoading(true);
      const res = await api.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Prepend the newly created post so it shows on the UI feed instantly
      setPosts((prevPosts) => [res.data, ...prevPosts]);
      if (showToast) showToast('Post created successfully!', 'success');
      return { success: true };
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Failed to create post';
      if (showToast) showToast(errMsg, 'error');
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  const likePost = async (postId, user) => {
    if (!user) return;
    const originalPosts = [...posts];

    // Optimistic Update for instant UI changes
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post._id === postId) {
          const alreadyLikedIndex = post.likes.findIndex(
            (like) => like.userId.toString() === user.id.toString()
          );
          const updatedLikes = [...post.likes];
          if (alreadyLikedIndex > -1) {
            updatedLikes.splice(alreadyLikedIndex, 1);
          } else {
            updatedLikes.push({ userId: user.id, username: user.username });
          }
          return { ...post, likes: updatedLikes };
        }
        return post;
      })
    );

    try {
      const res = await api.put(`/posts/${postId}/like`);
      // Update state with server data
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === postId ? res.data : post))
      );
    } catch (error) {
      // Revert optimistic update on failure
      setPosts(originalPosts);
      console.error('Error toggling like:', error);
    }
  };

  const commentPost = async (postId, commentText, user) => {
    if (!user || !commentText.trim()) return;
    const originalPosts = [...posts];

    // Create a local temporary comment object
    const tempComment = {
      _id: Date.now().toString(),
      userId: user.id,
      username: user.username,
      comment: commentText.trim(),
      createdAt: new Date().toISOString(),
    };

    // Optimistic Update for instant comment displaying
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post._id === postId) {
          return {
            ...post,
            comments: [...post.comments, tempComment],
          };
        }
        return post;
      })
    );

    try {
      const res = await api.post(`/posts/${postId}/comment`, { comment: commentText });
      // Update state with actual server comment containing database ID and server date
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === postId ? res.data : post))
      );
      return { success: true };
    } catch (error) {
      // Revert optimistic comments list
      setPosts(originalPosts);
      console.error('Error posting comment:', error);
      return { success: false };
    }
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        pagination,
        loading,
        fetchPosts,
        createPost,
        likePost,
        commentPost,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
