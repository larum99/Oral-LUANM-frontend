-- CLINICA_ODONTOLOGICA - Esquema inicial 

CREATE DATABASE IF NOT EXISTS clinica_odontologica
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE clinica_odontologica;

SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------------
-- Limpieza previa (permite re-ejecutar el script desde cero) Solo para dev, no en pdn
-- -----------------------------------------------------------------------------------

DROP TABLE IF EXISTS recuperaciones_password;
DROP TABLE IF EXISTS evoluciones_clinicas;
DROP TABLE IF EXISTS historias_clinicas;
DROP TABLE IF EXISTS historial_citas;
DROP TABLE IF EXISTS citas;
DROP TABLE IF EXISTS horarios_especialistas;
DROP TABLE IF EXISTS especialistas_servicios;
DROP TABLE IF EXISTS servicios;
DROP TABLE IF EXISTS especialistas;
DROP TABLE IF EXISTS pacientes;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS roles_permisos;
DROP TABLE IF EXISTS permisos;
DROP TABLE IF EXISTS roles;

-- ---------------------------------------------------------
-- Roles y permisos
-- ---------------------------------------------------------

CREATE TABLE roles (
  id_rol          SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre          VARCHAR(30) NOT NULL UNIQUE,
  descripcion     VARCHAR(150)
) ENGINE=InnoDB;

