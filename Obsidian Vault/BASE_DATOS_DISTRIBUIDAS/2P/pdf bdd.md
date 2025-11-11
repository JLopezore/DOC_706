# Gestores de Bases de Datos Objeto-Relacionales (SGBDOR)
**Unidad 7 - Acceso a Datos**

---

## 1. Introducción a SGBDOR

### ¿Qué es un SGBDOR?

Un **Sistema Gestor de Bases de Datos Objeto-Relacional (SGBDOR)** combina dos tecnologías fundamentales:

- **Tecnología Relacional**: Tablas, relaciones, SQL estándar
- **Tecnología de Objetos**: Encapsulación, herencia, polimorfismo

También conocido como **ORDBMS** (Object-Relational Database Management System)

### Ejemplos de SGBDOR

- Oracle Database (desde la versión 8i)
- PostgreSQL
- IBM DB2
- Microsoft SQL Server (versiones recientes)

---

## 2. Evolución del Paradigma

### Modelo Tradicional (Relacional)

**Separación total**: Los datos y los procedimientos están completamente separados.

```
┌─────────────┐ ┌──────────────────┐
│ DATOS       │ │ PROCEDIMIENTOS   │
│ (Tablas BD) │ │ (Aplicación)     │
└─────────────┘ └──────────────────┘
```

### Modelo Orientado a Objetos

**Unidad autocontenida**: Los datos y procedimientos se combinan en una entidad reutilizable.

```
┌──────────────────────────┐
│ OBJETO                   │
│ ┌────────────────────┐   │
│ │ Datos              │   │
│ └────────────────────┘   │
│ ┌────────────────────┐   │
│ │ Procedimientos     │   │
│ │ (Métodos)          │   │
│ └────────────────────┘   │
└──────────────────────────┘
```

---

## 3. Ventajas del Modelo Objeto-Relacional

### ✓ Encapsulación

El comportamiento es parte de la entidad misma, permitiendo:

- **Reutilización**: Las entidades se pueden usar en diferentes contextos
- **Predictibilidad**: Comportamiento consistente y conocido
- **Mantenimiento**: Cambios centralizados en la definición del objeto

### ✓ Relaciones Muchos a Muchos

Primer modelo que soporta nativamente relaciones M:N sin tablas intermedias explícitas.

⚠ **Cuidado**: Diseñar con precaución para evitar pérdidas de información.

### ✓ Tipos Complejos

Posibilidad de crear tipos de datos personalizados (**UDT** - User Defined Types).

---

## 4. Limitaciones y Consideraciones

### Navegación vs Consultas Ad Hoc

#### Bases de Datos Orientadas a Objetos (BDOO):
- Naturaleza **navegacional**
- Acceso a datos a través de relaciones predefinidas
- ❌ No apropiadas para consultas ad hoc complejas

#### Bases de Datos Relacionales:
- Consultas declarativas (SQL)
- ✓ Excelentes para consultas ad hoc
- Relaciones creadas "al vuelo" con JOIN

#### Bases de Datos Objeto-Relacionales:
- **Híbrido**: Mantienen ventajas del modelo relacional
- ✓ Soporte para consultas SQL complejas
- ✓ Capacidad de usar objetos como tipos de datos

---

## 5. Formas de Incorporar Objetos

### A. SGBD Orientados a Objetos Puros

Basados completamente en el modelo OO (ejemplos: ObjectDB, db4o).

### B. SGBD Híbridos u Objeto-Relacionales ⭐

SGBD relacionales que permiten almacenar objetos en sus tablas

Dos implementaciones principales:

#### 1. Objetos como Dominios (Tipos de Columna)

```
┌──────────────────────────────────┐
│ TABLA EMPLEADOS                  │
├─────────┬────────┬───────────────┤
│ ID      │ Nombre │ Dirección     │
│ INTEGER │ VARCHAR│ TIPO_OBJETO   │
├─────────┼────────┼───────────────┤
│ 1       │ Juan   │ {Calle: "...",│
│         │        │  Ciudad: ".."}│
└─────────┴────────┴───────────────┘
```

#### 2. Tablas de Objetos

Cada fila es un objeto completo con todos sus atributos y métodos.

---

## 6. Implicaciones del Uso de Clases como Dominios

### Implicación 1: Múltiples Valores en una Columna

- **Posible**: Un objeto puede contener múltiples atributos.
- **Restricción**: Solo un objeto por celda (mantiene atomicidad del modelo relacional).

### Implicación 2: Procedimientos en las Relaciones

Los objetos llevan consigo sus métodos (comportamiento), permitiendo:

