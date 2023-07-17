module.exports = (sequelize, DataTypes) => {
    const Aluno = sequelize.define('Aluno', {
      matriculaAluno: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
      },
      noAluno: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    });
  
    return Aluno;
  };
  