import React, { useContext, useEffect, useState } from 'react';
import { Container, Box, Button, Typography } from '@mui/material';
import { PostContext } from '../context/PostContext';
import Navbar from '../components/Navbar';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import Loader from '../components/Loader';

const Feed = () => {
  const { posts, pagination, loading, fetchPosts } = useContext(PostContext);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchPosts(page, 10);
    // Smooth scroll to top of window when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (page < pagination.totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f0f2f5', pb: 4 }}>
      <Navbar />
      <Container maxWidth="sm" sx={{ mt: 3 }}>
        <CreatePost />

        {loading && posts.length === 0 ? (
          <Loader />
        ) : posts.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 8, p: 4, bgcolor: '#ffffff', borderRadius: 2, border: '1px solid #e0e0e0' }}>
            <Typography variant="body1" color="text.secondary">
              No posts to show. Write something above to start the feed!
            </Typography>
          </Box>
        ) : (
          <Box display="flex" flexDirection="column">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: '#ffffff',
                  borderRadius: 2,
                  border: '1px solid #e0e0e0',
                }}
              >
                <Button
                  variant="outlined"
                  onClick={handlePrevPage}
                  disabled={page === 1 || loading}
                  size="small"
                  sx={{ textTransform: 'none', borderRadius: 1.5 }}
                >
                  Previous
                </Button>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Page {page} of {pagination.totalPages}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={handleNextPage}
                  disabled={page === pagination.totalPages || loading}
                  size="small"
                  sx={{ textTransform: 'none', borderRadius: 1.5 }}
                >
                  Next
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Feed;
