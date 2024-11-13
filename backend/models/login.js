module.exports = (sequelize, DataTypes) => {
  const Login = sequelize.define('Login', {
    idlogin: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    usuario: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    senha: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user'
    },
    codigo_recuperacao: {
      type: DataTypes.STRING(10),
      allowNull: true,
    }
  });

  return Login;
};
