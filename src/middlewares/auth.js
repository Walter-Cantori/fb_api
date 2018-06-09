const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const authConfig = require('../../config/auth');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(400).json({ error: 'No Token Provided' });
  }

  const [schema, token] = authHeader.split(' ');

  if (!schema || !token) {
    return res.status(400).json({ error: 'Invalid Token' });
  }

  if (schema !== 'Bearer') {
    return res.status(400).json({ error: 'Invalid Token' });
  }
  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    req.userId = decoded.id;
    return next();
  } catch (err) {
    return res.status(400).json({ error: 'Invalid Token' });
  }
};
