`tags: #db #distribuidos #arquitectura #MOC`

El objetivo principal de un [[DDBMS]] es operar como un sistema de administración de bases de datos centralizado, pero de forma **transparente** para el usuario. El usuario no debe ser consciente de que los datos están [[Fragmentación de Datos|fragmentados]] y [[Replicación de Datos|replicados]] en múltiples nodos.

Para lograr esta [[Transparencia en DDBMS|transparencia]], el sistema debe gestionar internamente un conjunto complejo de funciones.

## 1) Procesamiento y optimización de consultas

Recibe consultas (p. ej., SQL) y encuentra planes eficientes a través de la red.

- **[[Interfaces]]**: APIs/SQL, drivers JDBC/ODBC; equivalentes a un SGBD centralizado.
- **[[Validación]]**: Análisis sintáctico y semántico (nombres, tipos, permisos).
- **[[Transformación]]**: Reescrituras lógicas (pushing de predicados, desnormalizaciones, subconsultas a joins).
- **[[Mapeo]]**: Traducción de tablas lógicas a fragmentos físicos consultando el [[Catálogo Global]].
- **[[Optimización de Consultas]]**: Elección de ubicación y orden de operadores (joins, agregaciones), minimizando costo de red y tiempos; uso de estadísticas distribuidas.
- **Ejecución distribuida**: Operadores paralelos, redistribución por clave, broadcast selectivo, particionamiento de resultados.

## 2) Gestión de transacciones y concurrencia

Garantiza propiedades [[ACID]] en múltiples nodos.

- **[[Manejo de Transacciones]]**: `BEGIN/COMMIT/ROLLBACK` coordinados; protocolos como [[Commit de Dos Fases (2PC)]] y, en algunos sistemas, 3PC.
- **[[Control de Concurrencia]]**: Bloqueo (S/X, intención), [[MVCC]], niveles de aislamiento (SERIALIZABLE, SI, RC), prevención/detección de deadlocks.
- **Reloj y orden**: Timestamps lógicos/físicos (HLC), ordering para serialización y visibilidad.

## 3) Capa de almacenamiento y administración

Gestión de persistencia, salud y seguridad del clúster.

- **[[Interfaz de E/S]]**: Lectura/escritura física, logs de write-ahead (WAL), índices.
- **[[Administración de Base de Datos]]**: Monitoreo, alertas, [[rebalanceo]], mantenimiento de índices, upgrades sin downtime.
- **[[Seguridad]]**: [[Autenticación]] (usuarios, certificados), [[Autorización]] (roles, políticas), cifrado en tránsito y en reposo, auditoría.
- **[[Respaldo y Recuperación]]**: Snapshots consistentes a nivel clúster, PITR, planes de DR multi-región.
- **[[Formateo]]**: Ensamble y ordenamiento de resultados provenientes de múltiples nodos.

## 4) Replicación y consistencia

- **[[Replicación de Datos]]**: Síncrona (consistencia fuerte, mayor latencia) vs asíncrona (menor latencia, riesgo de lag).
- **Protocolos**: Quorum/consenso (cuando aplica) para elección de líderes y escritura segura.
- **Topologías**: Líder-seguidor, multi-líder, sin líder (dependiendo del sistema).

## 5) Metadatos y catálogo global

- **[[Catálogo Global]]**: Esquemas, fragmentos, ubicaciones, réplicas, estadísticas.
- **Coherencia del catálogo**: Replicación del catálogo, cachés coherentes, invalidación.
- **Descubrimiento**: Enrutamiento de consultas al nodo adecuado según el mapa de datos.

## 6) Topologías y despliegue

- **Shared-nothing**: Nodos simétricos, escalado horizontal, reconfiguración dinámica.
- **Particionado por rango/hash**: Claves de fragmentación, hot-spots y balanceo.
- **Multi-región**: Políticas de colocación (p. ej., por inquilino/región), latencia y conformidad.

## 7) Observabilidad y operaciones

- Métricas distribuidas (latencia por operador, ancho de banda, colas).
- Trazas distribuidas (propagación de contexto).
- Logs correlacionados y diagnósticos de planes.
- Presupuestos de error SLO/SLI, pruebas de caos, runbooks.

> [!tip] Buenas prácticas
> - Diseñar la clave de fragmentación según patrones de acceso para evitar hot-spots.
> - Empujar filtros al dato y minimizar movimientos de datos para joins.
> - Elegir replicación síncrona en rutas críticas y asíncrona en lecturas no críticas.
> - Automatizar rebalanceos y validar con pruebas de carga y fallos.