- Validaciones automáticas
- Cálculos encapsulados
- Lógica de negocio en la base de datos

---

## 7. Implementación en Oracle

### 7.1 Crear un Tipo de Objeto Simple

```sql
-- Definir un tipo de objeto para Dirección
CREATE OR REPLACE TYPE tipo_direccion AS OBJECT (
    calle VARCHAR2(100),
    numero NUMBER,
    ciudad VARCHAR2(50),
    codigo_postal VARCHAR2(10),
    -- Método para obtener dirección completa
    MEMBER FUNCTION direccion_completa RETURN VARCHAR2
);
/

-- Implementar el método
CREATE OR REPLACE TYPE BODY tipo_direccion AS
    MEMBER FUNCTION direccion_completa RETURN VARCHAR2 IS
    BEGIN
        RETURN calle || ' ' || numero || ', ' ||
               codigo_postal || ' ' || ciudad;
    END;
END;
/
```

### 7.2 Usar el Tipo como Columna

```sql
-- Crear tabla usando el tipo objeto
CREATE TABLE empleados (
    id_empleado NUMBER PRIMARY KEY,
    nombre VARCHAR2(100),
    direccion tipo_direccion,
    salario NUMBER(10,2)
);

-- Insertar datos
INSERT INTO empleados VALUES (
    1,
    'Juan Pérez',
    tipo_direccion('Calle Mayor', 25, 'Madrid', '28013'),
    3000.00
);

-- Consultar usando el método del objeto
SELECT
    nombre,
    e.direccion.direccion_completa() AS direccion_completa
FROM empleados e;
```

### 7.3 Tipo Objeto con Herencia en Oracle

```sql
-- Tipo base: Persona
CREATE OR REPLACE TYPE tipo_persona AS OBJECT (
    nombre VARCHAR2(100),
    fecha_nacimiento DATE,
    MEMBER FUNCTION edad RETURN NUMBER,
    MEMBER FUNCTION info RETURN VARCHAR2
) NOT FINAL;
/

CREATE OR REPLACE TYPE BODY tipo_persona AS
    MEMBER FUNCTION edad RETURN NUMBER IS
    BEGIN
        RETURN TRUNC(MONTHS_BETWEEN(SYSDATE, fecha_nacimiento) / 12);
    END;
    
    MEMBER FUNCTION info RETURN VARCHAR2 IS
    BEGIN
        RETURN nombre || ' (' || edad() || ' años)';
    END;
END;
/

-- Tipo derivado: Empleado
CREATE OR REPLACE TYPE tipo_empleado UNDER tipo_persona (
    num_empleado NUMBER,
    departamento VARCHAR2(50),
    OVERRIDING MEMBER FUNCTION info RETURN VARCHAR2
);
/

CREATE OR REPLACE TYPE BODY tipo_empleado AS
    OVERRIDING MEMBER FUNCTION info RETURN VARCHAR2 IS
    BEGIN
        RETURN 'Emp #' || num_empleado || ': ' ||
               nombre || ' - ' || departamento;
    END;
END;
/
```

### 7.4 Tablas de Objetos en Oracle

```sql
-- Crear tabla de objetos
CREATE TABLE tabla_empleados OF tipo_empleado;

-- Insertar objetos completos
INSERT INTO tabla_empleados VALUES (
    tipo_empleado('María García', DATE '1990-05-15', 1001, 'Ventas')
);

-- Consultar
SELECT e.info() FROM tabla_empleados e;
```

### 7.5 Colecciones (VARRAY y Nested Tables)

```sql
-- Definir un tipo colección
CREATE OR REPLACE TYPE tipo_telefono AS OBJECT (
    tipo VARCHAR2(20),
    numero VARCHAR2(15)
);
/

CREATE OR REPLACE TYPE lista_telefonos AS TABLE OF tipo_telefono;
/

-- Usar en una tabla
CREATE TABLE contactos (
    id NUMBER PRIMARY KEY,
    nombre VARCHAR2(100),
    telefonos lista_telefonos
) NESTED TABLE telefonos STORE AS tabla_telefonos;

-- Insertar con múltiples teléfonos
INSERT INTO contactos VALUES (
    1,
    'Pedro López',
    lista_telefonos(
        tipo_telefono('Móvil', '612345678'),
        tipo_telefono('Trabajo', '915551234'),
        tipo_telefono('Casa', '918887766')
    )
);

-- Consultar la colección
SELECT c.nombre, t.tipo, t.numero
FROM contactos c, TABLE(c.telefonos) t;
```

---

## 8. Implementación en PostgreSQL

### 8.1 Crear un Tipo Compuesto

