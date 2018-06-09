const mongoose = require('mongoose');

const User = mongoose.model('User');

module.exports = {
  async signin(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ error: 'Usuário não encontrado' });
      }

      if (!await user.compareHash(password)) {
        return res.status(400).json({ error: 'Senha inválida' });
      }

      return res.json({
        user,
        token: user.generateToken(),
      });
    } catch (err) {
      return next(err);
    }
  },

  async signup(req, res, next) {
    try {
      const { name, email, password } = req.body;

      if (await User.findOne({ email })) {
        return res.status(400).json({ error: 'Usuário já cadastrado' });
      }

      const user = await User.create({
        name,
        email,
        password,
      });

      return res.json({
        user,
        token: user.generateToken(),
      });
    } catch (err) {
      return next(err);
    }
  },
};
