'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Criação da view vwHistoricoPessoa
    await queryInterface.sequelize.query(`
      CREATE VIEW vwHistoricoPessoa AS
      SELECT he.placa,
             he.dataHora,
             he.img,
             a.nomePessoa AS nome,
             a.idPessoa AS identificacao
      FROM historicoEntrada he
      JOIN carro c ON he.idCarroRel = c.idCarro
      JOIN pessoa a ON c.idPessoaRel = a.idPessoa;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Remoção da view vwHistoricoPessoa
    await queryInterface.sequelize.query('DROP VIEW IF EXISTS vwHistoricoPessoa;');
  },
};
