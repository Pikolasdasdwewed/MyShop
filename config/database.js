// Инициализация подключения к MySQL и создание БД при необходимости.
// Используем mysql2 для создания БД и Sequelize для ORM.

const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

async function createSequelize() {
  // Читаем конфиг из окружения (.env)
  const host = process.env.DB_HOST || 'localhost';
  const port = Number(process.env.DB_PORT || 3306);
  const user = process.env.DB_USER || 'root';
  const pass = process.env.DB_PASS || '';
  const dbName = process.env.DB_NAME || 'myshop';

  // 1️⃣ Создаём подключение напрямую и создаём БД при отсутствии
  const connection = await mysql.createConnection({
    host,
    port,
    user,
    password: pass
  });

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${dbName}\`
     CHARACTER SET utf8mb4
     COLLATE utf8mb4_unicode_ci;`
  );

  await connection.end();

  // 2️⃣ Инициализируем Sequelize уже к созданной БД
  const sequelize = new Sequelize(dbName, user, pass, {
    host,
    port,
    dialect: 'mysql',
    logging: false
  });

  return sequelize;
}

module.exports = { createSequelize };
