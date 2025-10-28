`tags: #db #distribuidos #MOC`

# Concepto de DDBS (Distributed Database System)

Una **Base de Datos Distribuida (BDD)** es una colección de múltiples bases de datos lógicamente interconectadas que se encuentran físicamente distribuidas en una red de computadoras.

El sistema que gestiona esta colección es el [[Sistemas de Administración de Bases de Datos Distribuidas (DDBMS)]]. El conjunto completo (la BDD + el software que la gestiona) se conoce como **DDBS**.

## Definiciones relacionadas

- **BDD (Base de Datos Distribuida)**: Conjunto lógico único de datos que, físicamente, está en múltiples nodos.
- **DDBMS**: Software que ofrece a usuarios y aplicaciones la ilusión de un sistema único, ocultando la distribución física y gestionando transacciones, consultas, replicación y metadatos.
- **DDBS**: El sistema completo, que incluye la BDD y el DDBMS.

## Características clave

### 1) Integración lógica (visión única)
La BDD se diseña para parecer **una única base de datos** para el usuario. Esto se llama [[Transparencia en DDBMS|transparencia]].

### 2) Transparencia de distribución
El usuario interactúa como si todos los datos estuvieran en un solo lugar. El [[DDBMS]] oculta la complejidad, incluyendo:
- **[[Fragmentación de Datos]]**: División en fragmentos (horizontal, vertical, mixta).
- **[[Asignación de Datos]]**: Dónde vive cada fragmento.
- **[[Replicación de Datos]]**: Copias para disponibilidad y rendimiento.

> [!note] Nota de Conexión
> La **fragmentación** y la **asignación** son la base del [[Mapeo]] de datos. El [[Optimización de Consultas|Optimizador de Consultas]] usa este mapa para planificar consultas multi-fragmento y multi-sitio.

Tipos comunes de transparencia:
- De localización (el usuario no sabe en qué nodo están los datos).
- De fragmentación (el usuario consulta tablas lógicas; el sistema combina fragmentos).
- De replicación (el usuario no ve copias; el sistema elige una).
- De acceso e idioma (misma API/SQL).
- De fallas (manejo de fallos sin intervención del usuario).
- De rendimiento (reparto de carga/planificación sin cambios en la app).
- De heterogeneidad (cuando aplica; ver más abajo).

### 3) Coordinación y control
El [[DDBMS]] coordina operaciones globales para garantizar integridad pese a la distribución:
- **Consistencia y concurrencia** con [[Control de Concurrencia]] (bloqueos, [[MVCC]]).
- **Transacciones distribuidas** con [[Manejo de Transacciones]] (p. ej., [[Commit de Dos Fases (2PC)]]). En algunos diseños, consenso para réplicas (p. ej., Raft/Paxos) y, cuando aplica, 3PC.

### 4) Homogeneidad vs heterogeneidad
- **[[Sistemas Homogéneos]]**: Todos los nodos usan el mismo SGBD.
- **[[Sistemas Heterogéneos]]**: Nodos con SGBD distintos; el [[DDBMS]] actúa como [[Middleware]], elevando la complejidad (mapeos de tipos, dialectos SQL, semánticas de transacción).

## Diseño intencional: integración vs conexión

> El objetivo es la **transparencia** para el usuario, pero no significa “poner una capa” encima de BDs inconexas.
> 
> Una BDD implica un **diseño intencional** de cómo se fragmentan, asignan, replican y consultan los datos para operar como una sola entidad. Se trata de **integración** y **cohesión**, no solo de **conexión**.

## Arquitectura de alto nivel

- **Coordinadores**: Reciben consultas, planifican, orquestan transacciones y consolidan resultados.
- **Nodos de datos**: Almacenan fragmentos y/o réplicas; ejecutan operaciones locales; mantienen índices y logs.
- **Catálogo global**: Metadatos sobre esquemas, fragmentos, ubicaciones y réplicas.
- **Red**: Transporte confiable y seguro; cifrado en tránsito; control de tiempo/latencia.

## Ejemplo breve

- Tabla lógica `clientes` fragmentada horizontalmente por región (`Norte`, `Sur`, `Este`, `Oeste`).
- Réplicas asíncronas para lectura en cada región y una réplica síncrona de alta disponibilidad.
- Un SELECT global hace “union” de fragmentos y el planificador empuja filtros a cada nodo para minimizar tráfico.

## Comparación rápida: BDD vs BD federada

- **BDD**: Un único sistema lógico con esquema global y control integral de transacciones y metadatos.
- **Federada**: Conecta BDs preexistentes y heterogéneas; transparencia parcial; coordinación más laxa; ideal para integración entre dominios.