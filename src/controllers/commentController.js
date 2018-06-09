const mongoose = require('mongoose');

const User = mongoose.model('User');
const Post = mongoose.model('Post');

module.exports = {
  async create(req, res, next) {
    try {
      const [post, user] = await Promise.all([
        Post.findOne({ _id: req.params.postId }),
        User.findOne({ _id: req.userId }, { _id: 0, friends: 1 }),
      ]);

      if (!post) {
        return res.status(400).json({ error: 'Post not found' });
      }

      if (!post.author.equals(req.userId) && user.friends.indexOf(post.author) === -1) {
        return res.status(400).json({ error: 'User is not allowed to add comments to this post' });
      }

      post.comments.push({
        content: req.body.content,
        author: req.userId,
      });

      await post.save();

      return res.json(post);
    } catch (err) {
      return next(err);
    }
  },

  async update(req, res, next) {
    try {
      const post = await Post.findById(req.params.postId);

      if (!post || post.comments.lenght === 0) {
        return res.status(400).json({ error: 'Post and Comment not found' });
      }

      const index = post.comments.findIndex(comment => comment._id.equals(req.params.commentId));

      if (index === -1) {
        return res.status(400).json({ error: 'comment not found' });
      }

      if (!post.comments[index].author.equals(req.userId)) {
        return res.status(400).json({ error: 'User is not allowed update this comment' });
      }

      post.comments[index].content = req.body.content;

      await post.save();

      return res.json(post);
    } catch (err) {
      return next(err);
    }
  },

  async destroy(req, res, next) {
    try {
      const post = await Post.findById(req.params.postId);

      if (!post || post.comments.lenght === 0) {
        return res.status(400).json({ error: 'Post and Comment not found' });
      }

      const index = post.comments.findIndex(comment => comment._id.equals(req.params.commentId));

      if (index === -1) {
        return res.status(400).json({ error: 'comment not found' });
      }

      if (!post.comments[index].author.equals(req.userId)) {
        return res.status(400).json({ error: 'User is not allowed delete this comment' });
      }

      post.comments.splice(index, 1);

      await post.save();

      return res.json(post);
    } catch (err) {
      return next(err);
    }
  },
};
