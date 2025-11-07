## Unidad 7 - Acceso a Datos

---

## 1. Introducción a SGBDOR

### ¿Qué es un SGBDOR?

Un **Sistema Gestor de Bases de Datos Objeto-Relacional (SGBDOR)** combina dos tecnologías fundamentales:

- **Tecnología Relacional:** Tablas, relaciones, SQL estándar
- **Tecnología de Objetos:** Encapsulación, herencia, polimorfismo

También conocido como **ORDBMS (Object-Relational Database Management System)**.

### Ejemplos de SGBDOR

- Oracle Database (desde la versión 8i)
- PostgreSQL
- IBM DB2
- Microsoft SQL Server (versiones recientes)

---

## 2. Evolución del Paradigma

### Modelo Tradicional (Relacional)

Separación total: los datos y los procedimientos están completamente separados.

### Modelo Orientado a Objetos

Los **objetos** combinan datos y comportamiento en una misma entidad reutilizable.

```
┌─────────────┐   ┌──────────────────┐
│    DATOS    │   │  PROCEDIMIENTOS  │
│ (Tablas BD) │   │   (Aplicación)   │
└─────────────┘   └──────────────────┘

┌──────────────────────────┐
│          OBJETO          │
│  Datos + Comportamiento  │
└──────────────────────────┘
```

---

## 3. Ventajas del Modelo Objeto-Relacional

### ✓ Encapsulación

El comportamiento es parte de la entidad misma, permitiendo:

- Reutilización
- Predictibilidad
- Mantenimiento centralizado
    

### ✓ Relaciones Muchos a Muchos

Soporte nativo para relaciones M:N sin tablas intermedias explícitas.  
**Advertencia:** diseñar con cuidado para evitar pérdidas de información.

### ✓ Tipos Complejos

Permite crear tipos de datos personalizados (**UDT – User Defined Types**).

---

## 4. Limitaciones y Consideraciones

### Navegación vs Consultas Ad Hoc

**BD Orientadas a Objetos (BDOO):**

- Naturaleza navegacional
    
- No adecuadas para consultas ad hoc
    

**BD Relacionales:**

- Consultas declarativas SQL
    
- Excelentes para consultas dinámicas
    

**BD Objeto-Relacionales:**

- Híbrido
    
- Consultas SQL complejas
    
- Uso de objetos como tipos de datos
    

---

## 5. Formas de Incorporar Objetos

### A. SGBD Orientados a Objetos Puros

Basados completamente en el modelo OO (ejemplo: **ObjectDB**, **db4o**).

### B. SGBD Híbridos u Objeto-Relacionales

SGBD relacionales que almacenan objetos en tablas.

#### Dos implementaciones principales:

1. Objetos como **Dominios** (tipos de columna)
    
2. **Tablas de Objetos**: cada fila representa un objeto completo.
    

```
┌──────────────────────────────────┐
│           TABLA EMPLEADOS        │
├─────────┬────────┬───────────────┤
│ ID      │ Nombre │ Dirección     │
│ INTEGER │ VARCHAR│ TIPO_OBJETO   │
└─────────┴────────┴───────────────┘
```

---

## 6. Implicaciones del Uso de Clases como Dominios

1. **Múltiples Valores en una Columna:**
    
    - Un objeto puede contener varios atributos.
        
    - Solo un objeto por celda (mantiene atomicidad).
        
2. **Procedimientos en las Relaciones:**
    
    - Métodos integrados para validaciones y cálculos.
        

---

## 7. Implementación en Oracle

### 7.1 Crear un Tipo de Objeto Simple

```sql
CREATE OR REPLACE TYPE tipo_direccion AS OBJECT (
  calle VARCHAR2(100),
  numero NUMBER,
  ciudad VARCHAR2(50),
  codigo_postal VARCHAR2(10),
  MEMBER FUNCTION direccion_completa RETURN VARCHAR2
);
/
CREATE OR REPLACE TYPE BODY tipo_direccion AS
  MEMBER FUNCTION direccion_completa RETURN VARCHAR2 IS
  BEGIN
    RETURN calle || ' ' || numero || ', ' || codigo_postal || ' ' || ciudad;
  END;
END;
/
```

### 7.2 Uso del Tipo como Columna

```sql
CREATE TABLE empleados (
  id_empleado NUMBER PRIMARY KEY,
  nombre VARCHAR2(100),
  direccion tipo_direccion,
  salario NUMBER(10,2)
);

INSERT INTO empleados VALUES (
  1,
  'Juan Pérez',
  tipo_direccion('Calle Mayor', 25, 'Madrid', '28013'),
  3000.00
);

SELECT nombre, e.direccion.direccion_completa() AS direccion_completa
FROM empleados e;
```

---

### 7.3 Herencia en Oracle

