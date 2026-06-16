import React, { useState, useContext } from 'react';
import { Card, CardContent, Button, TextField, Box, Typography, IconButton } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CloseIcon from '@mui/icons-material/Close';
import { PostContext } from '../context/PostContext';
import { AuthContext } from '../context/AuthContext';

const CreatePost = () => {
  const { createPost } = useContext(PostContext);
  const { showToast } = useContext(AuthContext);
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim() && !imageFile) {
      showToast('Please add text or select an image to post.', 'warning');
      return;
    }

    const formData = new FormData();
    if (text.trim()) {
      formData.append('text', text.trim());
    }
    if (imageFile) {
      formData.append('image', imageFile);
    }

    setUploading(true);
    const result = await createPost(formData, showToast);
    setUploading(false);

    if (result.success) {
      setText('');
      setImageFile(null);
      setImagePreview('');
    }
  };

  return (
    <Card variant="outlined" sx={{ mb: 3, borderRadius: 2, backgroundColor: '#ffffff' }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5, color: '#333333' }}>
          Share something
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Write post content here..."
            variant="outlined"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={uploading}
            size="small"
            sx={{ mb: 1.5 }}
          />

          {imagePreview && (
            <Box
              sx={{
                position: 'relative',
                mb: 1.5,
                borderRadius: 1,
                overflow: 'hidden',
                maxHeight: 250,
                border: '1px solid #e0e0e0',
                display: 'flex',
                justifyContent: 'center',
                backgroundColor: '#f5f5f5',
              }}
            >
              <img
                src={imagePreview}
                alt="Selected upload preview"
                style={{ maxHeight: '248px', maxWidth: '100%', objectFit: 'contain' }}
              />
              <IconButton
                onClick={handleRemoveImage}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
                }}
                size="small"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          )}

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="post-image-file-input"
                type="file"
                onChange={handleImageChange}
                disabled={uploading}
              />
              <label htmlFor="post-image-file-input">
                <Button
                  variant="text"
                  color="secondary"
                  component="span"
                  startIcon={<PhotoCameraIcon />}
                  disabled={uploading}
                  size="small"
                  sx={{ textTransform: 'none', fontWeight: 500 }}
                >
                  Upload Image
                </Button>
              </label>
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={uploading || (!text.trim() && !imageFile)}
              size="small"
              sx={{ textTransform: 'none', px: 3, borderRadius: 1.5 }}
            >
              {uploading ? 'Uploading...' : 'Publish'}
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
