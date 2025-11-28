// controllers/authController.js
// Контроллер авторизации: вход / выход пользователей

const bcrypt = require('bcryptjs');
const { getModels } = require('../models');

// GET /login – вывод формы входа
async function getLogin(req, res) {
  if (req.session.user) return res.redirect('/');

  const showError = Boolean(req.query.error);
  res.render('login', { title: 'Вход в систему', showError });
}

// POST /login – обработка данных формы
async function postLogin(req, res) {
  const { email, password } = req.body;
  const { User } = getModels();

  try {
    // Проверяем наличие пользователя
    const user = await User.findOne({ where: { email } });
    if (!user) return res.redirect('/login?error=1');

    // Проверяем пароль
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.redirect('/login?error=1');

    // Записываем в сессию только безопасные данные
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      rule: user.rule
    };

    res.redirect('/');
  } catch (e) {
    console.error('Login error:', e);
    res.redirect('/login?error=1');
  }
}

// POST /logout – завершение сессии
async function postLogout(req, res) {
  req.session.destroy(() => {
    res.redirect('/login');
  });
}

module.exports = { getLogin, postLogin, postLogout };
