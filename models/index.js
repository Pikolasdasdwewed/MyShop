// models/index.js
// Инициализация MySQL + загрузка моделей + демо-данные

require('dotenv').config();
const bcrypt = require('bcryptjs');

const { createSequelize } = require('../config/database');

const defineUser = require('./User');
const defineProduct = require('./Product');

// ================= DEMO PRODUCTS =================

const demoProducts = [
  {
    brand: "Samsung",
    model: "Odyssey G5",
    diagonal: 34,
    resolution: "3440x1440",
    panelType: "VA",
    refreshRate: 165,
    responseTime: 1,
    ports: "HDMI, DisplayPort",
    desc: "34'' Curved Gaming Monitor 165Hz",
    price: 329.99,
    pic: "/img/OdysseyG5.jpg"
  },
  {
    brand: "LG",
    model: "UltraGear 27GP850",
    diagonal: 27,
    resolution: "2560x1440",
    panelType: "IPS",
    refreshRate: 165,
    responseTime: 1,
    ports: "HDMI, DisplayPort",
    desc: "27'' Nano IPS 165Hz QHD",
    price: 379.99,
    pic: "/img/LG27GP850.jpg"
  },
  {
    brand: "AOC",
    model: "24G2U",
    diagonal: 24,
    resolution: "1920x1080",
    panelType: "IPS",
    refreshRate: 144,
    responseTime: 1,
    ports: "HDMI, DisplayPort",
    desc: "24'' IPS 144Hz",
    price: 189.0,
    pic: "/img/AOC 24G2U.jpg"
  },
  {
    brand: "ASUS",
    model: "TUF VG27AQ",
    diagonal: 27,
    resolution: "2560x1440",
    panelType: "IPS",
    refreshRate: 165,
    responseTime: 1,
    ports: "HDMI, DisplayPort",
    desc: "27'' IPS 165Hz",
    price: 449.0,
    pic: "/img/ASUS TUF VG27AQ.jpg"
  },
  {
    brand: "Dell",
    model: "UltraSharp U2723QE",
    diagonal: 27,
    resolution: "3840x2160",
    panelType: "IPS",
    refreshRate: 60,
    responseTime: 5,
    ports: "HDMI, DisplayPort, USB-C",
    desc: "27'' 4K USB-C Hub Monitor",
    price: 649.99,
    pic: "/img/Dell UltraSharp U2723QE.jpg"
  },
  {
    brand: "Gigabyte",
    model: "M28U",
    diagonal: 28,
    resolution: "3840x2160",
    panelType: "IPS",
    refreshRate: 144,
    responseTime: 1,
    ports: "HDMI, DisplayPort",
    desc: "28'' 4K 144Hz Gaming Monitor",
    price: 529.99,
    pic: "/img/Gigabyte M28U.jpg"
  },
  {
    brand: "MSI",
    model: "Optix G241",
    diagonal: 24,
    resolution: "1920x1080",
    panelType: "IPS",
    refreshRate: 144,
    responseTime: 1,
    ports: "HDMI, DisplayPort",
    desc: "24'' IPS 144Hz",
    price: 169.99,
    pic: "/img/MSI Optix G241.jpg"
  },
  {
    brand: "BenQ",
    model: "PD2705U",
    diagonal: 27,
    resolution: "3840x2160",
    panelType: "IPS",
    refreshRate: 60,
    responseTime: 5,
    ports: "HDMI, USB-C",
    desc: "27'' 4K Designer Monitor",
    price: 599.0,
    pic: "/img/BenQ PD2705U.jpg"
  },
  {
    brand: "HP",
    model: "X34",
    diagonal: 34,
    resolution: "3440x1440",
    panelType: "IPS",
    refreshRate: 165,
    responseTime: 1,
    ports: "HDMI, DisplayPort",
    desc: "34'' 165Hz Ultrawide IPS",
    price: 399.0,
    pic: "/img/HP X34.jpg"
  }
];

// ================= GLOBALS =================
let sequelize;
let User;
let Product;

// ================= INIT DB =================
async function initDb() {
  sequelize = await createSequelize();

  // Загружаем модели
  User = defineUser(sequelize);
  Product = defineProduct(sequelize);

  // Создаём таблицы если не существуют
  await sequelize.sync();

  // ---------- USERS ----------
  const usersCount = await User.count();
  if (usersCount === 0) {
    const { ADMIN_EMAIL, ADMIN_PASSWORD, USER_EMAIL, USER_PASSWORD } = process.env;

    if (ADMIN_EMAIL && ADMIN_PASSWORD) {
      await User.create({
        name: "Admin",
        email: ADMIN_EMAIL,
        password: await bcrypt.hash(ADMIN_PASSWORD, 10),
        rule: "admin"
      });
      console.log("✔ Admin user created");
    } else {
      console.warn("⚠ ADMIN_EMAIL / ADMIN_PASSWORD not set in .env — admin NOT created.");
    }

    if (USER_EMAIL && USER_PASSWORD) {
      await User.create({
        name: "Customer",
        email: USER_EMAIL,
        password: await bcrypt.hash(USER_PASSWORD, 10),
        rule: "user"
      });
      console.log("✔ Regular user created");
    }
  }

  // ---------- PRODUCTS ----------
  const count = await Product.count();
  if (count === 0) {
    await Product.bulkCreate(demoProducts);
    console.log("✔ Inserted 9 demo monitor products");
  }

  return sequelize;
}

// ================= EXPORT =================
function getModels() {
  return { sequelize, User, Product };
}

module.exports = { initDb, getModels };
