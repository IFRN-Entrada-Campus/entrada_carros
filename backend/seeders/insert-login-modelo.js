'use strict';

// module.exports = {
//   up: async (queryInterface, Sequelize) => {

//     const dataHoraInsercao = new Date('2023-12-31 23:59:59');
//     return queryInterface.bulkInsert('carro', [
//       {
//         marcaCarro: 'Marca modelo',
//         modeloCarro: 'Modelo 1',
//         anoCarro: 1997,
//         validaCnh: 1,
//         codigoEtiqueta: 'ty1253267',
//         validadeEtiqueta: dataHoraInsercao,
//         matriculaRel: 12345678910,
//         placaCarro: 'BRA2E19',
//       },
//       {
//         marcaCarro: 'Marca modelo',
//         modeloCarro: 'Modelo 1',
//         anoCarro: 1997,
//         validaCnh: 1,
//         codigoEtiqueta: 'ty1253267',
//         validadeEtiqueta: dataHoraInsercao,
//         matriculaRel: 29876543210,
//         placaCarro: 'RNO6T78',
//       },
//     ]);
//   },

//   down: async (queryInterface, Sequelize) => {
//     return queryInterface.bulkDelete('carro', null, {});
//   },
// };

// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     return queryInterface.bulkInsert('aluno', [
//       {
//         noAluno: 'Aluno modelo 1',
//         matriculaAluno: 12345678910,
//       },
//       {
//         noAluno: 'Aluno modelo 2',
//         matriculaAluno: 29876543210,
//       },
//     ]);
//   },

//   down: async (queryInterface, Sequelize) => {
//     return queryInterface.bulkDelete('aluno', null, {});
//   },
// };

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('login', [
      {
        idlogin: 1,
        usuario: 'admin1',
        senha: '$2b$10$B48AwOk4psGv6zGvzkcbUeRLtVFTIdlp.FChRWKzuI8EkLs4bWffq'
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('login', null, {});
  },
};
