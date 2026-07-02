-- ORAL LUANM - Esquema inicial para PostgreSQL
-- Ejecutar sobre una base de datos vacía:
--   psql -d oral_luanm -f database/schema.sql

BEGIN;

CREATE TABLE roles (
  id_rol          SMALLSERIAL PRIMARY KEY,
  nombre          VARCHAR(30) NOT NULL UNIQUE,
  descripcion     VARCHAR(150)
);

CREATE TABLE permisos (
  id_permiso      SMALLSERIAL PRIMARY KEY,
  codigo          VARCHAR(50) NOT NULL UNIQUE,
  descripcion     VARCHAR(150) NOT NULL
);

CREATE TABLE roles_permisos (
  id_rol          SMALLINT NOT NULL REFERENCES roles(id_rol) ON DELETE CASCADE,
  id_permiso      SMALLINT NOT NULL REFERENCES permisos(id_permiso) ON DELETE CASCADE,
  PRIMARY KEY (id_rol, id_permiso)
);

CREATE TABLE usuarios (
  id_usuario      BIGSERIAL PRIMARY KEY,
  id_rol          SMALLINT NOT NULL REFERENCES roles(id_rol),
  nombre          VARCHAR(100) NOT NULL,
  apellido        VARCHAR(100),
  email           VARCHAR(150) NOT NULL,
  telefono        VARCHAR(20),
  password_hash   VARCHAR(255) NOT NULL,
  estado          VARCHAR(20) NOT NULL DEFAULT 'ACTIVO'
                  CHECK (estado IN ('ACTIVO', 'INACTIVO', 'BLOQUEADO')),
  fecha_creacion  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ultimo_login    TIMESTAMPTZ,
  CONSTRAINT uq_usuarios_email UNIQUE (email)
);