CREATE TABLE permisos (
  id_permiso      SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  codigo          VARCHAR(50) NOT NULL UNIQUE,
  descripcion     VARCHAR(150) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE roles_permisos (
  id_rol          SMALLINT UNSIGNED NOT NULL,
  id_permiso      SMALLINT UNSIGNED NOT NULL,
  PRIMARY KEY (id_rol, id_permiso),
  FOREIGN KEY (id_rol) REFERENCES roles(id_rol) ON DELETE CASCADE,
  FOREIGN KEY (id_permiso) REFERENCES permisos(id_permiso) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Usuarios y perfiles
-- ---------------------------------------------------------

CREATE TABLE usuarios (
  id_usuario      BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_rol          SMALLINT UNSIGNED NOT NULL,
  nombre          VARCHAR(100) NOT NULL,
  apellido        VARCHAR(100),
  email           VARCHAR(150) NOT NULL,
  telefono        VARCHAR(20),
  password_hash   VARCHAR(255) NOT NULL,
  estado          VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
  fecha_creacion  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  ultimo_login    TIMESTAMP NULL,
  CONSTRAINT uq_usuarios_email UNIQUE (email),
  CONSTRAINT chk_usuarios_estado CHECK (estado IN ('ACTIVO', 'INACTIVO', 'BLOQUEADO')),
  FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
) ENGINE=InnoDB;

CREATE TABLE pacientes (
  id_paciente       BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_usuario        BIGINT UNSIGNED UNIQUE,
  tipo_documento    VARCHAR(30) NOT NULL,
  numero_documento  VARCHAR(30) NOT NULL UNIQUE,
  fecha_nacimiento  DATE,
  acepta_datos      BOOLEAN NOT NULL DEFAULT FALSE,
  acepta_promociones BOOLEAN NOT NULL DEFAULT FALSE,
  fecha_creacion    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE especialistas (
  id_especialista BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_usuario      BIGINT UNSIGNED NOT NULL UNIQUE,
  especialidad    VARCHAR(100) NOT NULL,
  registro_profesional VARCHAR(50) UNIQUE,
  estado          VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
  fecha_creacion  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_especialistas_estado CHECK (estado IN ('ACTIVO', 'INACTIVO')),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Servicios y agenda
-- ---------------------------------------------------------

CREATE TABLE servicios (
  id_servicio     BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre          VARCHAR(100) NOT NULL UNIQUE,
  descripcion     TEXT,
  duracion_minutos SMALLINT NOT NULL DEFAULT 30,
  precio          DECIMAL(12,2),
  estado          VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
  CONSTRAINT chk_servicios_duracion CHECK (duracion_minutos > 0),
  CONSTRAINT chk_servicios_precio CHECK (precio IS NULL OR precio >= 0),
  CONSTRAINT chk_servicios_estado CHECK (estado IN ('ACTIVO', 'INACTIVO'))
) ENGINE=InnoDB;

CREATE TABLE especialistas_servicios (
  id_especialista BIGINT UNSIGNED NOT NULL,
  id_servicio     BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (id_especialista, id_servicio),
  FOREIGN KEY (id_especialista) REFERENCES especialistas(id_especialista) ON DELETE CASCADE,
  FOREIGN KEY (id_servicio) REFERENCES servicios(id_servicio) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE horarios_especialistas (
  id_horario      BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_especialista BIGINT UNSIGNED NOT NULL,
  dia_semana      SMALLINT NOT NULL,
  hora_inicio     TIME NOT NULL,
  hora_fin        TIME NOT NULL,
  activo          BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT chk_horarios_dia CHECK (dia_semana BETWEEN 1 AND 7),
  CONSTRAINT chk_horarios_rango CHECK (hora_fin > hora_inicio),
  UNIQUE (id_especialista, dia_semana, hora_inicio, hora_fin),
  FOREIGN KEY (id_especialista) REFERENCES especialistas(id_especialista) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Citas
-- ---------------------------------------------------------

CREATE TABLE citas (
  id_cita         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_paciente     BIGINT UNSIGNED NOT NULL,
  id_especialista BIGINT UNSIGNED NOT NULL,
  id_servicio     BIGINT UNSIGNED,
  fecha_hora_inicio DATETIME NOT NULL,
  fecha_hora_fin  DATETIME NOT NULL,
  motivo          VARCHAR(150) NOT NULL,
  observaciones   TEXT,
  estado          VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
  creada_por      BIGINT UNSIGNED,
  fecha_creacion  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_citas_estado CHECK (estado IN ('PENDIENTE', 'CONFIRMADA', 'ATENDIDA', 'CANCELADA', 'NO_ASISTIO')),
  CONSTRAINT chk_citas_rango CHECK (fecha_hora_fin > fecha_hora_inicio),
  UNIQUE (id_especialista, fecha_hora_inicio),
  FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente) ON DELETE RESTRICT,
  FOREIGN KEY (id_especialista) REFERENCES especialistas(id_especialista) ON DELETE RESTRICT,
  FOREIGN KEY (id_servicio) REFERENCES servicios(id_servicio) ON DELETE SET NULL,
  FOREIGN KEY (creada_por) REFERENCES usuarios(id_usuario) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE historial_citas (
  id_historial    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_cita         BIGINT UNSIGNED NOT NULL,
  estado_anterior VARCHAR(20),
  estado_nuevo    VARCHAR(20) NOT NULL,
  comentario      VARCHAR(255),
  cambiado_por    BIGINT UNSIGNED,
  fecha_cambio    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_cita) REFERENCES citas(id_cita) ON DELETE CASCADE,
  FOREIGN KEY (cambiado_por) REFERENCES usuarios(id_usuario) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Historia clinica
-- ---------------------------------------------------------

CREATE TABLE historias_clinicas (
  id_historia     BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_paciente     BIGINT UNSIGNED NOT NULL UNIQUE,
  antecedentes    TEXT,
  alergias        TEXT,
  observaciones   TEXT,
  fecha_creacion  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE evoluciones_clinicas (
  id_evolucion    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_historia     BIGINT UNSIGNED NOT NULL,
  id_cita         BIGINT UNSIGNED,
  id_especialista BIGINT UNSIGNED NOT NULL,
  diagnostico     TEXT NOT NULL,
  tratamiento     TEXT,
  notas           TEXT,
  fecha_registro  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_historia) REFERENCES historias_clinicas(id_historia) ON DELETE CASCADE,
  FOREIGN KEY (id_cita) REFERENCES citas(id_cita) ON DELETE SET NULL,
  FOREIGN KEY (id_especialista) REFERENCES especialistas(id_especialista) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Recuperacion de contraseña
-- ---------------------------------------------------------

CREATE TABLE recuperaciones_password (
  id_recuperacion BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_usuario      BIGINT UNSIGNED NOT NULL,
  token_hash      VARCHAR(255) NOT NULL UNIQUE,
  fecha_expiracion TIMESTAMP NOT NULL,
  fecha_uso       TIMESTAMP NULL,
  fecha_creacion  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Indices
-- ---------------------------------------------------------

CREATE INDEX idx_citas_paciente ON citas(id_paciente);
CREATE INDEX idx_citas_fecha_estado ON citas(fecha_hora_inicio, estado);
CREATE INDEX idx_historial_citas_cita ON historial_citas(id_cita);
CREATE INDEX idx_evoluciones_historia ON evoluciones_clinicas(id_historia);

SET FOREIGN_KEY_CHECKS = 1;