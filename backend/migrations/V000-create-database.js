module.exports = {
    up: async (queryInterface, Sequelize) => {
      // Executa o comando SQL bruto para criar o banco de dados, caso ele não exista
      await queryInterface.sequelize.query(`
        CREATE DATABASE IF NOT EXISTS \`dbentrada\` 
        DEFAULT CHARACTER SET utf8mb4 
        COLLATE utf8mb4_0900_ai_ci;
      `);
      
      // Agora podemos criar a tabela no banco de dados 'dbentrada'
      await queryInterface.sequelize.query('USE `dbentrada`;');
    },
  };
  