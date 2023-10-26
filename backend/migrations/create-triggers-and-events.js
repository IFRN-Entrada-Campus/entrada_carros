'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Criação do trigger para a tabela 'aluno'
    await queryInterface.sequelize.query(`
      CREATE TRIGGER after_aluno_insert AFTER INSERT ON aluno
      FOR EACH ROW
      BEGIN
        INSERT INTO logs (operacao, usuario, dataoperacao, detalhe)
        VALUES ('INSERT', 'root@localhost', NOW(), CONCAT('Registro inserido: matriculaAluno=', NEW.matriculaAluno, ' noAluno=', NEW.noAluno, '. Tabela aluno'));
      END
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER after_aluno_update AFTER UPDATE ON aluno
      FOR EACH ROW
      BEGIN
        INSERT INTO logs (operacao, usuario, dataoperacao, detalhe)
        VALUES ('UPDATE', 'root@localhost', NOW(), CONCAT('Registro afetado: matriculaAluno=', OLD.matriculaAluno, ' noAluno=', OLD.noAluno, ' -> matriculaAluno=', NEW.matriculaAluno, ' noAluno=', NEW.noAluno, '. Tabela aluno'));
      END
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER after_aluno_delete AFTER DELETE ON aluno
      FOR EACH ROW
      BEGIN
        INSERT INTO logs (operacao, usuario, dataoperacao, detalhe)
        VALUES ('DELETE', 'root@localhost', NOW(), CONCAT('Registro deletado: matriculaAluno=', OLD.matriculaAluno, ' noAluno=', OLD.noAluno, '. Tabela aluno'));
      END
    `);

    // Criação do trigger para a tabela 'carro'
    await queryInterface.sequelize.query(`
      CREATE TRIGGER after_carro_insert AFTER INSERT ON carro
      FOR EACH ROW
      BEGIN
        INSERT INTO logs (operacao, usuario, dataoperacao, detalhe)
        VALUES ('INSERT', 'root@localhost', NOW(), CONCAT('Registro inserido: idCarro=', NEW.idCarro, ', marcaCarro=', NEW.marcaCarro, ', modeloCarro=', NEW.modeloCarro, ', anoCarro=', NEW.anoCarro, ', validaCnh=', NEW.validaCnh, ', codigoEtiqueta=', NEW.codigoEtiqueta, ', validadeEtiqueta=', NEW.validadeEtiqueta, ', matriculaRel=', NEW.matriculaRel, '. Tabela carro'));
      END
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER after_carro_update AFTER UPDATE ON carro
      FOR EACH ROW
      BEGIN
        INSERT INTO logs (operacao, usuario, dataoperacao, detalhe)
        VALUES ('UPDATE', 'root@localhost', NOW(), CONCAT('Registro afetado: idCarro=', OLD.idCarro, ', marcaCarro=', OLD.marcaCarro, ', modeloCarro=', OLD.modeloCarro, ', anoCarro=', OLD.anoCarro, ', validaCnh=', OLD.validaCnh, ', codigoEtiqueta=', OLD.codigoEtiqueta, ', validadeEtiqueta=', OLD.validadeEtiqueta, ', matriculaRel=', OLD.matriculaRel, ' -> idCarro=', NEW.idCarro, ', marcaCarro=', NEW.marcaCarro, ', modeloCarro=', NEW.modeloCarro, ', anoCarro=', NEW.anoCarro, ', validaCnh=', NEW.validaCnh, ', codigoEtiqueta=', NEW.codigoEtiqueta, ', validadeEtiqueta=', NEW.validadeEtiqueta, ', matriculaRel=', NEW.matriculaRel, '. Tabela carro'));
      END
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER after_carro_delete AFTER DELETE ON carro
      FOR EACH ROW
      BEGIN
        INSERT INTO logs (operacao, usuario, dataoperacao, detalhe)
        VALUES ('DELETE', 'root@localhost', NOW(), CONCAT('Registro deletado: idCarro=', OLD.idCarro, ', marcaCarro=', OLD.marcaCarro, ', modeloCarro=', OLD.modeloCarro, ', anoCarro=', OLD.anoCarro, ', validaCnh=', OLD.validaCnh, ', codigoEtiqueta=', OLD.codigoEtiqueta, ', validadeEtiqueta=', OLD.validadeEtiqueta, ', matriculaRel=', OLD.matriculaRel, '. Tabela carro'));
      END
    `);

    // Criação do evento para limpar registros antigos da tabela 'logs'
    await queryInterface.sequelize.query(`
      CREATE EVENT delete_old_logs
      ON SCHEDULE EVERY 1 DAY
      DO
        DELETE FROM logs WHERE dataoperacao < NOW() - INTERVAL 30 DAY;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Remoção dos triggers para a tabela 'aluno'
    await queryInterface.sequelize.query('DROP TRIGGER after_aluno_insert;');
    await queryInterface.sequelize.query('DROP TRIGGER after_aluno_update;');
    await queryInterface.sequelize.query('DROP TRIGGER after_aluno_delete;');

    // Remoção dos triggers para a tabela 'carro'
    await queryInterface.sequelize.query('DROP TRIGGER after_carro_insert;');
    await queryInterface.sequelize.query('DROP TRIGGER after_carro_update;');
    await queryInterface.sequelize.query('DROP TRIGGER after_carro_delete;');

    // Remoção do evento
    await queryInterface.sequelize.query('DROP EVENT delete_old_logs;');
  },
};