```sql
-- Definir un tipo compuesto para Dirección
CREATE TYPE direccion AS (
    calle VARCHAR(100),
    numero INTEGER,
    ciudad VARCHAR(50),
    codigo_postal VARCHAR(10)
);

-- Crear tabla usando el tipo
CREATE TABLE empleados (
    id_empleado SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    direccion direccion,
    salario NUMERIC(10,2)
);

-- Insertar datos
INSERT INTO empleados (nombre, direccion, salario) VALUES (
    'Ana Martínez',
    ROW('Avenida Libertad', 42, 'Barcelona', '08001')::direccion,
    3500.00
);

-- Consultar componentes del tipo
SELECT
    nombre,
    (direccion).calle,
    (direccion).ciudad
FROM empleados;
```

### 8.2 Funciones para Tipos Compuestos

```sql
-- Crear función que trabaja con el tipo
CREATE OR REPLACE FUNCTION direccion_completa(dir direccion)
RETURNS TEXT AS $$
BEGIN
    RETURN dir.calle || ' ' || dir.numero || ', ' ||
           dir.codigo_postal || ' ' || dir.ciudad;
END;
$$ LANGUAGE plpgsql;

-- Usar la función
SELECT
    nombre,
    direccion_completa(direccion) AS direccion_formateada
FROM empleados;
```

### 8.3 Herencia de Tablas en PostgreSQL

```sql
-- Tabla padre
CREATE TABLE personas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    fecha_nacimiento DATE
);

-- Tabla hija que hereda de personas
CREATE TABLE empleados_pg (
    num_empleado INTEGER,
    departamento VARCHAR(50),
    salario NUMERIC(10,2)
) INHERITS (personas);

-- Insertar en tabla hija
INSERT INTO empleados_pg (nombre, fecha_nacimiento, num_empleado, departamento, salario)
VALUES ('Carlos Ruiz', '1985-03-20', 2001, 'IT', 4000.00);

-- Consultar solo empleados
SELECT * FROM ONLY empleados_pg;

-- Consultar todas las personas (incluye empleados)
SELECT * FROM personas;
```

### 8.4 Arrays en PostgreSQL

```sql
-- Tabla con arrays
CREATE TABLE proyectos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    tecnologias TEXT[],
    miembros_equipo INTEGER[]
);

-- Insertar con arrays
INSERT INTO proyectos (nombre, tecnologias, miembros_equipo) VALUES
('Sistema Web', ARRAY['Java', 'Spring', 'PostgreSQL'], ARRAY[1, 3, 5]),
('App Móvil', ARRAY['React Native', 'Node.js'], ARRAY[2, 4]);

-- Consultar arrays
SELECT
    nombre,
    tecnologias[1] AS tecnologia_principal,
    array_length(miembros_equipo, 1) AS num_miembros
FROM proyectos;

-- Buscar en arrays
SELECT nombre
FROM proyectos
WHERE 'Java' = ANY(tecnologias);
```

### 8.5 JSON y JSONB (Objetos Complejos)

```sql
-- Tabla con columna JSONB
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    especificaciones JSONB
);

-- Insertar datos JSON
INSERT INTO productos (nombre, especificaciones) VALUES
('Laptop', '{"marca": "Dell", "ram": 16, "procesador": "Intel i7", "pantalla": {"tamaño": 15.6, "resolucion": "1920x1080"}}'),
('Smartphone', '{"marca": "Samsung", "ram": 8, "camara": {"principal": 48, "frontal": 12}}');

-- Consultar datos JSON
SELECT
    nombre,
    especificaciones->>'marca' AS marca,
    especificaciones->'pantalla'->>'tamaño' AS tamaño_pantalla
FROM productos;

-- Buscar en JSON
SELECT nombre
FROM productos
WHERE especificaciones @> '{"marca": "Dell"}';

-- Actualizar parte del JSON
UPDATE productos
SET especificaciones = jsonb_set(
    especificaciones,
    '{ram}',
    '32'
)
WHERE nombre = 'Laptop';
```

### 8.6 Domains (Dominios Personalizados)

```sql
-- Crear un dominio con validación
CREATE DOMAIN email AS VARCHAR(255)
CHECK (VALUE ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$');

CREATE DOMAIN precio_positivo AS NUMERIC(10,2)
CHECK (VALUE > 0);

-- Usar dominios
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    email email, -- Valida automáticamente formato email
    descuento precio_positivo
);

-- Esto fallará por email inválido
INSERT INTO clientes (nombre, email, descuento)
VALUES ('Juan', 'correo-invalido', 50.00); -- ERROR

-- Esto funcionará
INSERT INTO clientes (nombre, email, descuento)
VALUES ('Juan', 'juan@example.com', 50.00); -- OK
```

