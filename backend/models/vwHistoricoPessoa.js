module.exports = (sequelize, DataTypes) => {
    const vwHistoricoPessoa = sequelize.define(
        'vwHistoricoPessoa',
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
          nomePessoa: {     
            type: DataTypes.STRING(100),
            allowNull: false,
          },
          vinculo: {  // Indica se é um aluno, servidor ou visita.
            type: DataTypes.STRING(20),
            allowNull: false,
          },
          tipoId: {   // Indica se é uma Matrícula, CPF ou CNPJ
            type: DataTypes.STRING(20),
            allowNull: false,
          },
          idPessoa: { // Número da Matrícula, do CPF ou CNPJ
            type: DataTypes.BIGINT,
            allowNull: false,
          }
        },
        {
          tableName: 'vwHistoricPessoa',
          timestamps: false,
        }
      );

      return vwHistoricoPessoa
};