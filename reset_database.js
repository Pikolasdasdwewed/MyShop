require('dotenv').config();
const { initDb, getModels } = require('./models');

(async () => {
  await initDb();
  const { Product, User } = getModels();

  await Product.destroy({ where: {}, truncate: true });
  await User.destroy({ where: {}, truncate: true });

  console.log("База данных очищена. Тестовые данные загружены.");
  process.exit(0);
})();
