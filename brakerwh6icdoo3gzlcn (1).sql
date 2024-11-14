-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: brakerwh6icdoo3gzlcn-mysql.services.clever-cloud.com:3306
-- Tiempo de generación: 14-11-2024 a las 18:52:30
-- Versión del servidor: 8.0.22-13
-- Versión de PHP: 8.2.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `brakerwh6icdoo3gzlcn`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `agenda`
--

CREATE TABLE `agenda` (
  `agendaid` int NOT NULL,
  `persona_id` int NOT NULL,
  `sucursal_id` int NOT NULL,
  `ttipoid` int NOT NULL,
  `nombreagenda` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `duracion` int NOT NULL,
  `medico_id` int NOT NULL,
  `estado` tinyint NOT NULL DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updateAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `agenda`
--

INSERT INTO `agenda` (`agendaid`, `persona_id`, `sucursal_id`, `ttipoid`, `nombreagenda`, `duracion`, `medico_id`, `estado`, `createdAt`, `updateAt`) VALUES
(46, 20, 1, 2, 'Agenda Jose Marco', 45, 4, 1, '2024-11-14 13:11:06', '2024-11-14 13:11:06'),
(47, 20, 2, 2, 'Agenda Jose Marco', 15, 4, 1, '2024-11-14 14:13:01', '2024-11-14 14:13:01'),
(48, 26, 1, 2, 'Agenda sofia saens', 30, 8, 1, '2024-11-14 15:15:53', '2024-11-14 15:15:53');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `calendar`
--

CREATE TABLE `calendar` (
  `calendarid` int NOT NULL,
  `agendaid` int NOT NULL,
  `fechaturno` date NOT NULL,
  `inicioturno` time NOT NULL,
  `finalturno` time NOT NULL,
  `estado` tinyint NOT NULL,
  `createdAt` datetime NOT NULL,
  `updateAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `calendar`
--

INSERT INTO `calendar` (`calendarid`, `agendaid`, `fechaturno`, `inicioturno`, `finalturno`, `estado`, `createdAt`, `updateAt`) VALUES
(281, 46, '2024-11-14', '10:00:00', '10:45:00', 1, '2024-11-14 13:11:43', '2024-11-14 13:11:43'),
(282, 46, '2024-11-14', '10:45:00', '11:30:00', 1, '2024-11-14 13:11:44', '2024-11-14 13:11:44'),
(283, 46, '2024-11-14', '11:30:00', '12:15:00', 1, '2024-11-14 13:11:44', '2024-11-14 13:11:44'),
(284, 46, '2024-11-14', '12:15:00', '13:00:00', 1, '2024-11-14 13:11:44', '2024-11-14 13:11:44'),
(285, 46, '2024-11-14', '13:00:00', '13:45:00', 1, '2024-11-14 13:11:45', '2024-11-14 13:11:45'),
(286, 46, '2024-11-14', '13:45:00', '14:30:00', 1, '2024-11-14 13:11:45', '2024-11-14 13:11:45'),
(287, 46, '2024-11-14', '14:30:00', '15:15:00', 1, '2024-11-14 13:11:45', '2024-11-14 13:11:45'),
(288, 46, '2024-11-15', '10:00:00', '10:45:00', 1, '2024-11-14 13:11:45', '2024-11-14 13:11:45'),
(289, 46, '2024-11-15', '10:45:00', '11:30:00', 1, '2024-11-14 13:11:46', '2024-11-14 13:11:46'),
(290, 46, '2024-11-15', '11:30:00', '12:15:00', 1, '2024-11-14 13:11:46', '2024-11-14 13:11:46'),
(291, 46, '2024-11-15', '12:15:00', '13:00:00', 1, '2024-11-14 13:11:46', '2024-11-14 13:11:46'),
(292, 46, '2024-11-15', '13:00:00', '13:45:00', 1, '2024-11-14 13:11:46', '2024-11-14 13:11:46'),
(293, 46, '2024-11-15', '13:45:00', '14:30:00', 1, '2024-11-14 13:11:47', '2024-11-14 13:11:47'),
(294, 46, '2024-11-15', '14:30:00', '15:15:00', 1, '2024-11-14 13:11:47', '2024-11-14 13:11:47'),
(295, 46, '2024-11-18', '10:00:00', '10:45:00', 1, '2024-11-14 13:11:47', '2024-11-14 13:11:47'),
(296, 46, '2024-11-18', '10:45:00', '11:30:00', 1, '2024-11-14 13:11:48', '2024-11-14 13:11:48'),
(297, 46, '2024-11-18', '11:30:00', '12:15:00', 1, '2024-11-14 13:11:48', '2024-11-14 13:11:48'),
(298, 46, '2024-11-18', '12:15:00', '13:00:00', 1, '2024-11-14 13:11:48', '2024-11-14 13:11:48'),
(299, 46, '2024-11-18', '13:00:00', '13:45:00', 1, '2024-11-14 13:11:48', '2024-11-14 13:11:48'),
(300, 46, '2024-11-18', '13:45:00', '14:30:00', 1, '2024-11-14 13:11:49', '2024-11-14 13:11:49'),
(301, 46, '2024-11-18', '14:30:00', '15:15:00', 1, '2024-11-14 13:11:49', '2024-11-14 13:11:49'),
(302, 46, '2024-11-19', '10:00:00', '10:45:00', 1, '2024-11-14 13:11:49', '2024-11-14 13:11:49'),
(303, 46, '2024-11-19', '10:45:00', '11:30:00', 1, '2024-11-14 13:11:50', '2024-11-14 13:11:50'),
(304, 46, '2024-11-19', '11:30:00', '12:15:00', 1, '2024-11-14 13:11:50', '2024-11-14 13:11:50'),
(305, 46, '2024-11-19', '12:15:00', '13:00:00', 1, '2024-11-14 13:11:50', '2024-11-14 13:11:50'),
(306, 46, '2024-11-19', '13:00:00', '13:45:00', 1, '2024-11-14 13:11:51', '2024-11-14 13:11:51'),
(307, 46, '2024-11-19', '13:45:00', '14:30:00', 1, '2024-11-14 13:11:51', '2024-11-14 13:11:51'),
(308, 46, '2024-11-19', '14:30:00', '15:15:00', 1, '2024-11-14 13:11:51', '2024-11-14 13:11:51'),
(309, 46, '2024-11-20', '10:00:00', '10:45:00', 1, '2024-11-14 13:11:51', '2024-11-14 13:11:51'),
(310, 46, '2024-11-20', '10:45:00', '11:30:00', 1, '2024-11-14 13:11:52', '2024-11-14 13:11:52'),
(311, 46, '2024-11-20', '11:30:00', '12:15:00', 1, '2024-11-14 13:11:52', '2024-11-14 13:11:52'),
(312, 46, '2024-11-20', '12:15:00', '13:00:00', 1, '2024-11-14 13:11:52', '2024-11-14 13:11:52'),
(313, 46, '2024-11-20', '13:00:00', '13:45:00', 1, '2024-11-14 13:11:52', '2024-11-14 13:11:52'),
(314, 46, '2024-11-20', '13:45:00', '14:30:00', 1, '2024-11-14 13:11:53', '2024-11-14 13:11:53'),
(315, 46, '2024-11-20', '14:30:00', '15:15:00', 1, '2024-11-14 13:11:53', '2024-11-14 13:11:53'),
(316, 46, '2024-11-21', '10:00:00', '10:45:00', 1, '2024-11-14 13:11:53', '2024-11-14 13:11:53'),
(317, 46, '2024-11-21', '10:45:00', '11:30:00', 1, '2024-11-14 13:11:53', '2024-11-14 13:11:53'),
(318, 46, '2024-11-21', '11:30:00', '12:15:00', 1, '2024-11-14 13:11:54', '2024-11-14 13:11:54'),
(319, 46, '2024-11-21', '12:15:00', '13:00:00', 1, '2024-11-14 13:11:54', '2024-11-14 13:11:54'),
(320, 46, '2024-11-21', '13:00:00', '13:45:00', 1, '2024-11-14 13:11:54', '2024-11-14 13:11:54'),
(321, 46, '2024-11-21', '13:45:00', '14:30:00', 1, '2024-11-14 13:11:54', '2024-11-14 13:11:54'),
(322, 46, '2024-11-21', '14:30:00', '15:15:00', 1, '2024-11-14 13:11:55', '2024-11-14 13:11:55'),
(323, 46, '2024-11-22', '10:00:00', '10:45:00', 1, '2024-11-14 13:11:55', '2024-11-14 13:11:55'),
(324, 46, '2024-11-22', '10:45:00', '11:30:00', 1, '2024-11-14 13:11:55', '2024-11-14 13:11:55'),
(325, 46, '2024-11-22', '11:30:00', '12:15:00', 1, '2024-11-14 13:11:56', '2024-11-14 13:11:56'),
(326, 46, '2024-11-22', '12:15:00', '13:00:00', 1, '2024-11-14 13:11:56', '2024-11-14 13:11:56'),
(327, 46, '2024-11-22', '13:00:00', '13:45:00', 1, '2024-11-14 13:11:56', '2024-11-14 13:11:56'),
(328, 46, '2024-11-22', '13:45:00', '14:30:00', 1, '2024-11-14 13:11:56', '2024-11-14 13:11:56'),
(329, 46, '2024-11-22', '14:30:00', '15:15:00', 1, '2024-11-14 13:11:57', '2024-11-14 13:11:57'),
(330, 46, '2024-11-25', '10:00:00', '10:45:00', 1, '2024-11-14 13:11:57', '2024-11-14 13:11:57'),
(331, 46, '2024-11-25', '10:45:00', '11:30:00', 1, '2024-11-14 13:11:57', '2024-11-14 13:11:57'),
(332, 46, '2024-11-25', '11:30:00', '12:15:00', 1, '2024-11-14 13:11:57', '2024-11-14 13:11:57'),
(333, 46, '2024-11-25', '12:15:00', '13:00:00', 1, '2024-11-14 13:11:58', '2024-11-14 13:11:58'),
(334, 46, '2024-11-25', '13:00:00', '13:45:00', 1, '2024-11-14 13:11:58', '2024-11-14 13:11:58'),
(335, 46, '2024-11-25', '13:45:00', '14:30:00', 1, '2024-11-14 13:11:58', '2024-11-14 13:11:58'),
(336, 46, '2024-11-25', '14:30:00', '15:15:00', 1, '2024-11-14 13:11:59', '2024-11-14 13:11:59'),
(337, 46, '2024-11-26', '10:00:00', '10:45:00', 1, '2024-11-14 13:11:59', '2024-11-14 13:11:59'),
(338, 46, '2024-11-26', '10:45:00', '11:30:00', 1, '2024-11-14 13:11:59', '2024-11-14 13:11:59'),
(339, 46, '2024-11-26', '11:30:00', '12:15:00', 1, '2024-11-14 13:11:59', '2024-11-14 13:11:59'),
(340, 46, '2024-11-26', '12:15:00', '13:00:00', 1, '2024-11-14 13:12:00', '2024-11-14 13:12:00'),
(341, 46, '2024-11-26', '13:00:00', '13:45:00', 1, '2024-11-14 13:12:00', '2024-11-14 13:12:00'),
(342, 46, '2024-11-26', '13:45:00', '14:30:00', 1, '2024-11-14 13:12:00', '2024-11-14 13:12:00'),
(343, 46, '2024-11-26', '14:30:00', '15:15:00', 1, '2024-11-14 13:12:01', '2024-11-14 13:12:01'),
(344, 46, '2024-11-27', '10:00:00', '10:45:00', 1, '2024-11-14 13:12:01', '2024-11-14 13:12:01'),
(345, 46, '2024-11-27', '10:45:00', '11:30:00', 1, '2024-11-14 13:12:01', '2024-11-14 13:12:01'),
(346, 46, '2024-11-27', '11:30:00', '12:15:00', 1, '2024-11-14 13:12:01', '2024-11-14 13:12:01'),
(347, 46, '2024-11-27', '12:15:00', '13:00:00', 1, '2024-11-14 13:12:02', '2024-11-14 13:12:02'),
(348, 46, '2024-11-27', '13:00:00', '13:45:00', 1, '2024-11-14 13:12:02', '2024-11-14 13:12:02'),
(349, 46, '2024-11-27', '13:45:00', '14:30:00', 1, '2024-11-14 13:12:02', '2024-11-14 13:12:02'),
(350, 46, '2024-11-27', '14:30:00', '15:15:00', 1, '2024-11-14 13:12:03', '2024-11-14 13:12:03'),
(351, 46, '2024-11-28', '10:00:00', '10:45:00', 1, '2024-11-14 13:12:03', '2024-11-14 13:12:03'),
(352, 46, '2024-11-28', '10:45:00', '11:30:00', 1, '2024-11-14 13:12:03', '2024-11-14 13:12:03'),
(353, 46, '2024-11-28', '11:30:00', '12:15:00', 1, '2024-11-14 13:12:03', '2024-11-14 13:12:03'),
(354, 46, '2024-11-28', '12:15:00', '13:00:00', 1, '2024-11-14 13:12:04', '2024-11-14 13:12:04'),
(355, 46, '2024-11-28', '13:00:00', '13:45:00', 1, '2024-11-14 13:12:04', '2024-11-14 13:12:04'),
(356, 46, '2024-11-28', '13:45:00', '14:30:00', 1, '2024-11-14 13:12:04', '2024-11-14 13:12:04'),
(357, 46, '2024-11-28', '14:30:00', '15:15:00', 1, '2024-11-14 13:12:04', '2024-11-14 13:12:04'),
(358, 48, '2024-11-21', '12:00:00', '12:30:00', 1, '2024-11-14 15:17:55', '2024-11-14 15:17:55'),
(359, 48, '2024-11-21', '12:30:00', '13:00:00', 1, '2024-11-14 15:17:56', '2024-11-14 15:17:56'),
(360, 48, '2024-11-21', '13:00:00', '13:30:00', 1, '2024-11-14 15:17:56', '2024-11-14 15:17:56'),
(361, 48, '2024-11-21', '13:30:00', '14:00:00', 1, '2024-11-14 15:17:56', '2024-11-14 15:17:56'),
(362, 48, '2024-11-21', '14:00:00', '14:30:00', 1, '2024-11-14 15:17:56', '2024-11-14 15:17:56'),
(363, 48, '2024-11-21', '14:30:00', '15:00:00', 1, '2024-11-14 15:17:56', '2024-11-14 15:17:56'),
(364, 48, '2024-11-21', '15:00:00', '15:30:00', 1, '2024-11-14 15:17:56', '2024-11-14 15:17:56'),
(365, 48, '2024-11-21', '15:30:00', '16:00:00', 1, '2024-11-14 15:17:56', '2024-11-14 15:17:56');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `especialidad`
--

CREATE TABLE `especialidad` (
  `especialidadId` int NOT NULL,
  `nombre_esp` varchar(250) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `estado` tinyint NOT NULL,
  `createdAt` datetime NOT NULL,
  `updateAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `especialidad`
--

INSERT INTO `especialidad` (`especialidadId`, `nombre_esp`, `estado`, `createdAt`, `updateAt`) VALUES
(21, 'medicina general', 1, '2024-11-12 21:23:48', '2024-11-13 19:35:45'),
(22, 'Pediatria', 1, '2024-11-12 21:23:59', '2024-11-12 21:23:59'),
(23, 'medico gerontólogo', 1, '2024-11-12 21:24:10', '2024-11-12 21:24:10'),
(24, 'diagnostico por imágenes', 1, '2024-11-13 18:39:32', '2024-11-13 19:35:46'),
(25, 'traumatologo', 1, '2024-11-14 15:04:08', '2024-11-14 15:04:08'),
(26, 'bioquimico', 1, '2024-11-14 15:04:17', '2024-11-14 15:04:17'),
(27, 'psiquiatria', 1, '2024-11-14 15:04:23', '2024-11-14 15:04:23');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado`
--

CREATE TABLE `estado` (
  `estadoid` int NOT NULL,
  `tipo` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updateAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estado`
--

INSERT INTO `estado` (`estadoid`, `tipo`, `createdAt`, `updateAt`) VALUES
(1, 'Disponible', '2024-11-12 22:07:35', '2024-11-12 22:07:35'),
(2, 'Reservado', '2024-11-12 22:07:35', '2024-11-12 22:07:35'),
(3, 'Cancelado', '2024-11-12 22:07:35', '2024-11-12 22:07:35'),
(4, 'Confirmado', '2024-11-12 22:07:35', '2024-11-12 22:07:35'),
(9, 'Atendido', '2024-11-12 22:08:40', '2024-11-12 22:08:40');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medicos`
--

CREATE TABLE `medicos` (
  `medicoid` int NOT NULL,
  `personaid` int NOT NULL,
  `especialidadId` int NOT NULL,
  `estado` tinyint NOT NULL,
  `createdAt` datetime NOT NULL,
  `updateAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `medicos`
--

INSERT INTO `medicos` (`medicoid`, `personaid`, `especialidadId`, `estado`, `createdAt`, `updateAt`) VALUES
(4, 20, 21, 1, '2024-11-12 22:41:37', '2024-11-12 22:41:37'),
(5, 23, 25, 1, '2024-11-14 15:06:30', '2024-11-14 15:06:30'),
(6, 24, 23, 1, '2024-11-14 15:07:42', '2024-11-14 15:07:42'),
(7, 25, 24, 1, '2024-11-14 15:12:26', '2024-11-14 15:12:26'),
(8, 26, 21, 1, '2024-11-14 15:14:27', '2024-11-14 15:14:27');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medico_esp`
--

CREATE TABLE `medico_esp` (
  `matricula` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `medicoid` int NOT NULL,
  `especialidadid` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updateAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `medico_esp`
--

INSERT INTO `medico_esp` (`matricula`, `medicoid`, `especialidadid`, `createdAt`, `updateAt`) VALUES
('SD234234', 4, 21, '2024-11-12 22:41:37', '2024-11-12 22:41:37'),
('jj234565123', 5, 25, '2024-11-14 15:06:30', '2024-11-14 15:06:30'),
('aa1234ertg', 6, 23, '2024-11-14 15:07:42', '2024-11-14 15:07:42'),
('jj234585wee', 7, 24, '2024-11-14 15:12:26', '2024-11-14 15:12:26'),
('jj234585xcde', 8, 21, '2024-11-14 15:14:27', '2024-11-14 15:14:27');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `obra_social`
--

CREATE TABLE `obra_social` (
  `id_obra_social` int NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `estado` tinyint NOT NULL,
  `createAt` datetime NOT NULL,
  `updateAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `obra_social`
--

INSERT INTO `obra_social` (`id_obra_social`, `nombre`, `estado`, `createAt`, `updateAt`) VALUES
(1, 'OSDE', 1, '2024-11-14 17:11:23', '0000-00-00 00:00:00'),
(2, 'SANCOR SALUD', 1, '2024-11-14 17:11:43', '0000-00-00 00:00:00'),
(3, 'PARTICULAR', 1, '2024-11-14 17:12:28', '0000-00-00 00:00:00'),
(4, 'DOSEP', 1, '2024-11-14 17:12:53', '0000-00-00 00:00:00'),
(6, 'Particular', 1, '2024-11-14 18:33:49', '2024-11-14 18:34:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `perfil`
--

CREATE TABLE `perfil` (
  `perfilid` int NOT NULL,
  `tipo` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `permisos` varchar(250) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `perfil`
--

INSERT INTO `perfil` (`perfilid`, `tipo`, `permisos`) VALUES
(1, 'admin', 'all'),
(2, 'medico', ''),
(3, 'secretaria', ''),
(4, 'paciente', 'turnos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `persona`
--

CREATE TABLE `persona` (
  `personaid` int NOT NULL,
  `userid` int DEFAULT NULL,
  `dni` int NOT NULL,
  `nombre` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `apellido` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `direccion` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `localidad` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `mail` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `foto_dni` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `foto_perfil` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updateAt` datetime NOT NULL,
  `obra_social` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `persona`
--

INSERT INTO `persona` (`personaid`, `userid`, `dni`, `nombre`, `apellido`, `direccion`, `localidad`, `telefono`, `mail`, `foto_dni`, `foto_perfil`, `createdAt`, `updateAt`, `obra_social`) VALUES
(17, 12, 55554262, 'mauro', 'benito', 'Colon 445 San luis', 'san luis', '458-7855423', 'admin', '/uploads/dni/1731269742655.jpg', '1731607586765.jpeg', '2024-11-10 20:15:45', '2024-11-14 18:06:26', NULL),
(18, 13, 11111111, 'Emanuel ', 'Sosa', 'a', 'a', '121-2121212', 'admin1', '/uploads/dni/1731274895772.avif', '1731274911906.HEIC', '2024-11-10 21:41:37', '2024-11-10 21:41:52', NULL),
(19, 15, 12345678, 'Raul', 'casa', 'casa 1', 'San Luis', '266-4123456', 'raul@gmail.com', NULL, NULL, '2024-11-12 22:38:31', '2024-11-12 22:38:31', NULL),
(20, 16, 12345670, 'Jose', 'Marco', 'casa 1', 'San Luis', '266-4123456', 'Jose@gmail.com', NULL, NULL, '2024-11-12 22:41:36', '2024-11-12 22:41:36', 4),
(23, 19, 28957451, 'ruben', 'jaurez', 'saavedra 545', 'juana koslay', '266-4857456', 'rubenj', NULL, NULL, '2024-11-14 15:06:30', '2024-11-14 15:06:30', NULL),
(24, 20, 31584565, 'ludmila', 'cavallo', 'casa 55 manzana 5558', 'juana koslay', '266-4874513', 'ludmis', NULL, NULL, '2024-11-14 15:07:42', '2024-11-14 15:07:42', NULL),
(25, 21, 14587546, 'jorge', 'panzudo', 'lavalle 587', 'san luis', '266-5496572', 'panzudo@gg.com', NULL, NULL, '2024-11-14 15:12:26', '2024-11-14 15:12:26', NULL),
(26, 22, 85454521, 'sofia', 'saens', 'saladivar 456', 'villa mercedes', '266-1457455', 'ss@gmail.com', NULL, NULL, '2024-11-14 15:14:27', '2024-11-14 15:14:27', NULL),
(27, 23, 32584567, 'pablo', 'perez', 'lafinor 214', 'san luis', '232-3232332', 'pablo@gmail.com', NULL, NULL, '2024-11-14 15:27:56', '2024-11-14 15:27:56', NULL),
(28, 24, 12475285, 'juan ', 'sale', 'sosa 4536', 'juana koslay', '266-5894756', 'sale@gmail.com', NULL, NULL, '2024-11-14 15:29:15', '2024-11-14 15:29:15', NULL),
(29, 25, 15845412, 'pedro', 'sosa', 'casa 2 manzana 1', 'san luis', '266-3454545', 'pp@sas.com', NULL, NULL, '2024-11-14 15:32:28', '2024-11-14 15:32:28', NULL),
(30, 26, 42587564, 'perla', 'sanchez', 'Colon 1024', 'villa mercedes', '266-5876545', 'perla@gmail.com', NULL, NULL, '2024-11-14 15:37:26', '2024-11-14 15:37:26', NULL),
(31, 27, 31874531, 'jazmin', 'perez', 'lavalle 2123', 'san luis', '266-4657454', 'jp@gmail.com', NULL, NULL, '2024-11-14 15:39:16', '2024-11-14 15:39:16', NULL),
(32, 28, 44360403, 'Federico', 'casa', 'Av italias 1121', 'San Luis', '233-3232323', 'fede@gmail.com', '1731606326501.png', NULL, '2024-11-14 17:45:27', '2024-11-14 17:45:27', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sucursal`
--

CREATE TABLE `sucursal` (
  `sucursalid` int NOT NULL,
  `nombre_sucrsal` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `direccion` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `estado` tinyint NOT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updateAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `sucursal`
--

INSERT INTO `sucursal` (`sucursalid`, `nombre_sucrsal`, `direccion`, `estado`, `telefono`, `email`, `createdAt`, `updateAt`) VALUES
(1, 'Sucursal Principal', 'Av. Principal 123', 1, NULL, NULL, '2024-11-12 22:09:48', '2024-11-12 22:09:48'),
(2, 'Clínica Central', 'Av. Principal 123', 1, '255-5555555', NULL, '2024-11-12 22:44:33', '2024-11-12 22:44:33');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipoatencion`
--

CREATE TABLE `tipoatencion` (
  `atencionid` int NOT NULL,
  `tipo` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `descripcion` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `observaciones` varchar(100) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tipoatencion`
--

INSERT INTO `tipoatencion` (`atencionid`, `tipo`, `descripcion`, `observaciones`) VALUES
(2, 'normal', 'agenda normal', ''),
(3, 'control', 'control medico', ''),
(4, 'estudios', 'tomografia, radiografia, resonancia', ''),
(5, 'internacion', 'paciente ingresa como huesped', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `turno`
--

CREATE TABLE `turno` (
  `turniid` int NOT NULL,
  `persona_id` int NOT NULL,
  `calendar_id` int NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `estadoturno_id` int NOT NULL,
  `observaciones` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `fecha_confirmacion` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `turno`
--

INSERT INTO `turno` (`turniid`, `persona_id`, `calendar_id`, `fecha`, `hora`, `estadoturno_id`, `observaciones`, `fecha_confirmacion`) VALUES
(1, 19, 3, '2024-11-12', '13:50:20', 2, '', '2024-11-13 02:41:11');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

CREATE TABLE `user` (
  `userid` int NOT NULL,
  `idperfil` int NOT NULL DEFAULT '4',
  `nombre_user` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `estado` tinyint NOT NULL,
  `createdAt` datetime NOT NULL,
  `updateAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `user`
--

INSERT INTO `user` (`userid`, `idperfil`, `nombre_user`, `password`, `estado`, `createdAt`, `updateAt`) VALUES
(12, 1, 'admin', '$2b$10$KM4HqtF0LpwZvfw46Xk//OVKoCEraUQ771aS5OAnVydPOItB.ZJBq', 1, '2024-11-10 20:15:44', '2024-11-10 20:15:44'),
(13, 4, 'admin1', '$2a$10$4qms2sfPR1.bgqsbsuLFIuoXL.pkrEth2Z7vQNTDyae9NuogDod9y', 1, '2024-11-10 21:41:36', '2024-11-13 18:48:45'),
(15, 4, 'raul@gmail.com', '$2a$10$49EVSURhpA.eUBvbmiUwgeQ5DuKLwoUkp2uBCl9jBZ8hm3A7mMLTi', 1, '2024-11-12 22:38:31', '2024-11-12 22:38:31'),
(16, 2, 'Jose@gmail.com', '$2a$10$vbVO0ysI.2uhz4veynEYLO0PeHt8YSz9g5vp08DTI0o2TRiYuweui', 1, '2024-11-12 22:41:36', '2024-11-12 22:41:36'),
(17, 3, 'mauro', '$2a$10$16P1gVbfZs6J3sTEEL4UqeoAzNLab86jZxFyc14Q0YhrBIXQhuwim', 1, '2024-11-13 22:44:24', '2024-11-13 22:44:24'),
(18, 4, 'paciente', '$2a$10$iqPe.FCUApxV1l12gkKxh.EGl7yRVw9vBcNeJfdZco1HZbkt8Su36', 1, '2024-11-13 22:45:16', '2024-11-13 22:45:16'),
(19, 2, 'rubenj', '$2a$10$IZunBdCZ1epioVY9oyQuUeHO9cmgZa6.CSOkeJJywp7hgMae1Jxn2', 1, '2024-11-14 15:06:30', '2024-11-14 15:06:30'),
(20, 2, 'ludmis', '$2a$10$RGzq5zOXL8q1kyPR/ZIYKu9DZ4yUsLo44o9Qv9dPDy65EjmWrouTO', 1, '2024-11-14 15:07:41', '2024-11-14 15:07:41'),
(21, 2, 'panzudo@gg.com', '$2a$10$Fc55X0wG7odweHCjqFjq..kYHnsEB9y0bXNSRkuwrQ85AycDgbAtm', 1, '2024-11-14 15:12:26', '2024-11-14 15:12:26'),
(22, 2, 'ss@gmail.com', '$2a$10$UkvHz0m7RtalKhodHFSBGeBP6JaefuwFit6MNyn5skee.VIOutgRG', 1, '2024-11-14 15:14:27', '2024-11-14 15:14:27'),
(23, 4, 'pablo@gmail.com', '$2a$10$srL.oLXmIG8PZ/0HwRI.tO2s4KCMzCNg9VnkCiOsQkj1akd6/uoKe', 1, '2024-11-14 15:27:55', '2024-11-14 15:27:55'),
(24, 4, 'sale@gmail.com', '$2a$10$sm5/gHmWr.CMNN366PA39ee6d75lvpYMdLks77Z11PR.6Imo43g4C', 1, '2024-11-14 15:29:15', '2024-11-14 15:29:15'),
(25, 4, 'pp@sas.com', '$2a$10$z.hB47WtUZtl5dOkaxyqtechHSoNav.28hLxTMuYEHIioUk9Yo0h6', 1, '2024-11-14 15:32:28', '2024-11-14 15:32:28'),
(26, 4, 'perla@gmail.com', '$2a$10$/KioNJdCnqAStx3FIxD1HefYme3cC2DJe.WWtykjDlN0ZSVgXJhFq', 1, '2024-11-14 15:37:26', '2024-11-14 15:37:26'),
(27, 3, 'jp@gmail.com', '$2a$10$uxKIQfuprJI.HHkv7RW7I.9QFdclivqH/fqF7e/Jas99iY9ux.i0e', 1, '2024-11-14 15:39:16', '2024-11-14 15:39:16'),
(28, 4, 'fede@gmail.com', '$2a$10$esJGaupKEtBDIQP62pcxUO.5fgoxsJzhkUHu.Yvcidf3tyH8I/VAq', 1, '2024-11-14 17:45:27', '2024-11-14 17:45:27');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `agenda`
--
ALTER TABLE `agenda`
  ADD PRIMARY KEY (`agendaid`),
  ADD KEY `persona_id` (`persona_id`),
  ADD KEY `medico_id` (`medico_id`),
  ADD KEY `sucursal_id` (`sucursal_id`),
  ADD KEY `ttipoid` (`ttipoid`);

--
-- Indices de la tabla `calendar`
--
ALTER TABLE `calendar`
  ADD PRIMARY KEY (`calendarid`),
  ADD KEY `agendaid` (`agendaid`);

--
-- Indices de la tabla `especialidad`
--
ALTER TABLE `especialidad`
  ADD PRIMARY KEY (`especialidadId`);

--
-- Indices de la tabla `estado`
--
ALTER TABLE `estado`
  ADD PRIMARY KEY (`estadoid`);

--
-- Indices de la tabla `medicos`
--
ALTER TABLE `medicos`
  ADD PRIMARY KEY (`medicoid`),
  ADD KEY `personaid` (`personaid`),
  ADD KEY `especialidadId` (`especialidadId`);

--
-- Indices de la tabla `medico_esp`
--
ALTER TABLE `medico_esp`
  ADD PRIMARY KEY (`medicoid`),
  ADD KEY `especialidadid` (`especialidadid`),
  ADD KEY `medicoid` (`medicoid`);

--
-- Indices de la tabla `obra_social`
--
ALTER TABLE `obra_social`
  ADD PRIMARY KEY (`id_obra_social`);

--
-- Indices de la tabla `perfil`
--
ALTER TABLE `perfil`
  ADD PRIMARY KEY (`perfilid`);

--
-- Indices de la tabla `persona`
--
ALTER TABLE `persona`
  ADD PRIMARY KEY (`personaid`),
  ADD UNIQUE KEY `dni_2` (`dni`),
  ADD KEY `persona_ibfk_1` (`userid`),
  ADD KEY `dni` (`dni`),
  ADD KEY `obra_social` (`obra_social`);

--
-- Indices de la tabla `sucursal`
--
ALTER TABLE `sucursal`
  ADD PRIMARY KEY (`sucursalid`);

--
-- Indices de la tabla `tipoatencion`
--
ALTER TABLE `tipoatencion`
  ADD PRIMARY KEY (`atencionid`);

--
-- Indices de la tabla `turno`
--
ALTER TABLE `turno`
  ADD PRIMARY KEY (`turniid`),
  ADD KEY `calendar-id` (`calendar_id`),
  ADD KEY `estadoturno_id` (`estadoturno_id`);

--
-- Indices de la tabla `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`userid`),
  ADD KEY `nombre_user` (`nombre_user`),
  ADD KEY `idperfil` (`idperfil`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `agenda`
--
ALTER TABLE `agenda`
  MODIFY `agendaid` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT de la tabla `calendar`
--
ALTER TABLE `calendar`
  MODIFY `calendarid` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=366;

--
-- AUTO_INCREMENT de la tabla `especialidad`
--
ALTER TABLE `especialidad`
  MODIFY `especialidadId` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT de la tabla `estado`
--
ALTER TABLE `estado`
  MODIFY `estadoid` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `medicos`
--
ALTER TABLE `medicos`
  MODIFY `medicoid` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `obra_social`
--
ALTER TABLE `obra_social`
  MODIFY `id_obra_social` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `perfil`
--
ALTER TABLE `perfil`
  MODIFY `perfilid` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `persona`
--
ALTER TABLE `persona`
  MODIFY `personaid` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT de la tabla `sucursal`
--
ALTER TABLE `sucursal`
  MODIFY `sucursalid` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `tipoatencion`
--
ALTER TABLE `tipoatencion`
  MODIFY `atencionid` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `turno`
--
ALTER TABLE `turno`
  MODIFY `turniid` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `user`
--
ALTER TABLE `user`
  MODIFY `userid` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `agenda`
--
ALTER TABLE `agenda`
  ADD CONSTRAINT `agenda_ibfk_1` FOREIGN KEY (`persona_id`) REFERENCES `persona` (`personaid`),
  ADD CONSTRAINT `agenda_ibfk_2` FOREIGN KEY (`medico_id`) REFERENCES `medicos` (`medicoid`),
  ADD CONSTRAINT `agenda_ibfk_3` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursal` (`sucursalid`),
  ADD CONSTRAINT `agenda_ibfk_4` FOREIGN KEY (`ttipoid`) REFERENCES `tipoatencion` (`atencionid`);

--
-- Filtros para la tabla `calendar`
--
ALTER TABLE `calendar`
  ADD CONSTRAINT `calendar_ibfk_1` FOREIGN KEY (`agendaid`) REFERENCES `agenda` (`agendaid`);

--
-- Filtros para la tabla `medicos`
--
ALTER TABLE `medicos`
  ADD CONSTRAINT `medicos_ibfk_1` FOREIGN KEY (`personaid`) REFERENCES `persona` (`personaid`),
  ADD CONSTRAINT `medicos_ibfk_2` FOREIGN KEY (`especialidadId`) REFERENCES `especialidad` (`especialidadId`);

--
-- Filtros para la tabla `medico_esp`
--
ALTER TABLE `medico_esp`
  ADD CONSTRAINT `medico_esp_ibfk_1` FOREIGN KEY (`medicoid`) REFERENCES `medicos` (`medicoid`),
  ADD CONSTRAINT `medico_esp_ibfk_2` FOREIGN KEY (`especialidadid`) REFERENCES `especialidad` (`especialidadId`);

--
-- Filtros para la tabla `persona`
--
ALTER TABLE `persona`
  ADD CONSTRAINT `persona_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `user` (`userid`),
  ADD CONSTRAINT `persona_ibfk_2` FOREIGN KEY (`obra_social`) REFERENCES `obra_social` (`id_obra_social`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Filtros para la tabla `turno`
--
ALTER TABLE `turno`
  ADD CONSTRAINT `turno_ibfk_1` FOREIGN KEY (`calendar_id`) REFERENCES `calendar` (`calendarid`),
  ADD CONSTRAINT `turno_ibfk_2` FOREIGN KEY (`estadoturno_id`) REFERENCES `estado` (`estadoid`);

--
-- Filtros para la tabla `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`idperfil`) REFERENCES `perfil` (`perfilid`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
