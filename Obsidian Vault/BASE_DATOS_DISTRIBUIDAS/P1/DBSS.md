# Introducción

> Distributed Database System (DDBS)

Un DDBS une dos enfoques: sistemas de bases de datos y redes de computadoras. Cambia el paradigma centralizado, permitiendo almacenar y gestionar datos en múltiples ubicaciones de forma coordinada, manteniendo la independencia lógica y física para que las aplicaciones accedan a los datos sin preocuparse por su ubicación.

La integración de datos puede lograrse sin centralización; ese es el objetivo de las bases de datos distribuidas: ofrecer una visión unificada, fiable y eficiente sobre datos físicamente dispersos.

## Objetivos de un DDBS

- [[Transparencia en DDBMS|Transparencia]] (localización, fragmentación, replicación, fallas).
- Independencia de datos (lógica y física).
- Alta disponibilidad y tolerancia a fallos.
- Escalabilidad horizontal (nodos y almacenamiento).
- Rendimiento mediante paralelismo y colocación de datos.
- Seguridad end-to-end (autenticación, autorización, cifrado, auditoría).
- Gobernanza y metadatos (catálogo global, políticas).

## Procesamiento de datos distribuido

- **Planificación distribuida**: Descomposición de consultas en subplanes que se ejecutan cerca de los datos.
- **Ejecución paralela**: Operadores distribuidos (scan, join, aggregate) con envío mínimo de datos.
- **Movilidad de datos controlada**: Empuje de filtros/proyecciones; redistribuciones por clave de join.
- **Transacciones**: Protocolos como [[Commit de Dos Fases (2PC)]], control de concurrencia ([[MVCC]], bloqueos).
- **Replicación**: Sincrónica para consistencia fuerte; asíncrona para latencias bajas de lectura.
- **Recuperación**: Reconfiguración tras fallos, reelección/líderes (cuando aplica), replay de logs.

## Modelos y topologías

- **Shared-nothing** (común en SQL distribuido moderno): Nodos autónomos coordinados por protocolo.
- **Sharding**: Fragmentación horizontal por clave; balance y rebalanceo automáticos preferibles.
- **Federación**: Integración de múltiples BDs con autonomía local (heterogeneidad más alta).
- **Maestro-réplica / multi-líder**: Esquemas de replicación que afectan latencia y consistencia.

## Comparativa con alternativas

- **Sistema centralizado**: Sencillo, pero con límites de disponibilidad, escalabilidad y cercanía al usuario.
- **Cachés y réplicas sólo-lectura**: Mejoran latencia, pero no ofrecen transacciones distribuidas completas.
- **ETL/ELT y lakes**: Integración analítica, no OLTP transaccional distribuido.

## Términos clave (referencias)

- [[Sistemas de Administración de Bases de Datos Distribuidas (DDBMS)]]
- [[Fragmentación de Datos]], [[Replicación de Datos]], [[Asignación de Datos]], [[Mapeo]]
- [[Optimización de Consultas]], [[Control de Concurrencia]], [[Manejo de Transacciones]]
- [[Seguridad]], [[Respaldo y Recuperación]], [[Catálogo Global]]