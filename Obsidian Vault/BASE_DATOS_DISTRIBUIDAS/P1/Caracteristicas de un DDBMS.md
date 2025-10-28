`tags: #db #distribuidos #arquitectura #MOC`

## [[Sistemas de Administración de Bases de Datos Distribuidas (DDBMS)]]

El objetivo principal de un [[DDBMS]] es operar como un sistema de administración de bases de datos centralizado, pero de forma **transparente** para el usuario. El usuario no debe ser consciente de que los datos están [[Fragmentación de Datos|fragmentados]] y [[Replicación de Datos|replicados]] en múltiples nodos.

Para lograr esta [[Transparencia en DDBMS|transparencia]], el sistema debe gestionar internamente un conjunto complejo de funciones.

### 1. 📈 Procesamiento y Optimización de Consultas

Esta capa se encarga de recibir la consulta del usuario (ej. SQL) y encontrar la forma más eficiente de ejecutarla a través de los diferentes nodos de la red.

- **[[Interfaces]]**: La capa de API (ej. SQL, drivers JDBC/ODBC) que recibe las peticiones del cliente. Debe ser idéntica a la de un sistema centralizado.
    
- **[[Validación]]**: El _parser_ que revisa la sintaxis de la consulta (que el SQL esté bien escrito) y la semántica (que las tablas y columnas existan).
    
- **[[Transformación]]**: El proceso de reescribir la consulta del usuario en una consulta interna más eficiente o que se pueda ejecutar en paralelo.
    
- **[[Mapeo]]** (Mapeo de Datos): El componente que sabe _dónde_ están los datos. Consulta el [[Catálogo Global]] para traducir las tablas lógicas (lo que el usuario ve) a los fragmentos físicos (los pedazos de datos en cada nodo).
    
- **[[Optimización de Consultas]]**: Este es el "cerebro" del DDBMS. Decide _dónde_ ejecutar cada parte de la consulta (qué datos mover, dónde hacer los _joins_) para minimizar el costo de red y el tiempo de respuesta.
    

### 2. 🔀 Gestión de Transacciones y Concurrencia

Asegura la consistencia de los datos (propiedades [[ACID]]) aunque las operaciones ocurran en múltiples máquinas al mismo tiempo.

- **[[Manejo de Transacciones]]**: Coordina el inicio (`BEGIN`), confirmación (`COMMIT`) o anulación (`ROLLBACK`) de una transacción. En un DDBMS, esto a menudo requiere protocolos como el [[Commit de Dos Fases (2PC)]].
    
- **[[Control de Concurrencia]]**: Evita que dos transacciones interfieran entre sí y corrompan los datos. Utiliza mecanismos como bloqueo (`locking`) o control de concurrencia multiversión ([[MVCC]]).
    

### 3. 💾 Capa de Almacenamiento y Administración

Gestiona la salud del clúster, la persistencia de los datos y la protección contra fallos.

- **[[Interfaz de E/S]]** (Entrada/Salida): El componente de bajo nivel en _cada nodo_ que físicamente lee y escribe los datos en el disco.
    
- **[[Administración de Base de Datos]]**: Tareas del DBA, como monitorear la salud del clúster, balancear los datos si un nodo se llena ([[rebalanceo]]) y gestionar la configuración del sistema.
    
- **[[Seguridad]]**: Gestiona la [[Autenticación]] (quién eres) y [[Autorización]] (qué puedes hacer). En un DDBMS, esto también incluye la seguridad de la red (cifrado en tránsito) y el cifrado de datos en reposo en cada nodo.
    
- **[[Respaldo y Recuperación]]** (Backup and Recovery): Es mucho más complejo que en un sistema centralizado. Debe ser capaz de crear un _snapshot_ consistente de _todo_ el clúster y restaurarlo después de un desastre (ej. fallo de múltiples nodos).
    
- **[[Formateo]]**: (Formateo de Resultados) Una vez que los datos se obtienen de múltiples nodos, este componente los ensambla, ordena y "formatea" en el conjunto de resultados único que el usuario espera recibir.