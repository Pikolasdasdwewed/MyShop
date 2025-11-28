// controllers/productApiController.js
// REST API для мониторов (MySQL + Sequelize)

const { getModels } = require('../models');

// GET /api/products — список всех мониторов
async function list(req, res) {
  try {
    const { Product } = getModels();
    const monitors = await Product.findAll({ order: [['id', 'ASC']] });
    res.json(monitors);
  } catch (err) {
    console.error('API list error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

// GET /api/products/:id — получить один монитор
async function getOne(req, res) {
  try {
    const { Product } = getModels();
    const monitor = await Product.findByPk(req.params.id);

    if (!monitor) return res.status(404).json({ error: 'Not found' });

    res.json(monitor);
  } catch (err) {
    console.error('API getOne error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

// POST /api/products — создание монитора
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

    const created = await Product.create({
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

    res.status(201).json(created);
  } catch (err) {
    console.error('API create error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

// PUT /api/products/:id — обновление монитора
async function update(req, res) {
  try {
    const { Product } = getModels();
    const monitor = await Product.findByPk(req.params.id);

    if (!monitor) return res.status(404).json({ error: 'Not found' });

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

    res.json(monitor);
  } catch (err) {
    console.error('API update error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

// DELETE /api/products/:id — удалить монитор
async function remove(req, res) {
  try {
    const { Product } = getModels();
    const monitor = await Product.findByPk(req.params.id);

    if (!monitor) return res.status(404).json({ error: 'Not found' });

    await monitor.destroy();
    res.status(204).send();
  } catch (err) {
    console.error('API delete error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { list, getOne, create, update, remove };
