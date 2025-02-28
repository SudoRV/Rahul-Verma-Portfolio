/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.8.0-MariaDB, for Android (aarch64)
--
-- Host: localhost    Database: rahulPortfolio
-- ------------------------------------------------------
-- Server version	11.8.0-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comments` (
  `indexes` int(11) DEFAULT NULL,
  `username` varchar(100) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `time` varchar(255) DEFAULT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `likes` varchar(255) DEFAULT NULL,
  `replies` varchar(255) DEFAULT NULL,
  `parent` varchar(255) DEFAULT NULL,
  `relatedIndexes` varchar(255) DEFAULT NULL,
  `projectId` varchar(12) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `comments` VALUES
(1,'@rahul118verma','Rahul Verma ','1709751501723','dfswegftdeg','1','2','NULL',NULL,'8c1b5070ec09'),
(2,'@rahul118verma','Rahul Verma ','1709751514994','hey','1','0','@rahul118verma','1','8c1b5070ec09'),
(3,'@rahul118verma','Rahul Verma ','1709751551530','dasda','0','0','@rahul118verma','1','8c1b5070ec09'),
(4,'@rahul118verma','Rahul Verma ','1709752458903','hi','0','0','NULL',NULL,'8c1b5070ec09'),
(5,'@khushi@123gmail.com','vipin','1709786901442','hey dude','0','0','NULL',NULL,'8c1b5070ec09'),
(6,'@admin ','rahul1992verma','1740554665428','Hello','0','1','NULL',NULL,'8c1b5070ec09'),
(7,'@admin ','rahul1992verma','1740554695911','Hey','0','0','@admin ','6','8c1b5070ec09');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `likes` (
  `srno` int(11) DEFAULT NULL,
  `indexes` int(11) DEFAULT NULL,
  `likedBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `likes` VALUES
(1,1,'@rahul118verma'),
(2,2,'@rahul118verma');
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `loginData`
--

