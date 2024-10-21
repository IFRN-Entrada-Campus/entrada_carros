'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Criação da view vwPessoaCarro
    await queryInterface.sequelize.query(`
      CREATE VIEW vwPessoaCarro AS
      SELECT
        a.nomePessoa,
        a.idPessoa,
        a.tipoId,
        a.vinculo,
        c.marcaCarro AS Marca,
        c.modeloCarro AS Modelo,
        c.anoCarro AS Ano,
        c.codigoEtiqueta,
        c.validaCnh AS CNHvalida,
        c.placaCarro AS Placa,
        c.validadeEtiqueta
      FROM carro c
      JOIN pessoa a ON a.idPessoa = c.idPessoaRel;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Remoção da view vwPessoaCarro
    await queryInterface.sequelize.query('DROP VIEW IF EXISTS vwPessoaCarro;');
  },
};
