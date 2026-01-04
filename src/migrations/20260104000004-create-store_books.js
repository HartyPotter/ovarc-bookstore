'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('store_books', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      store_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'stores',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      book_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'books',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      copies: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      sold_out: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add unique constraint to prevent duplicate store-book combinations
    await queryInterface.addConstraint('store_books', {
      fields: ['store_id', 'book_id'],
      type: 'unique',
      name: 'unique_store_book'
    });

    // Add indexes for foreign keys
    await queryInterface.addIndex('store_books', ['store_id']);
    await queryInterface.addIndex('store_books', ['book_id']);
    await queryInterface.addIndex('store_books', ['sold_out']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('store_books');
  }
};