---

## 9. Comparación Oracle vs PostgreSQL

| Característica | Oracle | PostgreSQL |
|----------------|--------|------------|
| Tipos Definidos Usuario | `CREATE TYPE ... AS OBJECT` | `CREATE TYPE ... AS` |
| Métodos en Tipos | ✓ Soportado con TYPE BODY | ⚠ Funciones externas |
| Herencia de Tipos | ✓ Con UNDER | ⚠ Limitado |
| Herencia de Tablas | ❌ No nativo | ✓ INHERITS |
| Colecciones | VARRAY, Nested Tables | ARRAY nativo |
| Objetos complejos | Object Types | JSONB, hstore |
| Polimorfismo | ✓ OVERRIDING | ⚠ Limitado |
| Tablas de Objetos | `CREATE TABLE ... OF` | No directamente |

---

## 10. Caso Práctico Completo

### Escenario: Sistema de Gestión Académica

#### Implementación en Oracle

```sql
-- 1. Definir tipos base
CREATE OR REPLACE TYPE tipo_calificacion AS OBJECT (
    asignatura VARCHAR2(100),
    nota NUMBER(4,2),
    MEMBER FUNCTION aprobado RETURN VARCHAR2
);
/

CREATE OR REPLACE TYPE BODY tipo_calificacion AS
    MEMBER FUNCTION aprobado RETURN VARCHAR2 IS
    BEGIN
        IF nota >= 5 THEN
            RETURN 'APROBADO';
        ELSE
            RETURN 'SUSPENSO';
        END IF;
    END;
END;
/

-- 2. Colección de calificaciones
CREATE OR REPLACE TYPE lista_calificaciones AS TABLE OF tipo_calificacion;
/

-- 3. Tipo estudiante
CREATE OR REPLACE TYPE tipo_estudiante AS OBJECT (
    nombre VARCHAR2(100),
    edad NUMBER,
    calificaciones lista_calificaciones,
    MEMBER FUNCTION promedio RETURN NUMBER,
    MEMBER FUNCTION total_aprobadas RETURN NUMBER
);
/

CREATE OR REPLACE TYPE BODY tipo_estudiante AS
    MEMBER FUNCTION promedio RETURN NUMBER IS
        v_suma NUMBER := 0;
        v_count NUMBER := 0;
    BEGIN
        IF calificaciones IS NOT NULL THEN
            FOR i IN 1..calificaciones.COUNT LOOP
                v_suma := v_suma + calificaciones(i).nota;
                v_count := v_count + 1;
            END LOOP;
            IF v_count > 0 THEN
                RETURN ROUND(v_suma / v_count, 2);
            END IF;
        END IF;
        RETURN 0;
    END;
    
    MEMBER FUNCTION total_aprobadas RETURN NUMBER IS
        v_count NUMBER := 0;
    BEGIN
        IF calificaciones IS NOT NULL THEN
            FOR i IN 1..calificaciones.COUNT LOOP
                IF calificaciones(i).nota >= 5 THEN
                    v_count := v_count + 1;
                END IF;
            END LOOP;
        END IF;
        RETURN v_count;
    END;
END;
/

-- 4. Crear tabla y datos
CREATE TABLE estudiantes OF tipo_estudiante
NESTED TABLE calificaciones STORE AS tabla_calificaciones;

INSERT INTO estudiantes VALUES (
    tipo_estudiante(
        'Laura Sánchez',
        20,
        lista_calificaciones(
            tipo_calificacion('Matemáticas', 8.5),
            tipo_calificacion('Física', 7.0),
            tipo_calificacion('Química', 6.5),
            tipo_calificacion('Historia', 4.5)
        )
    )
);

-- 5. Consultas avanzadas
SELECT
    e.nombre,
    e.promedio() AS nota_media,
    e.total_aprobadas() AS asignaturas_aprobadas
FROM estudiantes e;
```

#### Implementación en PostgreSQL

