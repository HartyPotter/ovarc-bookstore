const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StoreBook = sequelize.define('StoreBook', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  storeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'stores',
      key: 'id'
    },
    field: 'store_id'
  },
  bookId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'books',
      key: 'id'
    },
    field: 'book_id'
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: { args: [0], msg: 'Price must be positive' },
      isDecimal: { msg: 'Price must be a valid decimal number' }
    }
  },
  copies: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: { args: [0], msg: 'Copies cannot be negative' }
    }
  },
  soldOut: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'sold_out'
  }
}, {
  timestamps: true,
  tableName: 'store_books',
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['store_id', 'book_id']
    }
  ]
});

module.exports = StoreBook;