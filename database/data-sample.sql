-- CLINICA_ODONTOLOGICA - Datos de muestra

USE clinica_odontologica;

-- ---------------------------------------------------------
-- roles (5)
-- ---------------------------------------------------------
INSERT INTO roles (nombre, descripcion) VALUES
  ('ADMIN', 'Administracion completa de la plataforma'),
  ('SECRETARIO', 'Gestion de pacientes y agenda'),
  ('ESPECIALISTA', 'Consulta de agenda e historias clinicas'),
  ('PACIENTE', 'Acceso a sus propios datos y citas'),
  ('AUXILIAR', 'Apoyo en recepcion y esterilizacion');

-- ---------------------------------------------------------
-- permisos (5)
-- ---------------------------------------------------------
INSERT INTO permisos (codigo, descripcion) VALUES
  ('CITAS_GESTIONAR', 'Crear, editar, confirmar y cancelar citas'),
  ('PACIENTES_VER', 'Consultar pacientes'),
  ('PACIENTES_GESTIONAR', 'Crear y actualizar pacientes'),
  ('ESPECIALISTAS_GESTIONAR', 'Gestionar especialistas y servicios'),
  ('HISTORIAS_CLINICAS_VER', 'Consultar historias clinicas');

-- ---------------------------------------------------------
-- roles_permisos (5)
-- id_rol: 1=ADMIN 2=SECRETARIO 3=ESPECIALISTA 4=PACIENTE 5=AUXILIAR
-- id_permiso: 1=CITAS_GESTIONAR 2=PACIENTES_VER 3=PACIENTES_GESTIONAR
--             4=ESPECIALISTAS_GESTIONAR 5=HISTORIAS_CLINICAS_VER
-- ---------------------------------------------------------
INSERT INTO roles_permisos (id_rol, id_permiso) VALUES
  (1, 1),
  (1, 4),
  (2, 1),
  (2, 3),
  (3, 5),
  (4, 1);

-- ---------------------------------------------------------
-- usuarios (12)
-- 1 admin, 1 secretario, 5 especialistas y 5 pacientes con cuenta propia
-- (el paciente se registra el mismo desde la app y gestiona sus citas).
-- id_rol: 1=ADMIN 2=SECRETARIO 3=ESPECIALISTA 4=PACIENTE
-- ---------------------------------------------------------
INSERT INTO usuarios (id_rol, nombre, apellido, email, telefono, password_hash, estado) VALUES
  (1, 'Ana', 'Martinez', 'ana.martinez@oralluanm.com', '3001234567', 'hash_admin_001', 'ACTIVO'),
  (2, 'Carlos', 'Gomez', 'carlos.gomez@oralluanm.com', '3002345678', 'hash_secretario_001', 'ACTIVO'),
  (3, 'Laura', 'Perez', 'laura.perez@oralluanm.com', '3003456789', 'hash_especialista_001', 'ACTIVO'),
  (3, 'Diego', 'Torres', 'diego.torres@oralluanm.com', '3004567890', 'hash_especialista_002', 'ACTIVO'),
  (3, 'Sofia', 'Ramirez', 'sofia.ramirez@oralluanm.com', '3005678901', 'hash_especialista_003', 'ACTIVO'),
  (3, 'Andres', 'Lopez', 'andres.lopez@oralluanm.com', '3006789012', 'hash_especialista_004', 'ACTIVO'),
  (3, 'Valentina', 'Castro', 'valentina.castro@oralluanm.com', '3007890123', 'hash_especialista_005', 'ACTIVO'),
  (4, 'Mariana', 'Gutierrez', 'mariana.gutierrez@gmail.com', '3101234567', 'hash_paciente_001', 'ACTIVO'),
  (4, 'Jorge', 'Salazar', 'jorge.salazar@gmail.com', '3102234567', 'hash_paciente_002', 'ACTIVO'),
  (4, 'Camilo', 'Rios', 'camilo.rios.tutor@gmail.com', '3103234567', 'hash_paciente_003', 'ACTIVO'),
  (4, 'Patricia', 'Vargas', 'patricia.vargas@gmail.com', '3104234567', 'hash_paciente_004', 'ACTIVO'),
  (4, 'Felipe', 'Ortiz', 'felipe.ortiz@gmail.com', '3105234567', 'hash_paciente_005', 'ACTIVO');

