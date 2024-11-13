-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: brakerwh6icdoo3gzlcn-mysql.services.clever-cloud.com:3306
-- Tiempo de generación: 12-11-2024 a las 22:51:57
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
  `createdAt` datetime NOT NULL,
  `updateAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `agenda`
--

INSERT INTO `agenda` (`agendaid`, `persona_id`, `sucursal_id`, `ttipoid`, `nombreagenda`, `duracion`, `medico_id`, `createdAt`, `updateAt`) VALUES
(2, 20, 2, 3, '', 30, 4, '2024-11-12 22:46:23', '2024-11-12 22:46:23');

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
(3, 2, '2024-11-12', '09:00:00', '09:30:00', 1, '2024-11-12 22:49:38', '2024-11-12 22:49:38'),
(4, 2, '2024-11-12', '10:00:00', '10:30:00', 1, '2024-11-12 22:49:38', '2024-11-12 22:49:38');

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
(21, 'Cardiologia', 1, '2024-11-12 21:23:48', '2024-11-12 21:23:48'),
(22, 'Pediatria', 1, '2024-11-12 21:23:59', '2024-11-12 21:23:59'),
(23, 'Medico General', 1, '2024-11-12 21:24:10', '2024-11-12 21:24:10');

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
(4, 20, 21, 1, '2024-11-12 22:41:37', '2024-11-12 22:41:37');

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
('SD234234', 4, 21, '2024-11-12 22:41:37', '2024-11-12 22:41:37');

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
  `updateAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `persona`
--

INSERT INTO `persona` (`personaid`, `userid`, `dni`, `nombre`, `apellido`, `direccion`, `localidad`, `telefono`, `mail`, `foto_dni`, `foto_perfil`, `createdAt`, `updateAt`) VALUES
(17, 12, 55554262, 'mauro', 'benito', 'Colon 445 San luis', 'san luis', '458-7855423', 'admin', '/uploads/dni/1731269742655.jpg', NULL, '2024-11-10 20:15:45', '2024-11-10 20:15:45'),
(18, 13, 11111111, 'Emanuel ', 'Sosa', 'a', 'a', '121-2121212', 'admin1', '/uploads/dni/1731274895772.avif', '1731274911906.HEIC', '2024-11-10 21:41:37', '2024-11-10 21:41:52'),
(19, 15, 12345678, 'Raul', 'casa', 'casa 1', 'San Luis', '266-4123456', 'raul@gmail.com', NULL, NULL, '2024-11-12 22:38:31', '2024-11-12 22:38:31'),
(20, 16, 12345670, 'Jose', 'Marco', 'casa 1', 'San Luis', '266-4123456', 'Jose@gmail.com', NULL, NULL, '2024-11-12 22:41:36', '2024-11-12 22:41:36');

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
(2, 'Clínica Central', 'Av. Principal 123', 1, NULL, NULL, '2024-11-12 22:44:33', '2024-11-12 22:44:33'),
(3, 'Consultorio Norte', 'Calle 456', 1, NULL, NULL, '2024-11-12 22:44:33', '2024-11-12 22:44:33');

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
(2, 'primer consulta', 'paciente nuevo', ''),
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
  `observaciones` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `turno`
--

INSERT INTO `turno` (`turniid`, `persona_id`, `calendar_id`, `fecha`, `hora`, `estadoturno_id`, `observaciones`) VALUES
(1, 2, 3, '2024-11-12', '13:50:20', 2, '');

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
(13, 4, 'admin1', '$2a$10$4qms2sfPR1.bgqsbsuLFIuoXL.pkrEth2Z7vQNTDyae9NuogDod9y', 1, '2024-11-10 21:41:36', '2024-11-10 21:41:36'),
(15, 4, 'raul@gmail.com', '$2a$10$49EVSURhpA.eUBvbmiUwgeQ5DuKLwoUkp2uBCl9jBZ8hm3A7mMLTi', 1, '2024-11-12 22:38:31', '2024-11-12 22:38:31'),
(16, 2, 'Jose@gmail.com', '$2a$10$vbVO0ysI.2uhz4veynEYLO0PeHt8YSz9g5vp08DTI0o2TRiYuweui', 1, '2024-11-12 22:41:36', '2024-11-12 22:41:36');

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
  ADD KEY `dni` (`dni`);

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
  MODIFY `agendaid` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `calendar`
--
ALTER TABLE `calendar`
  MODIFY `calendarid` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `especialidad`
--
ALTER TABLE `especialidad`
  MODIFY `especialidadId` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `estado`
--
ALTER TABLE `estado`
  MODIFY `estadoid` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `medicos`
--
ALTER TABLE `medicos`
  MODIFY `medicoid` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `perfil`
--
ALTER TABLE `perfil`
  MODIFY `perfilid` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `persona`
--
ALTER TABLE `persona`
  MODIFY `personaid` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `sucursal`
--
ALTER TABLE `sucursal`
  MODIFY `sucursalid` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
  MODIFY `userid` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

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
  ADD CONSTRAINT `persona_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `user` (`userid`);

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
