-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Tempo de geração: 26/06/2023 às 22:18
-- Versão do servidor: 8.0.33
-- Versão do PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;


CREATE DATABASE dbentrada;
USE dbentrada;
--
-- Banco de dados: `dbentrada`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `aluno`
--

CREATE TABLE `aluno` (
  `matriculaAluno` bigint NOT NULL,
  `noAluno` varchar(100) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Acionadores `aluno`
--
DELIMITER $$
CREATE TRIGGER `log_alunodelete` AFTER DELETE ON `aluno` FOR EACH ROW BEGIN
  INSERT INTO logs (operacao, usuario, dataoperacao, detalhe)
  VALUES ('DELETE', USER(), NOW(), CONCAT('Registro deletado:',' matriculaAluno=', OLD.matriculaAluno, ' noAluno=', OLD.noAluno, '. Tabela aluno'));
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `log_alunoinsert` AFTER INSERT ON `aluno` FOR EACH ROW BEGIN
  INSERT INTO logs (operacao, usuario, dataoperacao, detalhe)
  VALUES ('INSERT', USER(), NOW(), CONCAT('Registro inserido:', ' matriculaAluno=', NEW.matriculaAluno, ' noAluno=', NEW.noAluno, '. Tabela aluno'));
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `log_alunoupdate` AFTER UPDATE ON `aluno` FOR EACH ROW BEGIN
  INSERT INTO logs (operacao, usuario, dataoperacao, detalhe)
  VALUES ('UPDATE', USER(), NOW(), CONCAT('Registro afetado:', ' matriculaAluno=', OLD.matriculaAluno, ' noAluno=', OLD.noAluno, '->', ' matriculaAluno=', NEW.matriculaAluno, ' noAluno=', NEW.noAluno, '. Tabela aluno'));
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `carro`
--

CREATE TABLE `carro` (
  `idCarro` int NOT NULL,
  `marcaCarro` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `modeloCarro` varchar(80) COLLATE utf8mb4_general_ci NOT NULL,
  `anoCarro` int NOT NULL,
  `validaCnh` tinyint(1) NOT NULL,
  `codigoEtiqueta` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `matriculaRel` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Acionadores `carro`
--
DELIMITER $$
CREATE TRIGGER `log_carrodelete` AFTER DELETE ON `carro` FOR EACH ROW BEGIN
  INSERT INTO logs (operacao, usuario, dataoperacao, detalhe)
  VALUES ('DELETE', USER(), NOW(), CONCAT('Registro deletado: idCarro=', OLD.idCarro, ', marcaCarro=', OLD.marcaCarro, ', modeloCarro=', OLD.modeloCarro, ', anoCarro=', OLD.anoCarro, ', validaCnh=', OLD.validaCnh, ', codigoEtiqueta=', OLD.codigoEtiqueta, ', matriculaRel=', OLD.matriculaRel, '. Tabela carro'));
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `log_carroinsert` AFTER INSERT ON `carro` FOR EACH ROW INSERT INTO logs (operacao, usuario, dataoperacao, detalhe)
VALUES ('INSERT', USER(), NOW(), CONCAT('Registro inserido: idCarro=', NEW.idCarro, ', marcaCarro=', NEW.marcaCarro, ', modeloCarro=', NEW.modeloCarro, ', anoCarro=', NEW.anoCarro, ', validaCnh=', NEW.validaCnh, ', codigoEtiqueta=', NEW.codigoEtiqueta, ', matriculaRel=', NEW.matriculaRel, '. Tabela carro'));
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `log_carroupdate` AFTER UPDATE ON `carro` FOR EACH ROW INSERT INTO logs (operacao, usuario, dataoperacao, detalhe)
VALUES ('UPDATE', USER(), NOW(), CONCAT('Registro afetado: idCarro=', OLD.idCarro, ', marcaCarro=', OLD.marcaCarro, ', modeloCarro=', OLD.modeloCarro, ', anoCarro=', OLD.anoCarro, ', validaCnh=', OLD.validaCnh, ', codigoEtiqueta=', OLD.codigoEtiqueta, ', matriculaRel=', OLD.matriculaRel, ' -> idCarro=', NEW.idCarro, ', marcaCarro=', NEW.marcaCarro, ', modeloCarro=', NEW.modeloCarro, ', anoCarro=', NEW.anoCarro, ', validaCnh=', NEW.validaCnh, ', codigoEtiqueta=', NEW.codigoEtiqueta, ', matriculaRel=', NEW.matriculaRel, '. Tabela carro'));
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `login`
--

CREATE TABLE `login` (
  `idlogin` int NOT NULL,
  `usuario` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `senha` varchar(150) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `logs`
--

CREATE TABLE `logs` (
  `idlogs` int NOT NULL,
  `operacao` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `usuario` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `dataoperacao` datetime NOT NULL,
  `detalhe` text COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura stand-in para view `vwalunocarro`
-- (Veja abaixo para a visão atual)
--
CREATE TABLE `vwalunocarro` (
`Marca` varchar(50)
,`Modelo` varchar(80)
,`Ano` int
,`Aluno` varchar(100)
,`Matricula` bigint
,`codigoEtiqueta` varchar(50)
,`CNHvalida` tinyint(1)
);

-- --------------------------------------------------------

--
-- Estrutura para view `vwalunocarro`
--
DROP TABLE IF EXISTS `vwalunocarro`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vwalunocarro`  AS SELECT `c`.`marcaCarro` AS `Marca`, `c`.`modeloCarro` AS `Modelo`, `c`.`anoCarro` AS `Ano`, `a`.`noAluno` AS `Aluno`, `a`.`matriculaAluno` AS `Matricula`, `c`.`codigoEtiqueta` AS `codigoEtiqueta`, `c`.`validaCnh` AS `CNHvalida` FROM (`carro` `c` join `aluno` `a` on((`a`.`matriculaAluno` = `c`.`matriculaRel`))) ORDER BY `a`.`matriculaAluno` ASC ;

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `aluno`
--
ALTER TABLE `aluno`
  ADD PRIMARY KEY (`matriculaAluno`);

--
-- Índices de tabela `carro`
--
ALTER TABLE `carro`
  ADD PRIMARY KEY (`idCarro`),
  ADD KEY `fk_matricula` (`matriculaRel`);

--
-- Índices de tabela `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`idlogin`);

--
-- Índices de tabela `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`idlogs`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `carro`
--
ALTER TABLE `carro`
  MODIFY `idCarro` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de tabela `login`
--
ALTER TABLE `login`
  MODIFY `idlogin` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `logs`
--
ALTER TABLE `logs`
  MODIFY `idlogs` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `carro`
--
ALTER TABLE `carro`
  ADD CONSTRAINT `fk_matricula` FOREIGN KEY (`matriculaRel`) REFERENCES `aluno` (`matriculaAluno`);

DELIMITER $$
--
-- Eventos
--
CREATE DEFINER=`root`@`localhost` EVENT `event_deleta_logs` ON SCHEDULE EVERY 1 DAY STARTS CURRENT_TIMESTAMP() ON COMPLETION NOT PRESERVE ENABLE DO DELETE FROM logs WHERE dataoperacao < NOW() - INTERVAL 40 DAY$$

DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
