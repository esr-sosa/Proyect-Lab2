-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 10-10-2024 a las 00:26:52
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `Proyect-TurnosMedicos`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Agenda`
--

CREATE TABLE `Agenda` (
  `id` int(11) NOT NULL,
  `sucursal` varchar(255) DEFAULT NULL,
  `especialidad` varchar(255) DEFAULT NULL,
  `sobreturnosMax` int(11) DEFAULT NULL,
  `profesional_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Especialidad`
--

CREATE TABLE `Especialidad` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Horario`
--

CREATE TABLE `Horario` (
  `id` int(11) NOT NULL,
  `horaInicio` time DEFAULT NULL,
  `horaFin` time DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Paciente`
--

CREATE TABLE `Paciente` (
  `id` int(11) NOT NULL,
  `nombreCompleto` varchar(255) DEFAULT NULL,
  `dni` varchar(20) DEFAULT NULL,
  `motivoConsulta` varchar(255) DEFAULT NULL,
  `obraSocial` varchar(255) DEFAULT NULL,
  `datosContacto` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Profesional`
--

CREATE TABLE `Profesional` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `especialidades` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Profesional_Especialidad`
--

CREATE TABLE `Profesional_Especialidad` (
  `profesional_id` int(11) NOT NULL,
  `especialidad_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Sobreturno`
--

CREATE TABLE `Sobreturno` (
  `id` int(11) NOT NULL,
  `fecha` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `motivo` varchar(255) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  `turno_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Turno`
--

CREATE TABLE `Turno` (
  `id` int(11) NOT NULL,
  `fecha` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  `paciente_id` int(11) DEFAULT NULL,
  `agenda_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `Agenda`
--
ALTER TABLE `Agenda`
  ADD PRIMARY KEY (`id`),
  ADD KEY `profesional_id` (`profesional_id`);

--
-- Indices de la tabla `Especialidad`
--
ALTER TABLE `Especialidad`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `Horario`
--
ALTER TABLE `Horario`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `Paciente`
--
ALTER TABLE `Paciente`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `Profesional`
--
ALTER TABLE `Profesional`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `Profesional_Especialidad`
--
ALTER TABLE `Profesional_Especialidad`
  ADD PRIMARY KEY (`profesional_id`,`especialidad_id`),
  ADD KEY `especialidad_id` (`especialidad_id`);

--
-- Indices de la tabla `Sobreturno`
--
ALTER TABLE `Sobreturno`
  ADD PRIMARY KEY (`id`),
  ADD KEY `turno_id` (`turno_id`);

--
-- Indices de la tabla `Turno`
--
ALTER TABLE `Turno`
  ADD PRIMARY KEY (`id`),
  ADD KEY `paciente_id` (`paciente_id`),
  ADD KEY `agenda_id` (`agenda_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `Agenda`
--
ALTER TABLE `Agenda`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `Especialidad`
--
ALTER TABLE `Especialidad`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `Horario`
--
ALTER TABLE `Horario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `Paciente`
--
ALTER TABLE `Paciente`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `Profesional`
--
ALTER TABLE `Profesional`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `Sobreturno`
--
ALTER TABLE `Sobreturno`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `Turno`
--
ALTER TABLE `Turno`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `Agenda`
--
ALTER TABLE `Agenda`
  ADD CONSTRAINT `agenda_ibfk_1` FOREIGN KEY (`profesional_id`) REFERENCES `Profesional` (`id`);

--
-- Filtros para la tabla `Profesional_Especialidad`
--
ALTER TABLE `Profesional_Especialidad`
  ADD CONSTRAINT `profesional_especialidad_ibfk_1` FOREIGN KEY (`profesional_id`) REFERENCES `Profesional` (`id`),
  ADD CONSTRAINT `profesional_especialidad_ibfk_2` FOREIGN KEY (`especialidad_id`) REFERENCES `Especialidad` (`id`);

--
-- Filtros para la tabla `Sobreturno`
--
ALTER TABLE `Sobreturno`
  ADD CONSTRAINT `sobreturno_ibfk_1` FOREIGN KEY (`turno_id`) REFERENCES `Turno` (`id`);

--
-- Filtros para la tabla `Turno`
--
ALTER TABLE `Turno`
  ADD CONSTRAINT `turno_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `Paciente` (`id`),
  ADD CONSTRAINT `turno_ibfk_2` FOREIGN KEY (`agenda_id`) REFERENCES `Agenda` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
