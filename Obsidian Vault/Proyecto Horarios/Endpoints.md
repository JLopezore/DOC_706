# Diseño Visual de Base de Datos - Sistema de Horarios de Exámenes

---
# ENDPOINTS Y USO EN EL SISTEMA

| ENDPOINT         | QUÉ PROPORCIONA                                           | FRECUENCIA DE CONSUMO | USO EN TU SISTEMA                                 |
| ---------------- | --------------------------------------------------------- | --------------------- | ------------------------------------------------- |
| **/api/periodo** |                                                           |                       |                                                   |
| **GET /lista**   | • Lista completa de periodos<br>• Fechas inicio/fin       | **BAJA (Semanal)**    | Cachear en BD<br>SELECT periodo al crear exámenes |
| **GET /{clave}** | • Detalle de periodo específico<br>• Metadata del periodo | **BAJO (Demanda)**    | Validar fechas de exámenes<br>Confirmar vigencia  |
| **GET /actual**  | • Periodo académico vigente<br>• Clave del periodo activo | **ALTA (Diaria)**     | **INICIO DE SESIÓN**<br>Filtro principal de datos |

---

| ENDPOINT                                    | QUÉ PROPORCIONA                                                                         | FRECUENCIA DE CONSUMO  | USO EN TU SISTEMA                                                                      |
| ------------------------------------------- | --------------------------------------------------------------------------------------- | ---------------------- | -------------------------------------------------------------------------------------- |
| **/api/horarios (CRÍTICO PARA ALGORITMO)**  |                                                                                         |                        |                                                                                        |
| **GET /{periodo}/{idprofesor}**             | • Horario completo del profesor<br>• Días, horas, aulas ocupadas                        | **ALTA (Tiempo Real)** | **VALIDAR DISPONIBILIDAD**<br>Aplicadores/Sinodales<br>Requisito: "No tener clase"     |
| **GET /{periodo}/aula/{idAula}**            | • Ocupación de aula por horario<br>• Materias/grupos que la usan                        | **ALTA (Tiempo Real)** | **VALIDAR DISPONIBILIDAD AULA**<br>Buscar salas libres                                 |
| **GET /{periodo}/grupo/{idGrupo}**          | • Horario completo del grupo<br>• Todas las materias del grupo<br>• Días/horas ocupados | **ALTA (Diaria)**      | **IDENTIFICAR HUECOS**<br>No afectar clases regulares<br>**DETECTAR INGLÉS** (excluir) |
| **GET /{periodo}/grupo/{idGrupo}/materias** | • Lista de materias del grupo<br>• Profesor titular por materia<br>• Clave de materia   | **MEDIA (Diaria)**     | Pre-cargar materias a examinar<br>Vincular con profesor titular                        |

---

| ENDPOINT                                                       | QUÉ PROPORCIONA                                                     | FRECUENCIA DE CONSUMO | USO EN TU SISTEMA                                                                             |
| -------------------------------------------------------------- | ------------------------------------------------------------------- | --------------------- | --------------------------------------------------------------------------------------------- |
| **/api/grupos**                                                |                                                                     |                       |                                                                                               |
| **GET /periodo={clavePeriodo}**                                | • Todos los grupos del periodo<br>• Clave grupo, nombre, turno      | **DIARIA**            | **LISTA BASE** para crear exámenes<br>Cargar grupos en interface                              |
| **GET /lista-carrera/periodo={clavePeriodo}&carrera={clave}**  | • Grupos filtrados por carrera<br>• Permite trabajo por academia    | **DIARIA**            | **FILTRO POR ACADEMIA**<br>Jefe de Carrera ve solo sus grupos<br>Validar "misma Licenciatura" |
| **GET /detalle-grupo/periodo={clavePeriodo}&clavegrupo={...}** | • Capacidad del grupo<br>• Carrera del grupo<br>• Metadata completa | **BAJO (Demanda)**    | Validar capacidad de aula/sala<br>Contexto para asignación                                    |

---

