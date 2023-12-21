module.exports = (sequelize, DataTypes) => {
    const vwHistoricoAluno = sequelize.define(
        'vwHistoricoAluno',
        {
          idHistoricoEntrada: {
            type: DataTypes.INTEGER,
            primaryKey: true,
          },
          placa: {
            type: DataTypes.STRING(50),
            allowNull: false,
          },
          dataHora: {
            type: DataTypes.DATE,
            allowNull: false,
          },
          img: {
            type: DataTypes.STRING(250),
            allowNull: false,
          },
          idCarroRel: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          nome: {
            type: DataTypes.STRING(100),
            allowNull: false,
          },
          matricula: {
            type: DataTypes.BIGINT,
            allowNull: false,
          },
        },
        {
          tableName: 'vwhistoricoaluno',
          timestamps: false,
        }
      );

      return vwHistoricoAluno
};