CREATE TABLE pacientes (
  id_paciente       BIGSERIAL PRIMARY KEY,
  id_usuario        BIGINT UNIQUE REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
  tipo_documento    VARCHAR(30) NOT NULL,
  numero_documento  VARCHAR(30) NOT NULL UNIQUE,
  fecha_nacimiento  DATE,
  acepta_datos      BOOLEAN NOT NULL DEFAULT FALSE,
  acepta_promociones BOOLEAN NOT NULL DEFAULT FALSE,
  fecha_creacion    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE especialistas (
  id_especialista BIGSERIAL PRIMARY KEY,
  id_usuario      BIGINT NOT NULL UNIQUE REFERENCES usuarios(id_usuario) ON DELETE RESTRICT,
  especialidad    VARCHAR(100) NOT NULL,
  registro_profesional VARCHAR(50) UNIQUE,
  estado          VARCHAR(20) NOT NULL DEFAULT 'ACTIVO'
                  CHECK (estado IN ('ACTIVO', 'INACTIVO')),
  fecha_creacion  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE servicios (
  id_servicio     BIGSERIAL PRIMARY KEY,
  nombre          VARCHAR(100) NOT NULL UNIQUE,
  descripcion     TEXT,
  duracion_minutos SMALLINT NOT NULL DEFAULT 30 CHECK (duracion_minutos > 0),
  precio          NUMERIC(12,2) CHECK (precio IS NULL OR precio >= 0),
  estado          VARCHAR(20) NOT NULL DEFAULT 'ACTIVO'
                  CHECK (estado IN ('ACTIVO', 'INACTIVO'))
);

CREATE TABLE especialistas_servicios (
  id_especialista BIGINT NOT NULL REFERENCES especialistas(id_especialista) ON DELETE CASCADE,
  id_servicio     BIGINT NOT NULL REFERENCES servicios(id_servicio) ON DELETE CASCADE,
  PRIMARY KEY (id_especialista, id_servicio)
);

CREATE TABLE horarios_especialistas (
  id_horario      BIGSERIAL PRIMARY KEY,
  id_especialista BIGINT NOT NULL REFERENCES especialistas(id_especialista) ON DELETE CASCADE,
  dia_semana      SMALLINT NOT NULL CHECK (dia_semana BETWEEN 1 AND 7),
  hora_inicio     TIME NOT NULL,
  hora_fin        TIME NOT NULL,
  activo          BOOLEAN NOT NULL DEFAULT TRUE,
  CHECK (hora_fin > hora_inicio),
  UNIQUE (id_especialista, dia_semana, hora_inicio, hora_fin)
);

CREATE TABLE citas (
  id_cita         BIGSERIAL PRIMARY KEY,
  id_paciente     BIGINT NOT NULL REFERENCES pacientes(id_paciente) ON DELETE RESTRICT,
  id_especialista BIGINT NOT NULL REFERENCES especialistas(id_especialista) ON DELETE RESTRICT,
  id_servicio     BIGINT REFERENCES servicios(id_servicio) ON DELETE SET NULL,
  fecha_hora_inicio TIMESTAMPTZ NOT NULL,
  fecha_hora_fin  TIMESTAMPTZ NOT NULL,
  motivo          VARCHAR(150) NOT NULL,
  observaciones   TEXT,
  estado          VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE'
                  CHECK (estado IN ('PENDIENTE', 'CONFIRMADA', 'ATENDIDA', 'CANCELADA', 'NO_ASISTIO')),
  creada_por      BIGINT REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
  fecha_creacion  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (fecha_hora_fin > fecha_hora_inicio),
  UNIQUE (id_especialista, fecha_hora_inicio)
);

CREATE TABLE historial_citas (
  id_historial    BIGSERIAL PRIMARY KEY,
  id_cita         BIGINT NOT NULL REFERENCES citas(id_cita) ON DELETE CASCADE,
  estado_anterior VARCHAR(20),
  estado_nuevo    VARCHAR(20) NOT NULL,
  comentario      VARCHAR(255),
  cambiado_por    BIGINT REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
  fecha_cambio    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE historias_clinicas (
  id_historia     BIGSERIAL PRIMARY KEY,
  id_paciente     BIGINT NOT NULL UNIQUE REFERENCES pacientes(id_paciente) ON DELETE RESTRICT,
  antecedentes    TEXT,
  alergias        TEXT,
  observaciones   TEXT,
  fecha_creacion  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE evoluciones_clinicas (
  id_evolucion    BIGSERIAL PRIMARY KEY,
  id_historia     BIGINT NOT NULL REFERENCES historias_clinicas(id_historia) ON DELETE CASCADE,
  id_cita         BIGINT REFERENCES citas(id_cita) ON DELETE SET NULL,
  id_especialista BIGINT NOT NULL REFERENCES especialistas(id_especialista) ON DELETE RESTRICT,
  diagnostico     TEXT NOT NULL,
  tratamiento     TEXT,
  notas           TEXT,
  fecha_registro  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE recuperaciones_password (
  id_recuperacion BIGSERIAL PRIMARY KEY,
  id_usuario      BIGINT NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  token_hash      VARCHAR(255) NOT NULL UNIQUE,
  fecha_expiracion TIMESTAMPTZ NOT NULL,
  fecha_uso       TIMESTAMPTZ,
  fecha_creacion  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_citas_paciente ON citas(id_paciente);
CREATE INDEX idx_citas_fecha_estado ON citas(fecha_hora_inicio, estado);
CREATE INDEX idx_historial_citas_cita ON historial_citas(id_cita);
CREATE INDEX idx_evoluciones_historia ON evoluciones_clinicas(id_historia);

INSERT INTO roles (nombre, descripcion) VALUES
  ('ADMIN', 'Administracion completa de la plataforma'),
  ('SECRETARIO', 'Gestion de pacientes y agenda'),
  ('ESPECIALISTA', 'Consulta de agenda e historias clinicas'),
  ('PACIENTE', 'Acceso a sus propios datos y citas');

INSERT INTO permisos (codigo, descripcion) VALUES
  ('CITAS_GESTIONAR', 'Crear, editar, confirmar y cancelar citas'),
  ('PACIENTES_VER', 'Consultar pacientes'),
  ('PACIENTES_GESTIONAR', 'Crear y actualizar pacientes'),
  ('ESPECIALISTAS_GESTIONAR', 'Gestionar especialistas y servicios'),
  ('PERMISOS_GESTIONAR', 'Gestionar roles y permisos'),
  ('HISTORIAS_CLINICAS_VER', 'Consultar historias clinicas'),
  ('HISTORIAS_CLINICAS_EDITAR', 'Registrar evoluciones clinicas');

INSERT INTO roles_permisos (id_rol, id_permiso)
SELECT r.id_rol, p.id_permiso
FROM roles r
CROSS JOIN permisos p
WHERE r.nombre = 'ADMIN';

INSERT INTO roles_permisos (id_rol, id_permiso)
SELECT r.id_rol, p.id_permiso
FROM roles r
JOIN permisos p ON p.codigo IN ('CITAS_GESTIONAR', 'PACIENTES_VER', 'PACIENTES_GESTIONAR')
WHERE r.nombre = 'SECRETARIO';

INSERT INTO roles_permisos (id_rol, id_permiso)
SELECT r.id_rol, p.id_permiso
FROM roles r
JOIN permisos p ON p.codigo IN ('PACIENTES_VER', 'HISTORIAS_CLINICAS_VER', 'HISTORIAS_CLINICAS_EDITAR')
WHERE r.nombre = 'ESPECIALISTA';

COMMIT;
