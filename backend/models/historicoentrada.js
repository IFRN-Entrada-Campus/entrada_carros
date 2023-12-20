module.exports = (sequelize, DataTypes) => {
    const HistoricoEntrada = sequelize.define('HistoricoEntrada', {
        idHistoricoEntrada: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
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
    });

    HistoricoEntrada.associate = (models) => {
        HistoricoEntrada.belongsTo(models.Carro, {
            foreignKey: 'idCarroRel',
            as: 'carro',
        });
    };
}