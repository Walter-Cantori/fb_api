const mongoose = require('mongoose');

const Post = mongoose.model('Post');

module.exports = {
  async create(req, res, next) {
    try {
      const id = req.userId;
      const { content } = req.body;

      let comments;

      if (req.body.comments) {
        comments = { ...req.body.comments, author: req.userId };
      }

      const result = await Post.create({ author: id, content, comments });
      return res.json(result);
    } catch (err) {
      return next(err);
    }
  },

  async update(req, res, next) {
    try {
      const { userId } = req;
      const { content } = req.body;
      const post = await Post.findOne({ author: userId, _id: req.params.id });

      if (!post) {
        return res.status(400).json({ error: 'Post not found for given user' });
      }

      post.content = content;

      await post.save();

      return res.json(post);
    } catch (err) {
      return next(err);
    }
  },

  async destroy(req, res, next) {
    try {
      const result = await Post.findOneAndRemove({ _id: req.params.id, author: req.userId });

      if (!result) {
        return res.status(400).json({ error: 'Post not found for given user' });
      }

      return res.json(result);
    } catch (err) {
      return next(err);
    }
  },

  async toggleLike(req, res, next) {
    try {
      const { userId } = req;
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(400).json({ error: 'Post not found' });
      }

      const index = post.likes.indexOf(userId);
      if (index === -1) {
        post.likes.push(userId);
      } else {
        post.likes.splice(index, 1);
      }

      await post.save();

      return res.json(post);
    } catch (err) {
      return next(err);
    }
  },

};
