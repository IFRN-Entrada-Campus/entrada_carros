module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('login', {
        idlogin: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        usuario: {
          type: Sequelize.STRING(150),
          allowNull: false,
        },
        senha: {
          type: Sequelize.STRING(150),
          allowNull: false,
        },
      });
    },
  
    down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('login');
    },
  };
  