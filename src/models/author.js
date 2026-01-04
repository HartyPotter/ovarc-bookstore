const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Author = sequelize.define('Author', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Author name cannot be empty' },
      len: { args: [2, 200], msg: 'Author name must be between 2 and 200 characters' }
    }
  }
}, {
  timestamps: true,
  tableName: 'authors'
});

module.exports = Author;