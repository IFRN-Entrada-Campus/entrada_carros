module.exports = (sequelize, DataTypes) => {
    const Pessoa = sequelize.define('Pessoa', {
      idPessoa: {  // Número da Matrícula, do CPF ou CNPJ
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
      },
      tipoId: {    // Indica se é uma Matrícula, CPF ou CNPJ
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      nomePessoa: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      vinculo: {   // Indica se é um aluno, servidor ou visita.
        type: DataTypes.STRING(20),
        allowNull: false,
      }
    });
  
    return Pessoa;
  };
  