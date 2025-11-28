// models/Product.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Product = sequelize.define(
    'Product',
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },

      // Основные данные
      brand: { type: DataTypes.STRING(100), allowNull: false },
      model: { type: DataTypes.STRING(150), allowNull: false },

      // Технические характеристики монитора
      diagonal: { type: DataTypes.FLOAT, allowNull: false },        // в дюймах
      resolution: { type: DataTypes.STRING(50), allowNull: false }, // "2560x1440"
      panelType: { type: DataTypes.STRING(50), allowNull: false },  // IPS / VA / TN
      refreshRate: { type: DataTypes.INTEGER, allowNull: false },   // 144 / 165 / 240
      responseTime: { type: DataTypes.FLOAT, allowNull: false },    // 1 / 4 / 5 ms
      ports: { type: DataTypes.STRING(255), allowNull: false },     // "HDMI, DisplayPort"

      // Описание и цена
      desc: { type: DataTypes.TEXT, allowNull: false },
      price: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      pic: { type: DataTypes.STRING(255), allowNull: false }
    },
    {
      tableName: 'products',
      timestamps: true
    }
  );
  return Product;
};
