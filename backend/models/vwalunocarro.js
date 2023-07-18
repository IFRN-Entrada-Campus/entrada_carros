module.exports = (sequelize, DataTypes) => {
    const VwAlunoCarro = sequelize.define('VwAlunoCarro', {
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
      Aluno: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Matricula: {
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
    }, {
      tableName: 'vwalunocarro',
      timestamps: false,
    });
  
    return VwAlunoCarro;
  };
  