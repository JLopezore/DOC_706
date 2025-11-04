## Ventajas

- Transparencia
  - Fragmentación: El usuario opera con tablas lógicas; el sistema une fragmentos.
  - Replicación: Lecturas cercanas y resiliencia sin cambiar la aplicación.
  - Independencia de datos: Cambios físicos sin romper consultas.
  - Lenguaje: Una misma interfaz (p. ej., SQL) pese a la distribución.
  - Red: El DDBMS gestiona latencia, fallos y reintentos.
- Fiabilidad
  - Replicación, quorum/consenso (cuando aplica), recuperación automática.
- Rendimiento
  - Paralelismo y colocación de datos; pushdown de filtros, joins locales.
- Escalabilidad
  - Agregar nodos para capacidad de cómputo/almacenamiento.
- Proximidad
  - Datos cerca de consumidores (multi-región) para menor latencia.
- Continuidad del negocio
  - Failover orquestado, backups consistentes, RPO/RTO controlados.
- Gobernanza y seguridad
  - Catálogo global, políticas centralizadas, auditoría.

## Desventajas

- Factores que complican los DDBS
  - Replicación de datos: Elección síncrona/asíncrona, conflictos, lag.
  - Complejidad: Planificación distribuida, metadatos, orquestación de fallos.
  - Costo: Infraestructura de red y nodos adicionales, observabilidad.
  - Distribución del control: Coordinación, consenso, reloj/logical clocks.
  - Seguridad: Superficie de ataque mayor, gestión de claves multi-nodo.
- Problemas de Área
  - Diseño: [[Fragmentación de Datos]] y [[Asignación de Datos]] óptimas no triviales.
  - Procesamiento de consultas: [[Optimización de Consultas]] con costos de red.
  - Gestión de Directorios/Metadatos: [[Catálogo Global]] consistente y disponible.
  - Control de concurrencia: [[MVCC]]/bloqueos/aislamientos distribuidos.
  - Gestión de bloqueos (deadlocks): Detección y resolución multi-sitio.
  - Fiabilidad del [[DDBMS]]: Protocolos de recuperación, compatibilidad de versiones.
  - Soporte del Sistema Operativo/Red: Timeouts, MTU, reloj, DNS, TLS.
  - Bases de datos Heterogéneas: Mapeo de tipos/dialectos, semánticas de commit.

## Cuándo usar un DDBS

- Requisitos multi-región o cercanía al usuario.
- Alta disponibilidad con SLAs exigentes.
- Crecimiento horizontal sostenido de datos y tráfico.
- Necesidad de una visión única sobre datos dispersos.

## Cuándo reconsiderar

- Latencias de red excesivas, anchos de banda limitados.
- Dominio estrictamente local o monolítico con bajo volumen.
- Tolerancia a consistencia eventual sin necesidad de transacciones globales (otros modelos pueden bastar).