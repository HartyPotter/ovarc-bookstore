const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Book = sequelize.define('Book', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(300),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Book name cannot be empty' },
      len: { args: [1, 300], msg: 'Book name must be between 1 and 300 characters' }
    }
  },
  pages: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: { args: [1], msg: 'Pages must be at least 1' },
      max: { args: [10000], msg: 'Pages cannot exceed 10000' }
    }
  },
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'authors',
      key: 'id'
    },
    field: 'author_id'
  }
}, {
  timestamps: true,
  tableName: 'books',
  underscored: true
});

module.exports = Book;
