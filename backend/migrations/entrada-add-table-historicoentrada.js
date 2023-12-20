'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('historicoentrada', {
            idHistoricoEntrada: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            placa: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            dataHora: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            img: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            idCarroRel: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'carro', // Nome da tabela referenciada
                    key: 'idCarro', // Coluna referenciada
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('historicoentrada');
    },
};