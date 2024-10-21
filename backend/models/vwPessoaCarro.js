module.exports = (sequelize, DataTypes) => {
    const VwPessoaCarro = sequelize.define('VwPessoaCarro', {
      Marca: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Modelo: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Ano: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      nomePessoa: {     
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      vinculo: {   // Indica se é um aluno, servidor ou visita.
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      tipoId: {   // Indica se é uma Matrícula, CPF ou CNPJ
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      idPessoa: { // Número da Matrícula, do CPF ou CNPJ
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      codigoEtiqueta: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      CNHvalida: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Placa: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      validadeEtiqueta: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    }, {
      tableName: 'vwPessoaCarro',
      timestamps: false,
    });
  
    return VwPessoaCarro;
  };
  