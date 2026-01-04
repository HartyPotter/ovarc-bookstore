const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Store = sequelize.define('Store', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Store name cannot be empty' },
      len: { args: [2, 200], msg: 'Store name must be between 2 and 200 characters' }
    }
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Address cannot be empty' }
    }
  },
  logo: {
    type: DataTypes.STRING(500),
    allowNull: true,
    validate: {
      isValidLogo(value) {
        if (!value) return;
        const isUrl = /^https?:\/\//i.test(value);
        const isLocalPath = value.startsWith('/') || value.startsWith('uploads/');
        if (!isUrl && !isLocalPath) {
          throw new Error('Logo must be a URL or local path');
        }
      }
    }
  }
}, {
  timestamps: true,
  tableName: 'stores'
});

module.exports = Store;