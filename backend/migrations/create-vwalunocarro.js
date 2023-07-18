'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // A migração para criar a view não precisa de comandos para criar ou excluir a tabela, apenas para criar a view.
    await queryInterface.sequelize.query(`
      CREATE VIEW vwalunocarro AS
      SELECT
        c.marcaCarro AS Marca,
        c.modeloCarro AS Modelo,
        c.anoCarro AS Ano,
        a.noAluno AS Aluno,
        a.matriculaAluno AS Matricula,
        c.codigoEtiqueta,
        c.validaCnh AS CNHvalida
      FROM carro c
      JOIN aluno a ON a.matriculaAluno = c.matriculaRel;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Para a view, é suficiente remover a view.
    await queryInterface.sequelize.query('DROP VIEW vwalunocarro;');
  },
};
