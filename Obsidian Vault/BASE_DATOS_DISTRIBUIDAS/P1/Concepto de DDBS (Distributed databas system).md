`tags: #db #distribuidos #MOC`

## [[Base de Datos Distribuida (BDD)]]

Una **Base de Datos Distribuida (BDD)** es una colección de múltiples bases de datos lógicamente interconectadas que se encuentran físicamente distribuidas en una red de computadoras.

El sistema que gestiona esta colección es el [[Sistemas de Administración de Bases de Datos Distribuidas (DDBMS)]].

### Características Clave

#### 1. Integración Lógica

A diferencia de solo acceder a múltiples bases de datos distintas, la BDD se diseña de manera que parezca ser **una única base de datos** para el usuario. Esto se llama [[Transparencia en DDBMS|transparencia]].

#### 2. Transparencia de Distribución

El usuario final interactúa con la BDD como si todos los datos estuvieran almacenados en un solo lugar central. El [[DDBMS]] se encarga internamente de toda la complejidad, incluyendo:

- **[[Fragmentación de Datos]]**: Dividir la base de datos en partes (fragmentos). Puede ser horizontal (filas), vertical (columnas) o mixta.
    
- **[[Asignación de Datos]]**: Decidir en qué nodo de la red almacenar cada fragmento.
    
- **[[Replicación de Datos]]**: Copiar fragmentos en múltiples nodos para mejorar la disponibilidad (tolerancia a fallos) y el rendimiento de las lecturas.
    

> [!note] Nota de Conexión La **fragmentación** y la **asignación** son la base del [[Mapeo]] de datos. El [[Optimización de Consultas|Optimizador de Consultas]] debe conocer este mapa para decidir cómo y dónde ejecutar una consulta que involucra datos de múltiples fragmentos.

#### 3. Coordinación y Control

El [[DDBMS]] actúa como el coordinador central (o un conjunto de coordinadores) que gestiona las operaciones globales, garantizando la integridad de los datos a pesar de la distribución.

- Garantiza la **consistencia** de los datos (especialmente de las réplicas) usando protocolos de [[Control de Concurrencia]].
    
- Maneja las **transacciones** que involucran a múltiples sitios, asegurando la atomicidad (o todo o nada) a través del [[Manejo de Transacciones]] (ej. _Commit de Dos Fases_).
    

#### 4. Homogeneidad y Heterogeneidad

Los sistemas distribuidos se pueden clasificar según el software que usan sus nodos:

- **[[Sistemas Homogéneos]]**: Todos los sitios (nodos) usan el mismo software de SGBD (ej. todos son PostgreSQL o todos son CockroachDB).
    
- **[[Sistemas Heterogéneos]]**: Los sitios pueden usar diferentes SGBD (ej. un nodo usa Oracle, otro MySQL y otro PostgreSQL). En este caso, el [[DDBMS]] actúa como un **[[Middleware]]** para unificar el acceso, lo cual es mucho más complejo.
    

### Diseño Intencional: Integración vs. Conexión

> La analogía de "unir el acceso de múltiples bases de datos en una sola base de datos distribuida" es correcta en el **objetivo para el usuario (la transparencia)**, pero incorrecta si implica que simplemente se agrega una capa por encima de bases de datos preexistentes y no relacionadas.
> 
> Una BDD generalmente implica un **diseño intencional** de cómo se dividen, almacenan y acceden los datos a través de la red para que actúen como una única entidad. Se trata de **integración** y **cohesión**, no solo de **conexión**.