// controllers/productController.js
// Контроллер для веб-интерфейса мониторов

const { getModels } = require('../models');

// Главная страница (список мониторов)
async function listPage(req, res) {
  try {
    const { Product } = getModels();
    const monitors = await Product.findAll({ order: [['id', 'ASC']] });
    res.render('index', { title: 'Магазин Мониторов', products: monitors });
  } catch (err) {
    console.error('listPage error:', err);
    res.status(500).send('Server error');
  }
}

// Форма создания монитора
async function newForm(req, res) {
  res.render('product_form', { title: 'Добавить монитор', product: null });
}

// Создание монитора
async function create(req, res) {
  try {
    const { Product } = getModels();
    const {
      brand,
      model,
      diagonal,
      resolution,
      panelType,
      refreshRate,
      responseTime,
      ports,
      desc,
      price,
      pic
    } = req.body;

    const picture = pic && pic.trim() ? pic.trim() : '/img/pic.png';

    await Product.create({
      brand,
      model,
      diagonal,
      resolution,
      panelType,
      refreshRate,
      responseTime,
      ports,
      desc,
      price,
      pic: picture
    });

    res.redirect('/');
  } catch (err) {
    console.error('create error:', err);
    res.status(500).send('Server error');
  }
}

// Форма редактирования монитора
async function editForm(req, res) {
  try {
    const { Product } = getModels();
    const monitor = await Product.findByPk(req.params.id);

    if (!monitor) return res.status(404).send('Not found');

    res.render('product_form', { title: 'Редактировать монитор', product: monitor });
  } catch (err) {
    console.error('editForm error:', err);
    res.status(500).send('Server error');
  }
}

// Обновление монитора
async function update(req, res) {
  try {
    const { Product } = getModels();
    const monitor = await Product.findByPk(req.params.id);

    if (!monitor) return res.status(404).send('Not found');

    const {
      brand,
      model,
      diagonal,
      resolution,
      panelType,
      refreshRate,
      responseTime,
      ports,
      desc,
      price,
      pic
    } = req.body;

    const picture = pic && pic.trim() ? pic.trim() : '/img/pic.png';

    await monitor.update({
      brand,
      model,
      diagonal,
      resolution,
      panelType,
      refreshRate,
      responseTime,
      ports,
      desc,
      price,
      pic: picture
    });

    res.redirect('/');
  } catch (err) {
    console.error('update error:', err);
    res.status(500).send('Server error');
  }
}

// Удаление монитора
async function remove(req, res) {
  try {
    const { Product } = getModels();
    const monitor = await Product.findByPk(req.params.id);

    if (!monitor) return res.status(404).send('Not found');

    await monitor.destroy();
    res.redirect('/');
  } catch (err) {
    console.error('remove error:', err);
    res.status(500).send('Server error');
  }
}

module.exports = { listPage, newForm, create, editForm, update, remove };
