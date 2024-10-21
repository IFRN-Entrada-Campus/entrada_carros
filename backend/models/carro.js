module.exports = (sequelize, DataTypes) => {
    const Carro = sequelize.define('Carro', {
      idCarro: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      marcaCarro: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      modeloCarro: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      anoCarro: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      validaCnh: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      codigoEtiqueta: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      validadeEtiqueta: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      idPessoaRel: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      placaCarro: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    });
  
    Carro.associate = (models) => {
      Carro.belongsTo(models.Aluno, {
        foreignKey: 'idPessoaRel',
        as: 'pessoa',
      });
    };
  
    return Carro;
  };
  