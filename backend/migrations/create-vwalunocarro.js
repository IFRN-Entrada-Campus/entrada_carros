'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      CREATE VIEW vwalunocarro AS
      SELECT
        c.marcaCarro AS Marca,
        c.modeloCarro AS Modelo,
        c.anoCarro AS Ano,
        a.noAluno AS Aluno,
        a.matriculaAluno AS Matricula,
        c.codigoEtiqueta,
        c.validaCnh AS CNHvalida,
        c.placaCarro AS Placa,
        c.validadeEtiqueta
      FROM carro c
      JOIN aluno a ON a.matriculaAluno = c.matriculaRel;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('DROP VIEW vwalunocarro;');
  },
};
