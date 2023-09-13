-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: dbentrada
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `aluno`
--

DROP TABLE IF EXISTS `aluno`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aluno` (
  `matriculaAluno` bigint NOT NULL,
  `noAluno` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`matriculaAluno`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aluno`
--

LOCK TABLES `aluno` WRITE;
/*!40000 ALTER TABLE `aluno` DISABLE KEYS */;
INSERT INTO `aluno` VALUES (20221148060001,' Guilherme Cadete Costa');
/*!40000 ALTER TABLE `aluno` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carro`
--

DROP TABLE IF EXISTS `carro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carro` (
  `idCarro` int NOT NULL AUTO_INCREMENT,
  `marcaCarro` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `modeloCarro` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `anoCarro` int NOT NULL,
  `validaCnh` tinyint(1) NOT NULL,
  `codigoEtiqueta` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `matriculaRel` bigint NOT NULL,
  PRIMARY KEY (`idCarro`),
  KEY `fk_matricula` (`matriculaRel`),
  CONSTRAINT `fk_matricula` FOREIGN KEY (`matriculaRel`) REFERENCES `aluno` (`matriculaAluno`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carro`
--

LOCK TABLES `carro` WRITE;
/*!40000 ALTER TABLE `carro` DISABLE KEYS */;
INSERT INTO `carro` VALUES (10,'Fiat','Uno',2017,1,'123571ty',20221148060001);
/*!40000 ALTER TABLE `carro` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `login`
--

DROP TABLE IF EXISTS `login`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `login` (
  `idlogin` int NOT NULL AUTO_INCREMENT,
  `usuario` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `senha` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`idlogin`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login`
--

LOCK TABLES `login` WRITE;
/*!40000 ALTER TABLE `login` DISABLE KEYS */;
INSERT INTO `login` VALUES (2,'admin','$2b$10$ixtPdcq6iA59MoMaj1KTiuHzg7GCTtKTjP434HuJnrl3LFvkKQmG6');
/*!40000 ALTER TABLE `login` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `logs`
--

DROP TABLE IF EXISTS `logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `logs` (
  `idlogs` int NOT NULL AUTO_INCREMENT,
  `operacao` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `usuario` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `dataoperacao` datetime NOT NULL,
  `detalhe` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`idlogs`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logs`
--

LOCK TABLES `logs` WRITE;
/*!40000 ALTER TABLE `logs` DISABLE KEYS */;
INSERT INTO `logs` VALUES (4,'INSERT','root@localhost','2023-06-29 10:40:53','Registro inserido: matriculaAluno=20221148060001 noAluno=Guilherme Cadete Matias. Tabela aluno'),(5,'INSERT','root@localhost','2023-06-29 10:43:03','Registro inserido: idCarro=10, marcaCarro=Fiat, modeloCarro=Uno, anoCarro=2012, validaCnh=1, codigoEtiqueta=12563ty, matriculaRel=20221148060001. Tabela carro'),(6,'UPDATE','root@localhost','2023-06-29 10:44:36','Registro afetado: matriculaAluno=20221148060001 noAluno=Guilherme Cadete Matias-> matriculaAluno=20221148060001 noAluno= Guilherme Cadete Costa. Tabela aluno'),(7,'INSERT','root@localhost','2023-06-29 10:46:18','Registro inserido: matriculaAluno=20221148060015 noAluno=José Rbeiro. Tabela aluno'),(8,'INSERT','root@localhost','2023-06-29 10:46:18','Registro inserido: idCarro=11, marcaCarro=Chevrolet, modeloCarro=Montana, anoCarro=2021, validaCnh=1, codigoEtiqueta=536121, matriculaRel=20221148060015. Tabela carro'),(9,'DELETE','root@localhost','2023-07-12 15:14:22','Registro deletado: idCarro=11, marcaCarro=Chevrolet, modeloCarro=Montana, anoCarro=2021, validaCnh=1, codigoEtiqueta=536121, matriculaRel=20221148060015. Tabela carro'),(10,'DELETE','root@localhost','2023-07-12 15:14:22','Registro deletado: matriculaAluno=20221148060015 noAluno=José Rbeiro. Tabela aluno'),(11,'UPDATE','root@localhost','2023-07-12 15:15:00','Registro afetado: idCarro=10, marcaCarro=Fiat, modeloCarro=Uno, anoCarro=2012, validaCnh=1, codigoEtiqueta=12563ty, matriculaRel=20221148060001 -> idCarro=10, marcaCarro=Fiat, modeloCarro=Uno, anoCarro=2017, validaCnh=1, codigoEtiqueta=123571ty, matriculaRel=20221148060001. Tabela carro'),(12,'INSERT','root@localhost','2023-07-12 15:42:39','Registro inserido: matriculaAluno=20211148060014 noAluno=Alessandro Nunes Silva Cruz Filho. Tabela aluno');
/*!40000 ALTER TABLE `logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `vwalunocarro`
--

DROP TABLE IF EXISTS `vwalunocarro`;
/*!50001 DROP VIEW IF EXISTS `vwalunocarro`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vwalunocarro` AS SELECT 
 1 AS `Marca`,
 1 AS `Modelo`,
 1 AS `Ano`,
 1 AS `Aluno`,
 1 AS `Matricula`,
 1 AS `codigoEtiqueta`,
 1 AS `CNHvalida`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `vwalunocarro`
--

/*!50001 DROP VIEW IF EXISTS `vwalunocarro`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vwalunocarro` AS select `c`.`marcaCarro` AS `Marca`,`c`.`modeloCarro` AS `Modelo`,`c`.`anoCarro` AS `Ano`,`a`.`noAluno` AS `Aluno`,`a`.`matriculaAluno` AS `Matricula`,`c`.`codigoEtiqueta` AS `codigoEtiqueta`,`c`.`validaCnh` AS `CNHvalida` from (`carro` `c` join `aluno` `a` on((`a`.`matriculaAluno` = `c`.`matriculaRel`))) order by `a`.`matriculaAluno` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-07-12 15:47:36
