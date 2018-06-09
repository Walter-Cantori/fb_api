const express = require('express');
const requireDir = require('require-dir');

const router = express.Router();
const controllers = requireDir('./controllers');
const authMiddleware = require('./middlewares/auth');

// Auth
router.post('/signin', controllers.authController.signin);
router.post('/signup', controllers.authController.signup);

// Protected routes
router.use(authMiddleware);

// User routes
router.get('/user', controllers.userController.show);
router.get('/user/feed', controllers.userController.feed);
router.put('/user', controllers.userController.update);
router.put('/user/toggle-friend/:id', controllers.userController.toggleFriend);

// Post routes
router.post('/post', controllers.postController.create);
router.put('/post/like/:id', controllers.postController.toggleLike);
router.put('/post/:id', controllers.postController.update);
router.delete('/post/:id', controllers.postController.destroy);

// Comment routes
router.put('/post/comment/:postId', controllers.commentController.create);
router.put('/post/comment/:postId/:commentId', controllers.commentController.update);
router.delete('/post/comment/:postId/:commentId', controllers.commentController.destroy);

// Not found
router.use((req, res) => res.status(404).json({ error: 'route not found' }));

// Errors
router.use((err, req, res, _next) => {
  res.json({ error: err.stack });
});

module.exports = router;