```sql
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
    RETURN TRUNC(MONTHS_BETWEEN(SYSDATE, fecha_nacimiento)/12);
  END;
  MEMBER FUNCTION info RETURN VARCHAR2 IS
  BEGIN
    RETURN nombre || ' (' || edad() || ' años)';
  END;
END;
/

CREATE OR REPLACE TYPE tipo_empleado UNDER tipo_persona (
  num_empleado NUMBER,
  departamento VARCHAR2(50),
  OVERRIDING MEMBER FUNCTION info RETURN VARCHAR2
);
/
CREATE OR REPLACE TYPE BODY tipo_empleado AS
  OVERRIDING MEMBER FUNCTION info RETURN VARCHAR2 IS
  BEGIN
    RETURN 'Emp #' || num_empleado || ': ' || nombre || ' - ' || departamento;
  END;
END;
/
```

---

## 8. Implementación en PostgreSQL

### 8.1 Crear un Tipo Compuesto

```sql
CREATE TYPE tipo_telefono AS (
  tipo VARCHAR(20),
  numero VARCHAR(15)
);

CREATE TYPE lista_telefonos AS TABLE OF tipo_telefono;

CREATE TABLE contactos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100),
  telefonos lista_telefonos
) NESTED TABLE telefonos STORE AS tabla_telefonos;
```

---

### 8.2 Funciones y Herencia

```sql
CREATE TYPE direccion AS (
  calle VARCHAR(100),
  numero INTEGER,
  ciudad VARCHAR(50),
  codigo_postal VARCHAR(10)
);

CREATE TABLE empleados (
  id_empleado SERIAL PRIMARY KEY,
  nombre VARCHAR(100),
  direccion direccion,
  salario NUMERIC(10,2)
);

INSERT INTO empleados (nombre, direccion, salario)
VALUES (
  'Ana Martínez',
  ROW('Avenida Libertad', 42, 'Barcelona', '08001')::direccion,
  3500.00
);

SELECT nombre, (direccion).calle, (direccion).ciudad
FROM empleados;
```

---

## 9. Comparación Oracle vs PostgreSQL

|Característica|Oracle|PostgreSQL|
|---|---|---|
|Tipos Definidos por Usuario|`CREATE TYPE ... AS OBJECT`|`CREATE TYPE ... AS`|
|Métodos en Tipos|✓ con `TYPE BODY`|⚠ Funciones externas|
|Herencia de Tipos|✓ `UNDER`|⚠ Limitado|
|Herencia de Tablas|❌ No nativo|✓ `INHERITS`|
|Colecciones|VARRAY, Nested Tables|ARRAY nativo|
|Objetos Complejos|Object Types|JSONB, hstore|
|Polimorfismo|✓ `OVERRIDING`|⚠ Limitado|
|Tablas de Objetos|`CREATE TABLE ... OF`|No directamente|

---

## 11. Ventajas y Desventajas del Modelo O-R

### Ventajas

1. Reutilización de tipos y objetos
    
2. Encapsulación de lógica de negocio
    
3. Modelado más rico y natural
    
4. Compatibilidad con SQL
    
5. Consultas complejas disponibles
    
6. Extensibilidad
    

### Desventajas

1. Complejidad de diseño
    
2. Menor rendimiento en algunos casos
    
3. Falta de portabilidad
    
4. Mayor consumo de recursos
    
5. Dificultad para depurar
    
6. Dependencia del SGBD
    

---

## 12. Buenas Prácticas

### Diseño

- Mantén tipos simples
    
- Responsabilidad única
    
- Documenta métodos complejos
    
- Valida en constructores
    

### Implementación

- Usa índices adecuados
    
- Evalúa rendimiento
    
- Aplica normalización
    
- Migra gradualmente
    

### Pruebas

- Prueba métodos de forma unitaria
    
- Verifica compatibilidad de tipos
    
- Mide rendimiento comparativo
    

---

## 13. Conclusiones

- No reemplazan completamente las BD relacionales.
    
- Coexisten según necesidades del proyecto.
    
- PostgreSQL y Oracle siguen evolucionando sus capacidades OO.
    
- Recomendadas para dominios con estructuras complejas o jerárquicas.
    

### Cuándo usar SGBDOR

**Sí, cuando:**

- El dominio tiene objetos complejos
    
- Se requiere encapsular lógica
    
- Se busca reutilización de tipos
    
- Hay jerarquías de datos
    

**No, cuando:**

- El modelo de datos es simple
    
- Se necesita máxima velocidad
    
- El equipo no domina el paradigma OO
    

---

## 14. Recursos Adicionales

**Documentación Oficial:**

- Oracle: _Object-Relational Developer’s Guide_
    
- PostgreSQL: _User-Defined Types_
    

**Lecturas Recomendadas:**

- _Object-Relational DBMSs_ – Michael Stonebraker
    
- _SQL:1999 Understanding Object-Relational and Other Advanced Features_
    

**Práctica sugerida:**

- Implementar un sistema de biblioteca con tipos de objetos
    
- Comparar rendimiento relacional vs O-R
    
- Migrar una BD existente al modelo objeto-relacional
    
