-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Tempo de geração: 24/05/2023 às 21:47
-- Versão do servidor: 10.4.28-MariaDB
-- Versão do PHP: 8.2.4

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
-- Estrutura para tabela `aluno`
--

CREATE TABLE `aluno` (
  `matriculaAluno` bigint(14) NOT NULL,
  `noAluno` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `carro`
--

CREATE TABLE `carro` (
  `idCarro` int(11) NOT NULL,
  `marcaCarro` varchar(50) NOT NULL,
  `modeloCarro` varchar(80) NOT NULL,
  `anoCarro` int(11) NOT NULL,
  `validaCnh` tinyint(1) NOT NULL,
  `codigoEtiqueta` varchar(50) NOT NULL,
  `matriculaRel` bigint(14) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura stand-in para view `vwalunocarro`
-- (Veja abaixo para a visão atual)
--
CREATE TABLE `vwalunocarro` (
`Marca` varchar(50)
,`Modelo` varchar(80)
,`Ano` int(11)
,`Aluno` varchar(100)
,`Matricula` bigint(14)
,`codigoEtiqueta` varchar(50)
,`CNHvalida` tinyint(1)
);

-- --------------------------------------------------------

--
-- Estrutura para view `vwalunocarro`
--
DROP TABLE IF EXISTS `vwalunocarro`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vwalunocarro`  AS SELECT `c`.`marcaCarro` AS `Marca`, `c`.`modeloCarro` AS `Modelo`, `c`.`anoCarro` AS `Ano`, `a`.`noAluno` AS `Aluno`, `a`.`matriculaAluno` AS `Matricula`, `c`.`codigoEtiqueta` AS `codigoEtiqueta`, `c`.`validaCnh` AS `CNHvalida` FROM (`carro` `c` join `aluno` `a` on(`a`.`matriculaAluno` = `c`.`matriculaRel`)) ORDER BY `a`.`matriculaAluno` ASC ;

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
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `carro`
--
ALTER TABLE `carro`
  MODIFY `idCarro` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `carro`
--
ALTER TABLE `carro`
  ADD CONSTRAINT `fk_matricula` FOREIGN KEY (`matriculaRel`) REFERENCES `aluno` (`matriculaAluno`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
