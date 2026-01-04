const sequelize = require('../config/database');
const Store = require('./store');
const Book = require('./book');
const Author = require('./author');
const StoreBook = require('./storeBook');

// Define relationships

// Author - Book (One-to-Many)
Author.hasMany(Book, { 
  foreignKey: 'authorId',
  as: 'books',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

Book.belongsTo(Author, { 
  foreignKey: 'authorId',
  as: 'author'
});

// Store - Book (Many-to-Many through StoreBook)
Store.belongsToMany(Book, {
  through: StoreBook,
  foreignKey: 'storeId',
  otherKey: 'bookId',
  as: 'books'
});

Book.belongsToMany(Store, {
  through: StoreBook,
  foreignKey: 'bookId',
  otherKey: 'storeId',
  as: 'stores'
});

// Direct associations for StoreBook
Store.hasMany(StoreBook, {
  foreignKey: 'storeId',
  as: 'storeBooks',
  onDelete: 'CASCADE'
});

Book.hasMany(StoreBook, {
  foreignKey: 'bookId',
  as: 'storeBooks',
  onDelete: 'CASCADE'
});

StoreBook.belongsTo(Store, {
  foreignKey: 'storeId',
  as: 'store'
});

StoreBook.belongsTo(Book, {
  foreignKey: 'bookId',
  as: 'book'
});

module.exports = {
  sequelize,
  Store,
  Book,
  Author,
  StoreBook
};