-- ---------------------------------------------------------
-- pacientes (5)
-- Cada paciente tiene su propia cuenta de usuario (id_usuario 8-12),
-- ya que se registran ellos mismos desde la app y gestionan sus citas.
-- Nota: el paciente 3 es menor de edad (TI, nacido en 2010); en la practica
-- su cuenta la crearia/gestionaria un acudiente, pero el modelo de datos
-- es el mismo (un id_usuario asociado al registro del paciente).
-- ---------------------------------------------------------
INSERT INTO pacientes (id_usuario, tipo_documento, numero_documento, fecha_nacimiento, acepta_datos, acepta_promociones) VALUES
  (8,  'CC', '1001111111', '1990-05-14', TRUE, TRUE),
  (9,  'CC', '1002222222', '1985-11-02', TRUE, FALSE),
  (10, 'TI', '1003333333', '2010-03-21', TRUE, FALSE),
  (11, 'CC', '1004444444', '1978-07-30', TRUE, TRUE),
  (12, 'CE', '1005555555', '1995-01-09', TRUE, TRUE);

-- ---------------------------------------------------------
-- especialistas (5)
-- id_usuario: 3,4,5,6,7 (las 5 cuentas creadas con rol ESPECIALISTA)
-- ---------------------------------------------------------
INSERT INTO especialistas (id_usuario, especialidad, registro_profesional, estado) VALUES
  (3, 'Ortodoncia', 'RP-1001', 'ACTIVO'),
  (4, 'Endodoncia', 'RP-1002', 'ACTIVO'),
  (5, 'Odontopediatria', 'RP-1003', 'ACTIVO'),
  (6, 'Cirugia Oral', 'RP-1004', 'ACTIVO'),
  (7, 'Periodoncia', 'RP-1005', 'ACTIVO');

-- ---------------------------------------------------------
-- servicios (5)
-- ---------------------------------------------------------
INSERT INTO servicios (nombre, descripcion, duracion_minutos, precio, estado) VALUES
  ('Limpieza dental', 'Profilaxis y remocion de placa bacteriana', 30, 80000.00, 'ACTIVO'),
  ('Blanqueamiento dental', 'Aclaramiento del color de los dientes', 60, 250000.00, 'ACTIVO'),
  ('Extraccion simple', 'Extraccion de pieza dental sin complicaciones', 30, 120000.00, 'ACTIVO'),
  ('Control de ortodoncia', 'Ajuste mensual de brackets', 20, 90000.00, 'ACTIVO'),
  ('Tratamiento de conducto', 'Endodoncia completa de una pieza dental', 90, 450000.00, 'ACTIVO');

-- ---------------------------------------------------------
-- especialistas_servicios (5)
-- ---------------------------------------------------------
INSERT INTO especialistas_servicios (id_especialista, id_servicio) VALUES
  (1, 4),
  (2, 5),
  (3, 1),
  (4, 3),
  (5, 1);

-- ---------------------------------------------------------
-- horarios_especialistas (5)
-- dia_semana: 1=Lunes ... 7=Domingo
-- ---------------------------------------------------------
INSERT INTO horarios_especialistas (id_especialista, dia_semana, hora_inicio, hora_fin, activo) VALUES
  (1, 1, '08:00:00', '12:00:00', TRUE),
  (2, 2, '13:00:00', '17:00:00', TRUE),
  (3, 3, '08:00:00', '14:00:00', TRUE),
  (4, 4, '09:00:00', '13:00:00', TRUE),
  (5, 5, '14:00:00', '18:00:00', TRUE);

