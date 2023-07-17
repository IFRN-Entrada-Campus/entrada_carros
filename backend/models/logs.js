// /backend/models/log.js
module.exports = (sequelize, DataTypes) => {
    const Log = sequelize.define('Log', {
      idlogs: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      operacao: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      usuario: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      dataoperacao: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      detalhe: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    });
  
    return Log;
  };
  