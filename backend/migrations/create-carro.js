'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('carro', {
      idCarro: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      marcaCarro: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      modeloCarro: {
        type: Sequelize.STRING(80),
        allowNull: false,
      },
      anoCarro: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      validaCnh: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      codigoEtiqueta: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      matriculaRel: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'aluno', // Nome da tabela referenciada
          key: 'matriculaAluno', // Coluna referenciada
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      placaCarro: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('carro');
  },
};
