## Índice
1. [Instalación y Comandos Útiles](#instalación-y-comandos-útiles)
2. [Configuración de Nodos](#configuración-de-nodos)
3. [Creación de Base de Datos](#creación-de-base-de-datos)
4. [Fragmentación (Sharding)](#fragmentación-sharding)
5. [Replicación y Tolerancia a Fallos](#replicación-y-tolerancia-a-fallos)

---

## Instalación y Comandos Útiles

### Instalación en Linux

```bash
# Descargar el binario de CockroachDB
wget https://binaries.cockroachdb.com/cockroach-latest.linux-amd64.tgz

# Descomprimir el archivo
tar -xzf cockroach-latest.linux-amd64.tgz

# Copiar el binario al PATH del sistema
sudo cp cockroach-latest.linux-amd64/cockroach /usr/local/bin/

# Verificar la instalación
cockroach version
```

### Comandos Útiles

| Comando                 | Descripción                          |
| ----------------------- | ------------------------------------ |
| `cockroach start`       | Inicia un nodo de CockroachDB        |
| `cockroach init`        | Inicializa el clúster                |
| `cockroach sql`         | Abre el shell SQL interactivo        |
| `cockroach node status` | Muestra el estado de todos los nodos |
| `cockroach node ls`     | Lista todos los nodos del clúster    |
| `cockroach quit`        | Detiene un nodo de forma ordenada    |
| `cockroach debug zip`   | Genera un archivo de diagnóstico     |
| `cockroach workload`    | Herramienta para pruebas de carga    |

### Acceso al Shell SQL

```bash
# Conectarse localmente
cockroach sql --insecure --host=localhost

# Conectarse a un nodo específico
cockroach sql --insecure --host=132.18.53.78

# Ejecutar un comando SQL desde la línea de comandos
cockroach sql --insecure --host=132.18.53.78 --execute="SHOW DATABASES;"
```

### Comandos SQL Útiles en CockroachDB

```sql
-- Ver todas las bases de datos
SHOW DATABASES;

-- Ver todas las tablas
SHOW TABLES;

-- Ver el estado del clúster
SHOW CLUSTER SETTING cluster.organization;

-- Ver configuración de rangos
SHOW RANGES FROM TABLE nombre_tabla;

-- Ver estadísticas de replicación
SHOW ZONE CONFIGURATIONS;

-- Ver localización de datos
SHOW EXPERIMENTAL_RANGES FROM TABLE nombre_tabla;
```

---

## Configuración de Nodos

### Requisitos Previos (en todas las máquinas)

#### 1. Sincronización de Tiempo (NTP)

**Crítico**: La diferencia de tiempo entre nodos no debe exceder 500ms.

```bash
# Instalar Chrony (Debian/Ubuntu)
sudo apt install chrony

# Instalar Chrony (RHEL/CentOS)
sudo yum install chrony

# Verificar sincronización
chronyc tracking
```

#### 2. Configuración del Firewall

| Puerto | Protocolo | Descripción |
|:------:|:---------:|:------------|
| **26257** | TCP | Puerto RPC/SQL (comunicación entre nodos y clientes) |
| **8080** | TCP | Consola de administración web |

```bash
# Ejemplo con ufw (Ubuntu)
sudo ufw allow 26257/tcp
sudo ufw allow 8080/tcp

# Ejemplo con firewalld (CentOS/RHEL)
sudo firewall-cmd --permanent --add-port=26257/tcp
sudo firewall-cmd --permanent --add-port=8080/tcp
sudo firewall-cmd --reload
```

### Topología del Clúster

**IPs del Clúster:**
- **132.18.53.78** - Nodo principal (inicio)
- **132.18.53.91** - Nodo 2
- **132.18.53.80** - Nodo 3
- **132.18.53.66** - Nodo 4

### Inicialización del Clúster

#### A. Nodo Principal (132.18.53.78)

```bash
# Crear directorio para datos
mkdir cockroach-data

# Iniciar el nodo
cockroach start \
  --insecure \
  --store=cockroach-data \
  --listen-addr=132.18.53.78 \
  --advertise-addr=132.18.53.78 \
  --join=132.18.53.78,132.18.53.91,132.18.53.80,132.18.53.66 \
  --background

# Inicializar el clúster (solo una vez)
cockroach init --insecure --host=132.18.53.78
```

#### B. Nodos Secundarios (91, 80, 66)

**En 132.18.53.91:**
```bash
mkdir cockroach-data
cockroach start \
  --insecure \
  --store=cockroach-data \
  --listen-addr=132.18.53.91 \
  --advertise-addr=132.18.53.91 \
  --join=132.18.53.78 \
  --background
```

**En 132.18.53.80:**
```bash
mkdir cockroach-data
cockroach start \
  --insecure \
  --store=cockroach-data \
  --listen-addr=132.18.53.80 \
  --advertise-addr=132.18.53.80 \
  --join=132.18.53.78 \
  --background
```

**En 132.18.53.66:**
```bash
mkdir cockroach-data
cockroach start \
  --insecure \
  --store=cockroach-data \
  --listen-addr=132.18.53.66 \
  --advertise-addr=132.18.53.66 \
  --join=132.18.53.78 \
  --background
```

### Verificación del Clúster

```bash
# Ver estado de los nodos
cockroach node status --insecure --host=132.18.53.78

# Acceder a la consola web
# Abrir navegador: http://132.18.53.78:8080
```

---

## Creación de Base de Datos

### Base de Datos de Ejemplo: Sistema de Biblioteca

```sql
-- Conectarse al clúster desde cualquier nodo
-- cockroach sql --insecure --host=132.18.53.78

-- Crear la base de datos
CREATE DATABASE biblioteca;

-- Usar la base de datos
USE biblioteca;

-- Tabla de autores
CREATE TABLE autores (
    id_autor SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    pais VARCHAR(50),
    fecha_nacimiento DATE
);

-- Tabla de libros
CREATE TABLE libros (
    id_libro SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    id_autor INT REFERENCES autores(id_autor),
    año_publicacion INT,
    genero VARCHAR(50),
    isbn VARCHAR(20) UNIQUE
);

-- Tabla de usuarios
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    fecha_registro TIMESTAMP DEFAULT NOW(),
    ciudad VARCHAR(50)
);

-- Tabla de préstamos
CREATE TABLE prestamos (
    id_prestamo SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES usuarios(id_usuario),
    id_libro INT REFERENCES libros(id_libro),
    fecha_prestamo TIMESTAMP DEFAULT NOW(),
    fecha_devolucion TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'activo'
);

-- Insertar datos de ejemplo
INSERT INTO autores (nombre, pais, fecha_nacimiento) VALUES
    ('Gabriel García Márquez', 'Colombia', '1927-03-06'),
    ('Isabel Allende', 'Chile', '1942-08-02'),
    ('Jorge Luis Borges', 'Argentina', '1899-08-24'),
    ('Octavio Paz', 'México', '1914-03-31');

INSERT INTO libros (titulo, id_autor, año_publicacion, genero, isbn) VALUES
    ('Cien años de soledad', 1, 1967, 'Realismo mágico', '978-0307474728'),
    ('La casa de los espíritus', 2, 1982, 'Ficción', '978-0553383805'),
    ('Ficciones', 3, 1944, 'Ficción', '978-0802130303'),
    ('El laberinto de la soledad', 4, 1950, 'Ensayo', '978-0140185386');

INSERT INTO usuarios (nombre, email, ciudad) VALUES
    ('Ana Martínez', 'ana@example.com', 'Madrid'),
    ('Carlos López', 'carlos@example.com', 'Barcelona'),
    ('María González', 'maria@example.com', 'Valencia'),
    ('Juan Pérez', 'juan@example.com', 'Sevilla');

INSERT INTO prestamos (id_usuario, id_libro, fecha_prestamo) VALUES
    (1, 1, '2025-10-01 10:00:00'),
    (2, 3, '2025-10-05 14:30:00'),
    (3, 2, '2025-10-10 09:15:00');
```

### Verificar desde Todos los Nodos

```bash
# Conectarse desde el nodo .79
cockroach sql --insecure --host=132.18.53.79 --execute="USE biblioteca; SELECT * FROM libros;"

# Conectarse desde el nodo .80
cockroach sql --insecure --host=132.18.53.80 --execute="USE biblioteca; SELECT * FROM autores;"

# Conectarse desde el nodo .66
cockroach sql --insecure --host=132.18.53.66 --execute="USE biblioteca; SELECT * FROM usuarios;"
```

**Resultado esperado:** Los datos deben ser visibles desde **todos** los nodos.

---

## Fragmentación (Sharding)

### Conceptos Clave

> **Importante**: CockroachDB realiza **fragmentación horizontal automática** mediante **ranges** (rangos). Cada rango contiene aproximadamente 64MB de datos y se replica automáticamente en 3 nodos por defecto.

### 1. Fragmentación Horizontal (Por Filas)

Dividir una tabla en múltiples rangos basándose en rangos de claves primarias.

#### Ejemplo: Fragmentar Usuarios por Región

```sql
-- Crear tabla con fragmentación por localidad
CREATE TABLE usuarios_regional (
    id_usuario SERIAL,
    nombre VARCHAR(100),
    email VARCHAR(100),
    ciudad VARCHAR(50),
    region VARCHAR(50),
    PRIMARY KEY (region, id_usuario)
) PARTITION BY LIST (region) (
    PARTITION europa VALUES IN ('Europa'),
    PARTITION america VALUES IN ('América'),
    PARTITION asia VALUES IN ('Asia'),
    PARTITION africa VALUES IN ('África')
);

-- Insertar datos
INSERT INTO usuarios_regional (nombre, email, ciudad, region) VALUES
    ('Pedro García', 'pedro@example.com', 'Madrid', 'Europa'),
    ('John Smith', 'john@example.com', 'New York', 'América'),
    ('Wei Chen', 'wei@example.com', 'Beijing', 'Asia'),
    ('Amara Okafor', 'amara@example.com', 'Lagos', 'África');

-- Verificar la fragmentación
SHOW RANGES FROM TABLE usuarios_regional;

-- Ver datos en cada partición
SELECT * FROM usuarios_regional WHERE region = 'Europa';
```

### 2. Fragmentación Vertical (Por Columnas)

Dividir una tabla en múltiples tablas con diferentes columnas.

#### Ejemplo: Separar Información Básica y Sensible

```sql
-- Tabla con información básica (acceso frecuente)
CREATE TABLE usuarios_basico (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    email VARCHAR(100),
    fecha_registro TIMESTAMP
);

-- Tabla con información sensible (acceso restringido)
CREATE TABLE usuarios_sensible (
    id_usuario INT PRIMARY KEY REFERENCES usuarios_basico(id_usuario),
    direccion VARCHAR(200),
    telefono VARCHAR(20),
    numero_identificacion VARCHAR(50),
    datos_bancarios VARCHAR(100)
);

-- Insertar datos
INSERT INTO usuarios_basico (nombre, email, fecha_registro) VALUES
    ('Laura Sánchez', 'laura@example.com', NOW()),
    ('Miguel Torres', 'miguel@example.com', NOW());

INSERT INTO usuarios_sensible (id_usuario, direccion, telefono) VALUES
    (1, 'Calle Principal 123', '+34-600-111-222'),
    (2, 'Avenida Central 456', '+34-600-333-444');

-- Consulta combinada
SELECT b.nombre, b.email, s.telefono
FROM usuarios_basico b
JOIN usuarios_sensible s ON b.id_usuario = s.id_usuario;
```

### 3. Fragmentación Mixta (Horizontal + Vertical)

Combinar ambas estrategias para optimización máxima.

#### Ejemplo: Sistema de Ventas Global

```sql
-- Información básica de productos (fragmentación horizontal por región)
CREATE TABLE productos_info (
    id_producto SERIAL,
    nombre VARCHAR(100),
    categoria VARCHAR(50),
    region VARCHAR(50),
    PRIMARY KEY (region, id_producto)
) PARTITION BY LIST (region) (
    PARTITION norte VALUES IN ('Norte'),
    PARTITION sur VALUES IN ('Sur'),
    PARTITION este VALUES IN ('Este'),
    PARTITION oeste VALUES IN ('Oeste')
);

-- Detalles técnicos de productos (fragmentación vertical)
CREATE TABLE productos_tecnicos (
    id_producto INT,
    region VARCHAR(50),
    especificaciones TEXT,
    dimensiones VARCHAR(50),
    peso DECIMAL(10,2),
    PRIMARY KEY (region, id_producto),
    FOREIGN KEY (region, id_producto) REFERENCES productos_info(region, id_producto)
);

-- Información de precios (fragmentación vertical)
CREATE TABLE productos_precios (
    id_producto INT,
    region VARCHAR(50),
    precio DECIMAL(10,2),
    moneda VARCHAR(10),
    descuento DECIMAL(5,2),
    PRIMARY KEY (region, id_producto),
    FOREIGN KEY (region, id_producto) REFERENCES productos_info(region, id_producto)
);

-- Insertar datos
INSERT INTO productos_info (nombre, categoria, region) VALUES
    ('Laptop Pro', 'Electrónica', 'Norte'),
    ('Smartphone X', 'Electrónica', 'Sur'),
    ('Tablet Plus', 'Electrónica', 'Este');

INSERT INTO productos_tecnicos (id_producto, region, especificaciones, peso) VALUES
    (1, 'Norte', 'Intel i7, 16GB RAM, 512GB SSD', 1.5),
    (2, 'Sur', 'Snapdragon 888, 8GB RAM, 256GB', 0.18),
    (3, 'Este', 'Apple M1, 8GB RAM, 256GB', 0.45);

INSERT INTO productos_precios (id_producto, region, precio, moneda) VALUES
    (1, 'Norte', 1299.99, 'USD'),
    (2, 'Sur', 899.99, 'USD'),
    (3, 'Este', 799.99, 'USD');

-- Consulta combinada con fragmentación mixta
SELECT 
    pi.nombre,
    pi.categoria,
    pi.region,
    pt.especificaciones,
    pp.precio,
    pp.moneda
FROM productos_info pi
JOIN productos_tecnicos pt ON pi.id_producto = pt.id_producto AND pi.region = pt.region
JOIN productos_precios pp ON pi.id_producto = pp.id_producto AND pi.region = pp.region
WHERE pi.region = 'Norte';
```

### Verificar Distribución de Fragmentos

```sql
-- Ver cómo se distribuyen los rangos en el clúster
SHOW RANGES FROM TABLE usuarios_regional;

-- Ver configuración de zonas de replicación
SHOW ZONE CONFIGURATION FOR TABLE usuarios_regional;

-- Ver estadísticas de particiones
SELECT * FROM [SHOW PARTITIONS FROM TABLE usuarios_regional];
```

---

## Replicación y Tolerancia a Fallos

###  Aclaración Importante: Mito de la Pérdida de Datos

> **MITO**: "Si un nodo se apaga, los datos guardados en ese nodo se pierden y los demás nodos pierden acceso a ese fragmento."

> **REALIDAD**: CockroachDB replica **automáticamente** cada fragmento (range) en **3 nodos** por defecto (configurable). Si un nodo falla, los otros nodos tienen copias completas de los datos.

### Arquitectura de Replicación

```
┌─────────────────────────────────────────────────┐
│  Fragmento A (rango de claves: a-m)             │
├─────────────────────────────────────────────────┤
│  Réplica 1: Nodo 78 (Líder)                    │
│  Réplica 2: Nodo 79 (Seguidor)                 │
│  Réplica 3: Nodo 80 (Seguidor)                 │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Fragmento B (rango de claves: n-z)             │
├─────────────────────────────────────────────────┤
│  Réplica 1: Nodo 79 (Líder)                    │
│  Réplica 2: Nodo 80 (Seguidor)                 │
│  Réplica 3: Nodo 66 (Seguidor)                 │
└─────────────────────────────────────────────────┘
```

### Demostración Práctica de Tolerancia a Fallos

#### Paso 1: Verificar Estado Inicial

```bash
# Ver estado de todos los nodos
cockroach node status --insecure --host=132.18.53.78
```

#### Paso 2: Insertar Datos de Prueba

```sql
-- Conectarse al nodo 78
USE biblioteca;

INSERT INTO libros (titulo, id_autor, año_publicacion, genero, isbn) VALUES
    ('Test Replication', 1, 2025, 'Prueba', '978-1234567890');
```

#### Paso 3: Apagar un Nodo

```bash
# Detener el nodo 79
cockroach quit --insecure --host=132.18.53.79
```

#### Paso 4: Verificar Acceso desde Otros Nodos

```bash
# Conectarse al nodo 80 (nodo 79 está apagado)
cockroach sql --insecure --host=132.18.53.80 \
  --execute="USE biblioteca; SELECT * FROM libros WHERE isbn = '978-1234567890';"
```

**Resultado**: Los datos siguen siendo accesibles porque están replicados en otros nodos.

#### Paso 5: Reiniciar el Nodo

```bash
# Reiniciar el nodo 79
cockroach start \
  --insecure \
  --store=cockroach-data \
  --listen-addr=132.18.53.79 \
  --advertise-addr=132.18.53.79 \
  --join=132.18.53.78 \
  --background
```

### Configurar Factor de Replicación

```sql
-- Ver configuración actual (por defecto: 3 réplicas)
SHOW ZONE CONFIGURATION FOR RANGE default;

-- Cambiar factor de replicación a 5 (requiere al menos 5 nodos)
ALTER RANGE default CONFIGURE ZONE USING num_replicas = 5;

-- Configurar replicación para una tabla específica
ALTER TABLE biblioteca.libros CONFIGURE ZONE USING num_replicas = 3;
```

### Consistencia de Datos

CockroachDB garantiza **consistencia fuerte** (strong consistency):

- **Lecturas siempre devuelven los datos más recientes**
- **Algoritmo de consenso Raft** para coordinación
- **Sin pérdida de datos confirmados** (committed writes)

```sql
-- Verificar nivel de consistencia (SERIALIZABLE por defecto)
SHOW default_transaction_isolation;

-- Forzar lectura del líder para máxima consistencia
SELECT * FROM libros AS OF SYSTEM TIME follower_read_timestamp();
```

---

## Monitoreo y Diagnóstico

### Comandos de Diagnóstico

```bash
# Ver métricas del clúster
cockroach node status --insecure --host=132.18.53.78 --format=table

# Generar reporte de diagnóstico
cockroach debug zip debug-report.zip --insecure --host=132.18.53.78

# Ver logs de un nodo
cockroach debug logs --insecure --host=132.18.53.78
```

### Consola Web (Dashboard)

Acceder a: `http://132.18.53.78:8080`

**Información disponible:**
- Métricas de rendimiento (throughput, latencia)
- Estado de salud de cada nodo
- Uso de almacenamiento y memoria
- Distribución de réplicas
- Alertas y eventos del sistema

---

## Consideraciones de Producción

### Seguridad

```bash
# Generar certificados para modo seguro
cockroach cert create-ca --certs-dir=certs --ca-key=ca.key
cockroach cert create-node localhost 132.18.53.78 --certs-dir=certs --ca-key=ca.key

# Iniciar nodo en modo seguro
cockroach start \
  --certs-dir=certs \
  --store=cockroach-data \
  --listen-addr=132.18.53.78 \
  --advertise-addr=132.18.53.78 \
  --join=132.18.53.78,132.18.53.79,132.18.53.80,132.18.53.66 \
  --background
```

### Respaldo y Recuperación

```sql
-- Crear backup completo
BACKUP DATABASE biblioteca TO 'nodelocal://1/backups/biblioteca';

-- Restaurar backup
RESTORE DATABASE biblioteca FROM 'nodelocal://1/backups/biblioteca';

-- Backup incremental
BACKUP DATABASE biblioteca TO 'nodelocal://1/backups/biblioteca' INCREMENTAL FROM LATEST;
```

---

## Recursos Adicionales

- **Documentación oficial**: https://www.cockroachlabs.com/docs/
- **Guías de arquitectura**: https://www.cockroachlabs.com/docs/stable/architecture/overview.html
- **Foro de la comunidad**: https://forum.cockroachlabs.com/

---

**Fecha de creación**: 2025-10-22  
**Versión de CockroachDB**: Latest (v23.x)