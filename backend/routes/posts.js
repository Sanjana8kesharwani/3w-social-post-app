const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// @route   GET /api/posts
// @desc    Get all posts (paginated, sorted by newest first)
// @access  Public (or Protected, depending on requirement. We will make it public, but token checked if present for other interactions)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const totalPosts = await Post.countDocuments();
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalPosts / limit);

    return res.status(200).json({
      posts,
      currentPage: page,
      totalPages,
      totalPosts,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error retrieving posts', error: error.message });
  }
});

// @route   POST /api/posts
// @desc    Create a new post (text, image, or both)
// @access  Protected
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { text } = req.body;
    let image = '';

    if (req.file) {
      image = req.file.path; // Multer storage engine returns Cloudinary secure URL
    }

    // Validation: At least one field must exist
    if (!text && !image) {
      return res.status(400).json({ message: 'Post must contain either text or an image' });
    }

    const newPost = new Post({
      userId: req.user.id,
      username: req.user.username,
      text: text || '',
      image,
      likes: [],
      comments: [],
    });

    const savedPost = await newPost.save();
    return res.status(201).json(savedPost);
  } catch (error) {
    return res.status(500).json({ message: 'Server error creating post', error: error.message });
  }
});

// @route   PUT /api/posts/:id/like
// @desc    Toggle like/unlike on a post
// @access  Protected
router.put('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user has already liked the post
    const alreadyLikedIndex = post.likes.findIndex(
      (like) => like.userId.toString() === req.user.id
    );

    if (alreadyLikedIndex > -1) {
      // User already liked it: Unlike (remove user from likes array)
      post.likes.splice(alreadyLikedIndex, 1);
    } else {
      // User hasn't liked it: Like (add user to likes array)
      post.likes.push({
        userId: req.user.id,
        username: req.user.username,
      });
    }

    const updatedPost = await post.save();
    return res.status(200).json(updatedPost);
  } catch (error) {
    return res.status(500).json({ message: 'Server error toggling like', error: error.message });
  }
});

// @route   POST /api/posts/:id/comment
// @desc    Add a comment to a post
// @access  Protected
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { comment } = req.body;

    if (!comment || !comment.trim()) {
      return res.status(400).json({ message: 'Comment cannot be empty' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Append comment subdocument
    const newComment = {
      userId: req.user.id,
      username: req.user.username,
      comment: comment.trim(),
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    const updatedPost = await post.save();
    return res.status(201).json(updatedPost);
  } catch (error) {
    return res.status(500).json({ message: 'Server error posting comment', error: error.message });
  }
});

module.exports = router;