DROP TABLE IF EXISTS `loginData`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `loginData` (
  `sno` char(100) DEFAULT NULL,
  `name` varchar(40) DEFAULT NULL,
  `username` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loginData`
--

LOCK TABLES `loginData` WRITE;
/*!40000 ALTER TABLE `loginData` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `loginData` VALUES
('1','Rahul Verma ','@rahul123','rahulverma.1.2005@gmail.com','rahul'),
('2','Rahul Verma ','@rahul118verma','rahulverma.1.2005@gmail.com','rahul12'),
('3','vipin','@khushi@123gmail.com','sarthakbisht331@gmail.com','sccsacsavc'),
('4','rahul1992verma','@admin ','rahulverma.1.2005@gmail.com','txyd6c7');
/*!40000 ALTER TABLE `loginData` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `newsletter`
--

DROP TABLE IF EXISTS `newsletter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `newsletter` (
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `time` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `newsletter`
--

LOCK TABLES `newsletter` WRITE;
/*!40000 ALTER TABLE `newsletter` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `newsletter` VALUES
('','','1740668765487'),
('','','1740668768340');
/*!40000 ALTER TABLE `newsletter` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `projectmedia`
--

DROP TABLE IF EXISTS `projectmedia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `projectmedia` (
  `pid` varchar(12) DEFAULT NULL,
  `mediaurl` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projectmedia`
--

LOCK TABLES `projectmedia` WRITE;
/*!40000 ALTER TABLE `projectmedia` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `projectmedia` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `projects` (
  `pid` varchar(12) NOT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `views` int(11) DEFAULT NULL,
  `time` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  PRIMARY KEY (`pid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `projects` VALUES
('42fac635bc4b','','robo Maa','In Progress',0,'1740205647871','\n    Introducing our innovative Auto-Cooking Machine, a cutting-edge kitchen appliance designed to revolutionize your cooking experience. This intelligent device seamlessly combines state-of-the-art technology with user-friendly functionality, automating various cooking processes to make meal preparation a breeze.\n\nThe Auto-Cooking Machine features a sleek and compact design, fitting seamlessly into any modern kitchen. With its intuitive interface, users can easily select from a diverse range of recipes and cooking modes. The machine\'s advanced sensors and precision controls ensure precise temperature and timing, guaranteeing consistently delicious results every time.\n\nFrom quick and easy weeknight dinners to elaborate gourmet dishes, our Auto-Cooking Machine adapts to your culinary needs. Simply load the ingredients, choose your preferred settings, and let the machine handle the rest. Whether you\'re a novice cook or a seasoned chef, this appliance takes the guesswork out of cooking, allowing you to enjoy restaurant-quality meals in the comfort of your home.\n\nSay goodbye to time-consuming meal preparations and hello to a smarter way of cooking. With the Auto-Cooking Machine, we\'re redefining convenience in the kitchen, empowering you to create culinary masterpieces effortlessly. Elevate your cooking game with technology that works for you.\n    '),
('8c1b5070ec09','','robo Maa','In Progress',0,'1708689414447','\n    Introducing our innovative Auto-Cooking Machine, a cutting-edge kitchen appliance designed to revolutionize your cooking experience. This intelligent device seamlessly combines state-of-the-art technology with user-friendly functionality, automating various cooking processes to make meal preparation a breeze.\n\nThe Auto-Cooking Machine features a sleek and compact design, fitting seamlessly into any modern kitchen. With its intuitive interface, users can easily select from a diverse range of recipes and cooking modes. The machine\'s advanced sensors and precision controls ensure precise temperature and timing, guaranteeing consistently delicious results every time.\n\nFrom quick and easy weeknight dinners to elaborate gourmet dishes, our Auto-Cooking Machine adapts to your culinary needs. Simply load the ingredients, choose your preferred settings, and let the machine handle the rest. Whether you\'re a novice cook or a seasoned chef, this appliance takes the guesswork out of cooking, allowing you to enjoy restaurant-quality meals in the comfort of your home.\n\nSay goodbye to time-consuming meal preparations and hello to a smarter way of cooking. With the Auto-Cooking Machine, we\'re redefining convenience in the kitchen, empowering you to create culinary masterpieces effortlessly. Elevate your cooking game with technology that works for you.\n    '),
('95162746d3b1','','robo Maa','In Progress',0,'1708689396152','\n    Introducing our innovative Auto-Cooking Machine, a cutting-edge kitchen appliance designed to revolutionize your cooking experience. This intelligent device seamlessly combines state-of-the-art technology with user-friendly functionality, automating various cooking processes to make meal preparation a breeze.\n\nThe Auto-Cooking Machine features a sleek and compact design, fitting seamlessly into any modern kitchen. With its intuitive interface, users can easily select from a diverse range of recipes and cooking modes. The machine\'s advanced sensors and precision controls ensure precise temperature and timing, guaranteeing consistently delicious results every time.\n\nFrom quick and easy weeknight dinners to elaborate gourmet dishes, our Auto-Cooking Machine adapts to your culinary needs. Simply load the ingredients, choose your preferred settings, and let the machine handle the rest. Whether you\'re a novice cook or a seasoned chef, this appliance takes the guesswork out of cooking, allowing you to enjoy restaurant-quality meals in the comfort of your home.\n\nSay goodbye to time-consuming meal preparations and hello to a smarter way of cooking. With the Auto-Cooking Machine, we\'re redefining convenience in the kitchen, empowering you to create culinary masterpieces effortlessly. Elevate your cooking game with technology that works for you.\n    '),
('cc77c5914a9c','','robo Maa','In Progress',0,'1708689417114','\n    Introducing our innovative Auto-Cooking Machine, a cutting-edge kitchen appliance designed to revolutionize your cooking experience. This intelligent device seamlessly combines state-of-the-art technology with user-friendly functionality, automating various cooking processes to make meal preparation a breeze.\n\nThe Auto-Cooking Machine features a sleek and compact design, fitting seamlessly into any modern kitchen. With its intuitive interface, users can easily select from a diverse range of recipes and cooking modes. The machine\'s advanced sensors and precision controls ensure precise temperature and timing, guaranteeing consistently delicious results every time.\n\nFrom quick and easy weeknight dinners to elaborate gourmet dishes, our Auto-Cooking Machine adapts to your culinary needs. Simply load the ingredients, choose your preferred settings, and let the machine handle the rest. Whether you\'re a novice cook or a seasoned chef, this appliance takes the guesswork out of cooking, allowing you to enjoy restaurant-quality meals in the comfort of your home.\n\nSay goodbye to time-consuming meal preparations and hello to a smarter way of cooking. With the Auto-Cooking Machine, we\'re redefining convenience in the kitchen, empowering you to create culinary masterpieces effortlessly. Elevate your cooking game with technology that works for you.\n    ');
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;
commit;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2025-02-28 13:19:08
