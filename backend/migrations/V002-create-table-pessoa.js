module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('pessoa', {
        idPessoa: {  // Número da Matrícula, do CPF ou CNPJ
          type: Sequelize.BIGINT,
          primaryKey: true,
          allowNull: false,
        },
        tipoId: {    // Indica se é uma Matrícula, CPF ou CNPJ
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        nomePessoa: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        vinculo: {   // Indica se é um aluno, servidor ou visita.
          type: Sequelize.STRING(20),
          allowNull: false,
        }

      });
    },
  
    down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('pessoa');
    },
  };
  