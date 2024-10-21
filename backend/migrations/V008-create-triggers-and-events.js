'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Criação do trigger para a tabela 'pessoa'
    await queryInterface.sequelize.query(`
      CREATE TRIGGER after_pessoa_insert 
      AFTER INSERT ON pessoa
      FOR EACH ROW
      BEGIN
        INSERT INTO logs (operacao, usuario, dataoperacao, detalhe)
        VALUES (
            'INSERT', 
            'root@localhost', 
            NOW(), 
            CONCAT('Registro inserido: idPessoa=', NEW.idPessoa, ', nomePessoa=', NEW.nomePessoa, ', tipoId=', NEW.tipoId, ', vinculo=', NEW.vinculo, '. Tabela pessoa')
        );
      END;
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER after_pessoa_update 
      AFTER UPDATE ON pessoa
      FOR EACH ROW
      BEGIN
        INSERT INTO logs (operacao, usuario, dataoperacao, detalhe)
        VALUES (
            'UPDATE', 
            'root@localhost', 
            NOW(), 
            CONCAT('Registro afetado: idPessoa=', OLD.idPessoa, ', nomePessoa=', OLD.nomePessoa, ', tipoId=', OLD.tipoId, ', vinculo=', OLD.vinculo, ' -> idPessoa=', NEW.idPessoa, ', nome=', NEW.nome, ', tipoId=', NEW.tipoId, ', vinculo=', NEW.vinculo, '. Tabela pessoa')
        );
      END;
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER after_pessoa_delete 
      AFTER DELETE ON pessoa
      FOR EACH ROW
      BEGIN
        INSERT INTO logs (operacao, usuario, dataoperacao, detalhe)
        VALUES (
            'DELETE', 
            'root@localhost', 
            NOW(), 
            CONCAT('Registro deletado: idPessoa=', OLD.idPessoa, ', nomePessoa=', OLD.nomePessoa, ', tipoId=', OLD.tipoId, ', vinculo=', OLD.vinculo, '. Tabela pessoa')
        );
      END;
    `);

    // Criação do trigger para a tabela 'carro'
    await queryInterface.sequelize.query(`
      CREATE TRIGGER after_carro_insert 
      AFTER INSERT ON carro
      FOR EACH ROW
      BEGIN
        INSERT INTO logs (operacao, usuario, dataoperacao, detalhe)
        VALUES (
            'INSERT', 
            'root@localhost', 
            NOW(), 
            CONCAT('Registro inserido: idCarro=', NEW.idCarro, ', marcaCarro=', NEW.marcaCarro, ', modeloCarro=', NEW.modeloCarro, ', anoCarro=', NEW.anoCarro, ', validaCnh=', NEW.validaCnh, ', codigoEtiqueta=', NEW.codigoEtiqueta, ', validadeEtiqueta=', NEW.validadeEtiqueta, ', idPessoaRel=', NEW.idPessoaRel, '. Tabela carro')
        );
      END;
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER after_carro_update 
      AFTER UPDATE ON carro
      FOR EACH ROW
      BEGIN
        INSERT INTO logs (operacao, usuario, dataoperacao, detalhe)
        VALUES (
            'UPDATE', 
            'root@localhost', 
            NOW(), 
            CONCAT('Registro afetado: idCarro=', OLD.idCarro, ', marcaCarro=', OLD.marcaCarro, ', modeloCarro=', OLD.modeloCarro, ', anoCarro=', OLD.anoCarro, ', validaCnh=', OLD.validaCnh, ', codigoEtiqueta=', OLD.codigoEtiqueta, ', validadeEtiqueta=', OLD.validadeEtiqueta, ', idPessoaRel=', OLD.idPessoaRel, ' -> idCarro=', NEW.idCarro, ', marcaCarro=', NEW.marcaCarro, ', modeloCarro=', NEW.modeloCarro, ', anoCarro=', NEW.anoCarro, ', validaCnh=', NEW.validaCnh, ', codigoEtiqueta=', NEW.codigoEtiqueta, ', validadeEtiqueta=', NEW.validadeEtiqueta, ', idPessoaRel=', NEW.idPessoaRel, '. Tabela carro')
        );
      END;
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER after_carro_delete 
      AFTER DELETE ON carro
      FOR EACH ROW
      BEGIN
        INSERT INTO logs (operacao, usuario, dataoperacao, detalhe)
        VALUES (
            'DELETE', 
            'root@localhost', 
            NOW(), 
            CONCAT('Registro deletado: idCarro=', OLD.idCarro, ', marcaCarro=', OLD.marcaCarro, ', modeloCarro=', OLD.modeloCarro, ', anoCarro=', OLD.anoCarro, ', validaCnh=', OLD.validaCnh, ', codigoEtiqueta=', OLD.codigoEtiqueta, ', validadeEtiqueta=', OLD.validadeEtiqueta, ', idPessoaRel=', OLD.idPessoaRel, '. Tabela carro')
        );
      END;
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
    // Remoção dos triggers para a tabela 'pessoa'
    await queryInterface.sequelize.query('DROP TRIGGER IF EXISTS after_pessoa_insert;');
    await queryInterface.sequelize.query('DROP TRIGGER IF EXISTS after_pessoa_update;');
    await queryInterface.sequelize.query('DROP TRIGGER IF EXISTS after_pessoa_delete;');

    // Remoção dos triggers para a tabela 'carro'
    await queryInterface.sequelize.query('DROP TRIGGER IF EXISTS after_carro_insert;');
    await queryInterface.sequelize.query('DROP TRIGGER IF EXISTS after_carro_update;');
    await queryInterface.sequelize.query('DROP TRIGGER IF EXISTS after_carro_delete;');

    // Remoção do evento
    await queryInterface.sequelize.query('DROP EVENT IF EXISTS delete_old_logs;');
  },
};
