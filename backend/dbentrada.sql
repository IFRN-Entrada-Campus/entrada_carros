-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: db:3306
-- Tempo de geração: 21/10/2024 às 12:37
-- Versão do servidor: 8.0.33
-- Versão do PHP: 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `dbentrada`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `carro`
--

CREATE TABLE `carro` (
  `idCarro` int NOT NULL,
  `idPessoaRel` bigint NOT NULL,
  `marcaCarro` varchar(50) NOT NULL,
  `modeloCarro` varchar(80) NOT NULL,
  `anoCarro` int NOT NULL,
  `validaCnh` tinyint(1) NOT NULL,
  `codigoEtiqueta` varchar(50) NOT NULL,
  `validadeEtiqueta` datetime NOT NULL,
  `placaCarro` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `historicoEntrada`
--

CREATE TABLE `historicoEntrada` (
  `idHistoricoEntrada` int NOT NULL,
  `placa` varchar(50) NOT NULL,
  `dataHora` datetime NOT NULL,
  `img` varchar(250) NOT NULL,
  `idCarroRel` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `login`
--

CREATE TABLE `login` (
  `idlogin` int NOT NULL,
  `usuario` varchar(150) NOT NULL,
  `senha` varchar(150) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `logs`
--

CREATE TABLE `logs` (
  `idlogs` int NOT NULL,
  `operacao` varchar(50) NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `dataoperacao` datetime NOT NULL,
  `detalhe` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `pessoa`
--

CREATE TABLE `pessoa` (
  `idPessoa` bigint NOT NULL,
  `tipoId` varchar(20) NOT NULL,
  `nomePessoa` varchar(100) NOT NULL,
  `vinculo` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Acionadores `pessoa`
--
DELIMITER $$
CREATE TRIGGER `after_pessoa_insert` AFTER INSERT ON `pessoa` FOR EACH ROW BEGIN
        INSERT INTO logs (operacao, usuario, dataoperacao, detalhe)
        VALUES (
            'INSERT', 
            'root@localhost', 
            NOW(), 
            CONCAT('Registro inserido: idPessoa=', NEW.idPessoa, ', nomePessoa=', NEW.nomePessoa, ', tipoId=', NEW.tipoId, ', vinculo=', NEW.vinculo, '. Tabela pessoa')
        );
      END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `SequelizeMeta`
--

CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura stand-in para view `vwHistoricoPessoa`
-- (Veja abaixo para a visão atual)
--
CREATE TABLE `vwHistoricoPessoa` (
`placa` varchar(50)
,`dataHora` datetime
,`img` varchar(250)
,`nome` varchar(100)
,`identificacao` bigint
);

-- --------------------------------------------------------

--
-- Estrutura stand-in para view `vwPessoaCarro`
-- (Veja abaixo para a visão atual)
--
CREATE TABLE `vwPessoaCarro` (
`Nome` varchar(100)
,`Identificacao` bigint
,`TipoID` varchar(20)
,`Vinculo` varchar(20)
,`Marca` varchar(50)
,`Modelo` varchar(80)
,`Ano` int
,`codigoEtiqueta` varchar(50)
,`CNHvalida` tinyint(1)
,`Placa` varchar(50)
,`validadeEtiqueta` datetime
);

-- --------------------------------------------------------

--
-- Estrutura para view `vwHistoricoPessoa`
--
DROP TABLE IF EXISTS `vwHistoricoPessoa`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `vwHistoricoPessoa`  AS SELECT `he`.`placa` AS `placa`, `he`.`dataHora` AS `dataHora`, `he`.`img` AS `img`, `a`.`nomePessoa` AS `nome`, `a`.`idPessoa` AS `identificacao` FROM ((`historicoEntrada` `he` join `carro` `c` on((`he`.`idCarroRel` = `c`.`idCarro`))) join `pessoa` `a` on((`c`.`idPessoaRel` = `a`.`idPessoa`))) ;

-- --------------------------------------------------------

--
-- Estrutura para view `vwPessoaCarro`
--
DROP TABLE IF EXISTS `vwPessoaCarro`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `vwPessoaCarro`  AS SELECT `a`.`nomePessoa` AS `Nome`, `a`.`idPessoa` AS `Identificacao`, `a`.`tipoId` AS `TipoID`, `a`.`vinculo` AS `Vinculo`, `c`.`marcaCarro` AS `Marca`, `c`.`modeloCarro` AS `Modelo`, `c`.`anoCarro` AS `Ano`, `c`.`codigoEtiqueta` AS `codigoEtiqueta`, `c`.`validaCnh` AS `CNHvalida`, `c`.`placaCarro` AS `Placa`, `c`.`validadeEtiqueta` AS `validadeEtiqueta` FROM (`carro` `c` join `pessoa` `a` on((`a`.`idPessoa` = `c`.`idPessoaRel`))) ;

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `carro`
--
ALTER TABLE `carro`
  ADD PRIMARY KEY (`idCarro`),
  ADD KEY `idPessoaRel` (`idPessoaRel`);

--
-- Índices de tabela `historicoEntrada`
--
ALTER TABLE `historicoEntrada`
  ADD PRIMARY KEY (`idHistoricoEntrada`),
  ADD KEY `idCarroRel` (`idCarroRel`);

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
-- Índices de tabela `pessoa`
--
ALTER TABLE `pessoa`
  ADD PRIMARY KEY (`idPessoa`);

--
-- Índices de tabela `SequelizeMeta`
--
ALTER TABLE `SequelizeMeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `carro`
--
ALTER TABLE `carro`
  MODIFY `idCarro` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `historicoEntrada`
--
ALTER TABLE `historicoEntrada`
  MODIFY `idHistoricoEntrada` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `login`
--
ALTER TABLE `login`
  MODIFY `idlogin` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `logs`
--
ALTER TABLE `logs`
  MODIFY `idlogs` int NOT NULL AUTO_INCREMENT;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `carro`
--
ALTER TABLE `carro`
  ADD CONSTRAINT `carro_ibfk_1` FOREIGN KEY (`idPessoaRel`) REFERENCES `pessoa` (`idPessoa`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `historicoEntrada`
--
ALTER TABLE `historicoEntrada`
  ADD CONSTRAINT `historicoEntrada_ibfk_1` FOREIGN KEY (`idCarroRel`) REFERENCES `carro` (`idCarro`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
