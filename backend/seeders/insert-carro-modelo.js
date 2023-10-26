'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const dataHoraInsercao = new Date('2023-12-31 23:59:59');
    return queryInterface.bulkInsert('carro', [
      {
        marcaCarro: 'Marca modelo',
        modeloCarro: 'Modelo 1',
        anoCarro: 1997,
        validaCnh: 1,
        codigoEtiqueta: 'ty1253267',
        validadeEtiqueta: dataHoraInsercao,
        matriculaRel: 12345678910,
        placaCarro: 'BRA2E19',
      },
      {
        marcaCarro: 'Marca modelo',
        modeloCarro: 'Modelo 1',
        anoCarro: 1997,
        validaCnh: 1,
        codigoEtiqueta: 'ty1253267',
        validadeEtiqueta: dataHoraInsercao,
        matriculaRel: 29876543210,
        placaCarro: 'RNO6T78',
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('carro', null, {});
  },
};
