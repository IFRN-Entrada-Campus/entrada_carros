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
      idPessoaRel: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'pessoa', // Nome da tabela referenciada
          key: 'idPessoa', // Coluna referenciada
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
      validadeEtiqueta: {
        type: Sequelize.DATE,
        allowNull: false,
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