| ENDPOINT                                      | QUÉ PROPORCIONA                                                    | FRECUENCIA DE CONSUMO | USO EN TU SISTEMA                                                                            |
| --------------------------------------------- | ------------------------------------------------------------------ | --------------------- | -------------------------------------------------------------------------------------------- |
| **/api/carreras**                             |                                                                    |                       |                                                                                              |
| **GET /**                                     | • Todas las carreras                                               | **BAJA (Semanal)**    | Cachear catálogo completo                                                                    |
| **GET /vigentes**                             | • Carreras activas<br>• Filtro de carreras válidas                 | **MEDIA (Diaria)**    | **VALIDAR LICENCIATURA**<br>Aplicador de "misma Licenciatura"<br>Lista para Jefes de Carrera |
| **GET /detalle-carrera/clave={claveCarrera}** | • Nombre completo<br>• Jefe de carrera<br>• Metadata de la carrera | **BAJO (Demanda)**    | Mostrar info en reportes<br>Validaciones específicas                                         |

---

| ENDPOINT                                                                 | QUÉ PROPORCIONA                                                                             | FRECUENCIA DE CONSUMO             | USO EN TU SISTEMA                                                                                                        |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **/api/aulas (CRÍTICO PARA ASIGNACIÓN)**                                 |                                                                                             |                                   |                                                                                                                          |
| **GET /**                                                                | • Todas las aulas<br>• Capacidades                                                          | **BAJA (Semanal)**                | Cachear catálogo de aulas/salas                                                                                          |
| **GET /buscarlibres/periodo={...}&capacidad={...}&dia={...}&hora={...}** | • **Aulas disponibles filtradas**<br>• Por: capacidad, día, hora<br>• Lista de salas libres | **TIEMPO REAL (Cada asignación)** | **ALGORITMO DE ASIGNACIÓN**<br>Buscar sala libre para examen<br>Requisito: "Lugar Predominante" (SALAS en área de salud) |
| **GET /capacidad/{cantidad}**                                            | • Aulas con capacidad específica                                                            | **BAJO (Demanda)**                | Pre-filtro antes de buscar libres                                                                                        |
| **GET /capacidades**                                                     | • Lista de capacidades disponibles<br>• Ej: [10, 20, 30, 50]                                | **BAJA (Semanal)**                | Cachear opciones de capacidad<br>Filtros en UI                                                                           |

---

## 2. DISEÑO DE BASE DE DATOS (MODELO ER)

https://dbdiagram.io/d para ver el diagrama interactivo:

````dbdiagram
// ============================================
// SISTEMA DE HORARIOS DE EXÁMENES
// Área de Salud
// ============================================

// ============================================
// TABLAS DE CACHÉ (Desde Endpoints Externos)
// ============================================

Table periodos {
  id_periodo int [pk, increment, note: 'ID interno']
  clave_periodo varchar(20) [unique, not null, note: 'Desde /api/periodo/lista']
  nombre varchar(100)
  fecha_inicio date
  fecha_fin date
  activo boolean [default: false, note: 'Desde /api/periodo/actual']
  fecha_sincronizacion timestamp [default: `now()`]
  
  Note: '📅 Desde: /api/periodo/lista, /api/periodo/actual'
}

Table carreras {
  id_carrera int [pk, increment]
  clave_carrera varchar(20) [unique, not null, note: 'Desde /api/carreras']
  nombre varchar(150)
  vigente boolean [default: true, note: 'Desde /api/carreras/vigentes']
  fecha_sincronizacion timestamp [default: `now()`]
  
  Note: '🏥 Desde: /api/carreras/vigentes'
}

Table aulas {
  id_aula int [pk, increment]
  id_aula_externo varchar(20) [unique, not null, note: 'ID del sistema externo']
  nombre varchar(100)
  capacidad int [note: 'Desde /api/aulas']
  tipo enum('AULA','SALA','LABORATORIO') [default: 'SALA', note: 'SALA = área de salud']
  activa boolean [default: true]
  fecha_sincronizacion timestamp [default: `now()`]
  
  Note: '🏢 Desde: /api/aulas, /api/aulas/capacidad/{cantidad}'
}

Table grupos {
  id_grupo int [pk, increment]
  clave_grupo varchar(20) [not null, note: 'Desde /api/grupos']
  id_periodo int [not null, ref: > periodos.id_periodo]
  id_carrera int [not null, ref: > carreras.id_carrera]
  nombre varchar(100)
  capacidad_alumnos int [note: 'Desde /api/grupos/detalle-grupo']
  turno enum('MATUTINO','VESPERTINO','MIXTO')
  fecha_sincronizacion timestamp [default: `now()`]
  
  indexes {
    (clave_grupo, id_periodo) [unique]
  }
  
  Note: '👥 Desde: /api/grupos/periodo={periodo}, /api/grupos/lista-carrera'
}

Table profesores {
  id_profesor int [pk, increment]
  id_profesor_externo varchar(20) [unique, not null, note: 'ID sistema externo']
  nombre varchar(150)
  id_carrera int [ref: > carreras.id_carrera, note: 'Licenciatura del profesor']
  email varchar(100)
  activo boolean [default: true]
  
  Note: '👨‍🏫 Info del sistema externo + /api/horarios/{periodo}/{idprofesor}'
}

Table materias_grupo {
  id_materia_grupo int [pk, increment]
  id_grupo int [not null, ref: > grupos.id_grupo]
  clave_materia varchar(20) [not null, note: 'Desde /api/horarios/{periodo}/grupo/{idGrupo}/materias']
  nombre_materia varchar(150)
  id_profesor_titular int [ref: > profesores.id_profesor]
  creditos int
  
  Note: '📚 Desde: /api/horarios/{periodo}/grupo/{idGrupo}/materias'
}

// ============================================
// TABLA CRÍTICA: Horarios de Clases Regulares
// (Para detectar conflictos y horas de inglés)
// ============================================

Table horarios_clases {
  id_horario_clase int [pk, increment]
  id_materia_grupo int [not null, ref: > materias_grupo.id_materia_grupo]
  id_aula int [ref: > aulas.id_aula]
  id_profesor int [ref: > profesores.id_profesor]
  dia_semana enum('LUNES','MARTES','MIERCOLES','JUEVES','VIERNES','SABADO') [not null]
  hora_inicio time [not null]
  hora_fin time [not null]
  es_ingles boolean [default: false, note: '⚠️ CRÍTICO: NO afectar inglés']
  fecha_sincronizacion timestamp [default: `now()`]
  
  indexes {
    (id_profesor, dia_semana, hora_inicio)
    (id_aula, dia_semana, hora_inicio)
    (id_materia_grupo, dia_semana)
  }
  
  Note: '⏰ Desde: /api/horarios/{periodo}/grupo/{idGrupo}, /api/horarios/{periodo}/{idprofesor}, /api/horarios/{periodo}/aula/{idAula}'
}

// ============================================
// TABLAS PROPIAS DEL SISTEMA
// ============================================

Table tipos_examen {
  id_tipo_examen int [pk, increment]
  codigo varchar(20) [unique, not null, note: 'PARCIAL, ORDINARIO, EXTRAORDINARIO, ESPECIAL']
  nombre varchar(50)
  requiere_sinodal boolean [default: false, note: 'TRUE para Extra y Especial']
  duracion_horas decimal(3,1) [default: 2.0, note: '2 horas para Ordinarios']
  permite_edicion_duracion boolean [default: false]
  activo boolean [default: true]
  
  Note: '📝 Catálogo interno del sistema'
}

Table examenes {
  id_examen int [pk, increment]
  id_materia_grupo int [not null, ref: > materias_grupo.id_materia_grupo]
  id_tipo_examen int [not null, ref: > tipos_examen.id_tipo_examen]
  
  // Asignación de fecha/hora/lugar
  fecha_examen date [not null, note: 'Resultado del algoritmo']
  hora_inicio time [not null]
  hora_fin time [not null]
  id_aula int [not null, ref: > aulas.id_aula, note: 'Asignada desde /api/aulas/buscarlibres']
  
  // Personal
  id_profesor_aplicador int [not null, ref: > profesores.id_profesor, note: 'Misma licenciatura + sin clase']
  id_profesor_sinodal int [ref: > profesores.id_profesor, note: 'NULL para Parciales/Ordinarios']
  
  // Gestión y aprobación
  estado enum('BORRADOR','PROPUESTO','APROBADO_JEFE','APROBADO_SERVICIOS','RECHAZADO','REALIZADO') [default: 'BORRADOR']
  observaciones text
  motivo_rechazo text
  
  // Auditoría
  creado_por int [ref: > usuarios.id_usuario]
  aprobado_por int [ref: > usuarios.id_usuario]
  fecha_creacion timestamp [default: `now()`]
  fecha_aprobacion timestamp
  
  indexes {
    (fecha_examen, hora_inicio, id_aula)
    (id_profesor_aplicador, fecha_examen, hora_inicio)
    (id_materia_grupo, id_tipo_examen)
  }
  
  Note: '📋 TABLA PRINCIPAL: Horario de exámenes generado'
}

Table conflictos_horarios {
  id_conflicto int [pk, increment]
  id_examen int [not null, ref: > examenes.id_examen]
  tipo_conflicto enum('PROFESOR_OCUPADO','AULA_OCUPADA','GRUPO_CON_CLASE','AFECTA_INGLES','CAPACIDAD_INSUFICIENTE') [not null]
  descripcion text
  resuelto boolean [default: false]
  fecha_deteccion timestamp [default: `now()`]
  resuelto_por int [ref: > usuarios.id_usuario]
  fecha_resolucion timestamp
  
  Note: '⚠️ Log automático de conflictos detectados'
}

Table disponibilidad_profesores {
  id_disponibilidad int [pk, increment]
  id_profesor int [not null, ref: > profesores.id_profesor]
  fecha date [not null]
  hora_inicio time [not null]
  hora_fin time [not null]
  tipo enum('NO_DISPONIBLE','PREFERENCIA','COMISION') [default: 'NO_DISPONIBLE']
  motivo varchar(255)
  activa boolean [default: true]
  
  indexes {
    (id_profesor, fecha, hora_inicio)
  }
  
  Note: '🚫 Restricciones manuales de profesores (además de sus clases)'
}

Table usuarios {
  id_usuario int [pk, increment]
  nombre varchar(150)
  email varchar(100) [unique]
  password_hash varchar(255)
  rol enum('ADMIN','JEFE_CARRERA','SERVICIOS_ESCOLARES','SECRETARIA','COORDINADOR_ACADEMIAS') [not null]
  id_carrera int [ref: > carreras.id_carrera, note: 'Para Jefes de Carrera']
  activo boolean [default: true]
  fecha_creacion timestamp [default: `now()`]
  
  Note: '👤 Usuarios del sistema de horarios'
}

Table log_aprobaciones {
  id_log int [pk, increment]
  id_examen int [not null, ref: > examenes.id_examen]
  id_usuario int [not null, ref: > usuarios.id_usuario]
  accion enum('CREAR','MODIFICAR','APROBAR','RECHAZAR','CANCELAR') [not null]
  estado_anterior varchar(50)
  estado_nuevo varchar(50)
  comentario text
  fecha_accion timestamp [default: `now()`]
  
  Note: '📜 Trazabilidad de cambios y aprobaciones'
}

// ============================================
// TABLA AUXILIAR: Exclusiones de Inglés
// ============================================

Table exclusiones_ingles {
  id_exclusion int [pk, increment]
  id_grupo int [not null, ref: > grupos.id_grupo]
  dia_semana enum('LUNES','MARTES','MIERCOLES','JUEVES','VIERNES','SABADO') [not null]
  hora_inicio time [not null]
  hora_fin time [not null]
  nivel_ingles varchar(50) [note: 'Ej: Inglés III']
  
  indexes {
    (id_grupo, dia_semana, hora_inicio)
  }
  
  Note: '🚫 Horas de inglés identificadas automáticamente desde horarios_clases (es_ingles=true)'
}

// ============================================
// RELACIONES CLAVE
// ============================================

Ref: examenes.id_profesor_aplicador > profesores.id_profesor [note: 'Requisito: Misma licenciatura + sin clases']
Ref: examenes.id_profesor_sinodal > profesores.id_profesor [note: 'Solo para Extraordinarios/Especiales']
Ref: examenes.id_aula > aulas.id_aula [note: 'Asignada desde /api/aulas/buscarlibres']
Ref: horarios_clases.id_profesor > profesores.id_profesor [note: 'Para validar disponibilidad']
Ref: horarios_clases.id_aula > aulas.id_aula [note: 'Para validar disponibilidad de sala']
````

---

## 4. DIAGRAMA DE FLUJO DE DATOS

```
┌─────────────────────────────────────────────────────────────────┐
│                      ENDPOINTS EXTERNOS                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Sincronización
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    TABLAS DE CACHÉ (Tu BD)                      │
│  • periodos        • grupos         • profesores                │
│  • carreras        • aulas          • materias_grupo            │
│  • horarios_clases (CRÍTICO para algoritmo)                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Lee datos cacheados
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              ALGORITMO DE ASIGNACIÓN DE EXÁMENES                │
│  1. Obtiene grupos del periodo                                  │
│  2. Para cada materia_grupo:                                    │
│     a) Consulta horarios_clases (excluye inglés)                │
│     b) Busca profesores disponibles (sin clases)                │
│     c) Llama /api/aulas/buscarlibres (sala libre)               │
│  3. Genera propuesta de horario                                 │
│  4. Detecta conflictos automáticamente                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Guarda resultado
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  TABLAS DE EXÁMENES (Tu BD)                     │
│  • examenes (horario generado)                                  │
│  • conflictos_horarios (log automático)                         │
│  • log_aprobaciones (trazabilidad)                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Aprobación
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FLUJO DE APROBACIÓN                          │
│  BORRADOR → PROPUESTO → APROBADO_JEFE → APROBADO_SERVICIOS      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. RESUMEN DE CAMPOS QUE VIENEN DE ENDPOINTS

```
┌─────────────────────────┬──────────────────────────────────────────┐
│ TABLA EN TU BD          │ CAMPOS DESDE ENDPOINTS                   │
├─────────────────────────┼──────────────────────────────────────────┤
│ periodos                │ • clave_periodo (desde /api/periodo)     │
│                         │ • fecha_inicio, fecha_fin                │
│                         │ • activo (desde /api/periodo/actual)     │
├─────────────────────────┼──────────────────────────────────────────┤
│ carreras                │ • clave_carrera (desde /api/carreras)    │
│                         │ • nombre, vigente                        │
├─────────────────────────┼──────────────────────────────────────────┤
│ aulas                   │ • id_aula_externo (desde /api/aulas)     │
│                         │ • nombre, capacidad, tipo                │
├─────────────────────────┼──────────────────────────────────────────┤
│ grupos                  │ • clave_grupo (desde /api/grupos)        │
│                         │ • nombre, capacidad_alumnos, turno       │
│                         │ • clave_periodo (relación)               │
├─────────────────────────┼──────────────────────────────────────────┤
│ profesores              │ • id_profesor_externo (sistema externo)  │
│                         │ • nombre, email                          │
│                         │ • id_carrera (para validar licenciatura) │
├─────────────────────────┼──────────────────────────────────────────┤
│ materias_grupo          │ • clave_materia (desde /api/horarios/    │
│                         │   {periodo}/grupo/{idGrupo}/materias)    │
│                         │ • nombre_materia, id_profesor_titular    │
├─────────────────────────┼──────────────────────────────────────────┤
│ horarios_clases         │ • dia_semana, hora_inicio, hora_fin      │
│ (CRÍTICA)               │   (desde /api/horarios/{periodo}/...)    │
│                         │ • id_profesor, id_aula, id_materia_grupo │
│                         │ • es_ingles (identificar automáticamente)│
├─────────────────────────┼──────────────────────────────────────────┤
│ examenes                │ • id_aula (desde /api/aulas/buscarlibres)│
│ (Tu creación)           │ • fecha_examen, hora_inicio, hora_fin    │
│                         │   (calculados por tu algoritmo)          │
│                         │ • id_profesor_aplicador (validado con    │
│                         │   horarios_clases)                       │
└─────────────────────────┴──────────────────────────────────────────┘
```

---