-- ---------------------------------------------------------
-- citas (5)
-- Se cubre un estado distinto en cada fila para mostrar el flujo completo.
-- creada_por refleja quien agenda: el propio paciente (desde la app) o el
-- secretario (recepcion). id_usuario del paciente: 1->8, 2->9, 3->10, 4->11, 5->12
-- ---------------------------------------------------------
INSERT INTO citas (id_paciente, id_especialista, id_servicio, fecha_hora_inicio, fecha_hora_fin, motivo, estado, creada_por) VALUES
  (1, 1, 4, '2026-08-03 08:00:00', '2026-08-03 08:20:00', 'Ajuste de brackets', 'PENDIENTE', 8),
  (2, 2, 5, '2026-08-04 13:00:00', '2026-08-04 14:30:00', 'Dolor en muela posterior', 'CONFIRMADA', 9),
  (3, 3, 1, '2026-08-05 08:30:00', '2026-08-05 09:00:00', 'Limpieza dental de control', 'ATENDIDA', 2),
  (4, 4, 3, '2026-08-06 09:00:00', '2026-08-06 09:30:00', 'Extraccion de muela del juicio', 'CANCELADA', 11),
  (5, 5, 1, '2026-08-07 14:00:00', '2026-08-07 14:30:00', 'Limpieza dental anual', 'NO_ASISTIO', 2);

-- ---------------------------------------------------------
-- historial_citas (5)
-- Un registro de auditoria por cada cita creada arriba.
-- ---------------------------------------------------------
INSERT INTO historial_citas (id_cita, estado_anterior, estado_nuevo, comentario, cambiado_por) VALUES
  (1, NULL, 'PENDIENTE', 'Cita agendada por el paciente desde la app', 8),
  (2, 'PENDIENTE', 'CONFIRMADA', 'Paciente confirmo su propia cita desde la app', 9),
  (3, 'CONFIRMADA', 'ATENDIDA', 'Consulta realizada sin novedades', 5),
  (4, 'PENDIENTE', 'CANCELADA', 'Paciente cancelo su cita desde la app por viaje', 11),
  (5, 'CONFIRMADA', 'NO_ASISTIO', 'Paciente no se presento, marcado por recepcion', 2);

-- ---------------------------------------------------------
-- historias_clinicas (5)
-- Una historia clinica por cada paciente.
-- ---------------------------------------------------------
INSERT INTO historias_clinicas (id_paciente, antecedentes, alergias, observaciones) VALUES
  (1, 'Sin antecedentes relevantes', 'Ninguna conocida', 'Uso de ortodoncia desde 2024'),
  (2, 'Hipertension controlada', 'Penicilina', 'Requiere premedicacion antes de procedimientos'),
  (3, 'Paciente pediatrico, sin antecedentes', 'Ninguna conocida', 'Primera visita al odontologo'),
  (4, 'Diabetes tipo 2', 'Ninguna conocida', 'Control periodontal cada 3 meses'),
  (5, 'Sin antecedentes relevantes', 'Latex', 'Se usan guantes libres de latex en su atencion');

-- ---------------------------------------------------------
-- evoluciones_clinicas (5)
-- Ligadas a la historia y, cuando aplica, a la cita correspondiente.
-- ---------------------------------------------------------
INSERT INTO evoluciones_clinicas (id_historia, id_cita, id_especialista, diagnostico, tratamiento, notas) VALUES
  (1, 1, 1, 'Desgaste normal de brackets', 'Ajuste de arco y cambio de ligas', 'Proximo control en 4 semanas'),
  (2, 2, 2, 'Pulpitis irreversible en pieza 36', 'Inicio de tratamiento de conducto', 'Se programa segunda sesion'),
  (3, 3, 3, 'Placa bacteriana leve', 'Profilaxis y fluorizacion', 'Buena higiene oral en general'),
  (4, 4, 4, 'Pieza 38 en posicion horizontal', 'Se recomienda extraccion quirurgica', 'Paciente cancelo, pendiente reprogramar'),
  (5, 5, 5, 'Gingivitis leve', 'Limpieza profunda y educacion en higiene', 'Paciente no asistio, se debe contactar');

-- ---------------------------------------------------------
-- recuperaciones_password (5)
-- ---------------------------------------------------------
INSERT INTO recuperaciones_password (id_usuario, token_hash, fecha_expiracion, fecha_uso) VALUES
  (1, 'token_hash_admin_20260701', '2026-07-01 10:30:00', '2026-07-01 10:05:00'),
  (2, 'token_hash_secretario_20260705', '2026-07-05 09:15:00', NULL),
  (3, 'token_hash_esp1_20260710', '2026-07-10 16:45:00', '2026-07-10 16:20:00'),
  (4, 'token_hash_esp2_20260712', '2026-07-12 11:00:00', NULL),
  (5, 'token_hash_esp3_20260715', '2026-07-15 08:50:00', '2026-07-15 08:40:00');