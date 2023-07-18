module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('aluno', {
        matriculaAluno: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          allowNull: false,
        },
        noAluno: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
      });
    },
  
    down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('aluno');
    },
  };
  