```sql
-- 1. Definir tipos
CREATE TYPE calificacion AS (
    asignatura VARCHAR(100),
    nota NUMERIC(4,2)
);

-- 2. Crear tabla
CREATE TABLE estudiantes_pg (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    edad INTEGER,
    calificaciones calificacion[]
);

-- 3. Funciones auxiliares
CREATE OR REPLACE FUNCTION calificacion_aprobada(nota NUMERIC)
RETURNS TEXT AS $$
BEGIN
    IF nota >= 5 THEN
        RETURN 'APROBADO';
    ELSE
        RETURN 'SUSPENSO';
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION promedio_estudiante(califs calificacion[])
RETURNS NUMERIC AS $$
DECLARE
    suma NUMERIC := 0;
    calif calificacion;
BEGIN
    IF array_length(califs, 1) IS NULL THEN
        RETURN 0;
    END IF;
    
    FOREACH calif IN ARRAY califs LOOP
        suma := suma + calif.nota;
    END LOOP;
    
    RETURN ROUND(suma / array_length(califs, 1), 2);
END;
$$ LANGUAGE plpgsql;

-- 4. Insertar datos
INSERT INTO estudiantes_pg (nombre, edad, calificaciones) VALUES
('Laura Sánchez', 20, ARRAY[
    ROW('Matemáticas', 8.5),
    ROW('Física', 7.0),
    ROW('Química', 6.5),
    ROW('Historia', 4.5)
]::calificacion[]);

-- 5. Consultas
SELECT
    nombre,
    promedio_estudiante(calificaciones) AS nota_media,
    (SELECT COUNT(*) FROM unnest(calificaciones) c WHERE c.nota >= 5) AS aprobadas
FROM estudiantes_pg;
```

---

## 11. Ventajas y Desventajas del Modelo O-R

### ✅ Ventajas

1. **Reutilización**: Tipos y objetos definidos una vez, usados muchas veces
2. **Encapsulación**: Lógica de negocio cerca de los datos
3. **Modelado rico**: Mejor representación de entidades del mundo real
4. **Compatibilidad SQL**: Mantiene todas las capacidades relacionales
5. **Consultas complejas**: JOIN y operaciones relacionales disponibles
6. **Extensibilidad**: Fácil agregar nuevos tipos y comportamientos

### ⚠ Desventajas

1. **Complejidad**: Mayor curva de aprendizaje
2. **Performance**: Los objetos pueden ser más lentos que tipos simples
3. **Portabilidad**: Implementaciones varían entre SGBD
4. **Overhead**: Mayor uso de memoria y almacenamiento
5. **Debugging**: Más difícil depurar errores en métodos
6. **Mantenimiento**: Cambios en tipos pueden requerir reconstrucción

---

## 12. Buenas Prácticas

### 📋 Diseño de Tipos

1. **Mantén los tipos simples**: No abusar de la complejidad
2. **Un propósito por tipo**: Responsabilidad única
3. **Documenta métodos**: Especialmente los complejos
4. **Valida en constructores**: Asegurar integridad desde creación

### 🔧 Implementación

1. **Usa índices apropiados**: Incluso en columnas de objetos
2. **Considera el rendimiento**: Evaluar antes de usar objetos complejos
3. **Normalización**: Aún aplica a nivel de diseño
4. **Migración gradual**: No convertir todo a objetos de golpe

### 🧪 Pruebas

1. **Prueba métodos individualmente**: Unit testing de funciones
2. **Verifica tipos**: Asegurar compatibilidad de datos
3. **Performance testing**: Comparar con implementación relacional

---

## 13. Conclusiones

### El Futuro de las BD Objeto-Relacionales

- No reemplazan completamente las BD relacionales tradicionales
- **Coexisten**: Usar según las necesidades del proyecto
- **Evolución continua**: PostgreSQL y Oracle siguen mejorando capacidades OO
- **Casos de uso específicos**: Excelentes para dominios complejos

### ¿Cuándo usar SGBDOR?

#### ✓ Sí, cuando:

- Dominio con objetos complejos naturales
- Necesitas encapsular lógica de negocio
- Reutilización de tipos en múltiples tablas
- Relaciones jerárquicas complejas

#### ✗ No, cuando:

- Modelo de datos simple
- Performance crítica en consultas masivas
- Equipo sin experiencia en OO
- Portabilidad estricta entre SGBD

---

## 14. Recursos Adicionales

### Documentación Oficial

- **Oracle**: Object-Relational Developer's Guide
- **PostgreSQL**: User-Defined Types

### Lecturas Recomendadas

- "Object-Relational DBMSs" - Michael Stonebraker
- "SQL:1999 Understanding Object-Relational and Other Advanced Features"

### Práctica

- Implementar sistema de biblioteca con tipos de objetos
- Comparar rendimiento: relacional puro vs objeto-relacional
- Migrar una BD existente a modelo O-R

---

## Fin de la Presentación

### Preguntas y Discusión

**Temas para profundizar:**

- Polimorfismo en bases de datos
- Optimización de consultas con objetos
- Patrones de diseño O-R
- Casos de estudio reales

---

*Unidad 7 - Gestores de Bases de Datos Objeto-Relacionales*  
*Material educativo basado en contenidos de Acceso a Datos*