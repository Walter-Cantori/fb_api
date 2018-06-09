const mongoose = require('mongoose');

const User = mongoose.model('User');
const Post = mongoose.model('Post');

module.exports = {
  async show(req, res, next) {
    const id = req.userId;
    try {
      const [user, postCount] = await Promise.all([
        User.findById(id),
        Post.find({ author: id }).count(),
      ]);

      const friends = await User.find({ _id: { $in: user.friends } }, { name: 1, email: 1 });

      return res.json({
        user,
        postCount,
        friends,
      });
    } catch (err) {
      return next(err);
    }
  },

  async update(req, res, next) {
    const id = req.userId;
    try {
      const {
        name,
        email,
        password,
        confirmPassword,
      } = req.body;

      if (password && password !== confirmPassword) {
        return res.status(400).json({ error: 'Password and Confirm Password don`t match' });
      }

      const user = await User.findByIdAndUpdate(id, { name, email });

      if (password) {
        user.password = password;
        await user.save();
      }

      return res.json(user);
    } catch (err) {
      return next(err);
    }
  },

  async toggleFriend(req, res, next) {
    try {
      const [user, me] = await Promise.all([
        User.findById(req.params.id),
        User.findById(req.userId),
      ]);

      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }

      const userIndex = user.friends.indexOf(req.userId);
      const meIndex = me.friends.indexOf(req.params.id);

      if (userIndex === -1) {
        user.friends.push(req.userId);
        me.friends.push(req.params.id);
      } else {
        user.friends.splice(userIndex, 1);
        me.friends.splice(meIndex, 1);
      }

      await Promise.all([
        user.save(),
        me.save(),
      ]);

      return res.json(me);
    } catch (err) {
      return next(err);
    }
  },

  async feed(req, res, next) {
    try {
      const user = await User.findOne({ _id: req.userId }, { _id: 0, friends: 1 });

      const posts = await Post.find({ author: { $in: user.friends } });

      return res.json(posts);
    } catch (err) {
      return next(err);
    }
  },
};
