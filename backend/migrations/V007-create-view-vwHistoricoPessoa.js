'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Criação da view vwHistoricoPessoa
    await queryInterface.sequelize.query(`
      CREATE VIEW vwHistoricoPessoa AS
      SELECT 
        he.idHistoricoEntrada,
        he.dataHora,
        he.placa,
        he.img,
        a.nomePessoa,
        a.tipoId,
        a.idPessoa,
        a.vinculo
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
