Este es un resumen completo del documento, presentado en formato Markdown (estilo Obsidian) para facilitar el estudio y la comprensión de los temas clave de las Bases de Datos Distribuidas (DDB).

---

# 📚 Bases de Datos Distribuidas (DDB)

## I. Fundamentos y Definiciones

### ¿Qué son las Bases de Datos Distribuidas (DDB)?

- Una DDB es una base de datos tradicional **dividida en diferentes partes físicamente dispersas**.
- Se accede a ella de forma lógica, de manera similar a cómo se accede a una base de datos centralizada.

### Sistema de Administración de Bases de Datos Distribuidas (DDBMS)

- El DDBMS rige el **almacenamiento y procesamiento de datos lógicamente relacionados** a través de sistemas de computadoras interconectadas.
- Las funciones de datos y procesamiento se **distribuyen entre varios sitios**.
- **Requisito clave:** Un DDBMS debe realizar todas las funciones de un sistema centralizado, más las funciones impuestas por la distribución, y realizar estas funciones **transparentemente para el usuario**.

---

## II. Componentes del DDBMS (Peter Rob, 2004)

El DDBMS debe incluir (por lo menos) los siguientes componentes:

- **Estaciones de trabajo (sitios y nodos):** Forman el sistema de red y deben ser **independientes del hardware**.
- **Componentes de software y hardware** en cada estación: Permiten la interacción e intercambio de datos.
- **Medios de comunicación:** Transportan los datos. El DDBMS debe ser **independiente de los medios de comunicación**.
- **Procesador de Transacciones (TP/AP/TM):** Software en la computadora que **solicita datos**. Recibe y procesa solicitudes (remotas y locales).
- **Procesador de Datos (DP/DM):** Software que **guarda y recupera datos** localizados en el sitio. Puede ser un DBM centralizado.

---

## III. Funciones esenciales del DDBMS

Para ser considerado distribuido, un DDBMS debe contar con las siguientes características:

- **Validación y Transformación:** Analiza solicitudes y determina si son distribuidas o locales.
- **Optimización de consultas:** Encuentra la mejor estrategia de acceso (qué fragmentos acceder y cómo sincronizar actualizaciones).
- **Mapeo:** Determina la ubicación de los fragmentos de datos (locales y remotos).
- **Control de concurrencia:** Maneja el acceso simultáneo para garantizar la **consistencia** de los datos a través de los fragmentos.
- **Manejo de transacciones:** Garantiza que los datos pasen de un estado consistente a otro. Incluye la sincronización de transacciones locales y remotas.
- **Seguridad** y **Respaldo y recuperación**.

---

## IV. Ventajas de los DDBMS

Los DDBMS ofrecen varias ventajas frente a los sistemas tradicionales:

- **Localidad de Datos:** Los datos se sitúan cerca del sitio de "mayor demanda", mejorando el rendimiento.
- **Acceso y Procesamiento más rápido:** Los usuarios acceden a subconjuntos de datos guardados localmente. El procesamiento se reparte en varios sitios.
- **Facilitación del crecimiento:** Se pueden añadir nuevos sitios a la red con relativa facilidad y rapidez sin afectar las operaciones.
- **Costos de operación reducidos:** Es más económico añadir estaciones de trabajo a una red que actualizar un _mainframe_.
- **Tolerancia a fallos:** **Menos peligro de falla en un solo punto**. Si un nodo falla, la carga de trabajo es absorbida por otras estaciones.
- **Independencia del procesador:** Las solicitudes pueden ser procesadas por cualquier procesador disponible en la ubicación de los datos.

---

## V. Los 12 Objetivos de C. J. Date (1987)

Estos objetivos describen una base de datos **totalmente distribuida** y constituyen una meta útil de diseño:

1. **Independencia del sitio local:** Cada sitio actúa como un DBMS centralizado, autónomo.
2. **Independencia del sitio central:** Ningún sitio depende de un sitio central; todos tienen las mismas capacidades.
3. **Independencia de fallas:** El sistema sigue operando incluso si un nodo falla.
4. **Transparencia de ubicación:** El usuario ve solo una BD lógica y no necesita saber la ubicación de los datos.
5. **Transparencia de fragmentación:** El usuario no necesita conocer el nombre de los fragmentos para recuperarlos.
6. **Transparencia de replicación:** El DDBMS selecciona y maneja los fragmentos de manera transparente ante el usuario.
7. **Procesamiento de consulta distribuida:** Las consultas se ejecutan en varios sitios, y la optimización es transparente.
8. **Procesamiento de transacciones distribuidas:** Una transacción puede actualizar datos en varios sitios.
9. **Independencia del hardware**.
10. **Independencia del sistema operativo**.
11. **Independencia de la red**.
12. **Independencia de la base de datos:** Debe soportar productos de BD de cualquier proveedor.

---

## VI. Modelos Arquitectónicos en DDBMS

Los modelos se clasifican en tres dimensiones principales:

### 1. Dimensiones de Clasificación

|Dimensión|Enfoque|
|:--|:--|
|**Autonomía**|Grado de independencia del control de cada sitio.|
|**Distribución**|Distribución física de datos (fragmentos o réplicas).|
|**Heterogeneidad**|Diferencias entre modelos de datos, software de DBMS o hardware.|

### 2. Clasificación según la Autonomía

- **Sistema Centralizado (Sin autonomía):** Un solo sitio de control; la gestión se hace desde un único nodo.
- **Tightly Coupled (Autonomía parcial):** Nodos cooperan bajo un mismo control de transacciones y catálogo global.
- **Sistema Federado (Autonomía alta):** Cada BD mantiene su control local, pero colabora para la integración lógica (capa de federación).

### 3. Clasificación según la Heterogeneidad

- **Homogéneas:** Todos los nodos usan el **mismo SGBD** y modelo de datos.
- **Heterogéneas:** Nodos usan **diferentes SGBD** (e.g., Oracle, MongoDB) o modelos de datos distintos; requiere traductores.

### 4. Clasificación según la Distribución

- **No distribuidas:** Todos los datos en un solo sitio.
- **Parcialmente distribuidas:** Alguna fragmentación o replicación, pero coordinación central.
- **Totalmente distribuidas:** Todos los nodos son autónomos y contienen fragmentos de datos. Coordinación colaborativa.

### 5. Modelos Arquitectónicos Comunes

- **Arquitectura Cliente-Servidor:** Dos niveles. El servidor gestiona datos y transacciones; el cliente maneja la interfaz.
- **Arquitectura Peer-to-Peer (P2P):** Cada nodo actúa como cliente y servidor, compartiendo recursos y cooperando.
- **Arquitectura Multi-DBMS:** Integra dos o más bases de datos autónomas, proporcionando una vista unificada sin perder la independencia local.

---

## VII. Tipos de DDB por Forma

Las DDB pueden adoptar varias formas:

- **Homogénea:** Todos los nodos usan el mismo DBMS y estructura.
- **Heterogénea:** Los nodos pueden usar diferentes DBMS y estructuras, requiriendo traducción.
- **Federada:** Múltiples BD autónomas trabajan juntas, manteniendo la independencia.
- **Particionada:** Los datos se dividen en partes más pequeñas (particiones) y se almacenan en diferentes nodos.
- **Replicada:** Copias de los datos se almacenan en múltiples nodos para **alta disponibilidad** y tolerancia a fallos. Los cambios se propagan inmediatamente para mantener la coherencia.
- **Híbrida:** Combina elementos de federadas y particionadas.

---

## VIII. Aplicaciones y Rendimiento

El **beneficio principal** de las DDB es el **balanceo de carga**, que divide la demanda elevada (transacciones o análisis) a través de múltiples instancias.

- **Escalabilidad eficiente:** Permiten la **escalabilidad horizontal** (añadir más nodos) para manejar el aumento de datos y usuarios.
- **Localidad de datos:** Almacena datos cerca de los usuarios, **reduciendo la latencia** y mejorando el rendimiento en tiempo real.
- **Cumplimiento normativo:** Permite almacenar datos en la ubicación geográfica de origen para cumplir con los requisitos regionales de residencia de datos.
- **Tolerancia a fallos:** Fundamental para cargas de trabajo críticas, ya que la replicación garantiza que los datos estén disponibles si fallan ciertos nodos.

---

## IX. Modelos de Consistencia: ACID vs. BASE

La elección del sistema distribuido depende de los requisitos de consistencia.

### 1. Bases de Datos ACID (Atomicidad, Consistencia, Aislamiento, Durabilidad)

Este modelo garantiza una alta precisión y es ideal para datos críticos.

|Característica|Descripción|
|:--|:--|
|**Atomicidad (A)**|Las operaciones se completan totalmente o no se hacen.|
|**Consistencia (C)**|La BD permanece en un estado válido.|
|**Aislamiento (I)**|Las transacciones se ejecutan independientemente.|
|**Durabilidad (D)**|Los cambios son permanentes, incluso en caso de fallos.|

- **Consistencia:** Garantizada en cada transacción.
- **Escalabilidad:** Vertical (aumenta la potencia del servidor).
- **Uso Típico:** Sistemas bancarios, comercio electrónico, registros médicos.
- **Ejemplos:** Google Cloud Spanner, CockroachDB.

### 2. Bases de Datos BASE (Basically Available, Soft state, Eventual consistency)

Este modelo prioriza la disponibilidad y escalabilidad sobre la consistencia inmediata.

|Característica|Descripción|
|:--|:--|
|**Basically Available (B)**|La BD está disponible la mayoría del tiempo.|
|**Soft state (S)**|El estado puede cambiar con el tiempo sin nuevas entradas.|
|**Eventual consistency (E)**|La consistencia se alcanza en el tiempo, **no inmediatamente**.|

- **Consistencia:** Eventual, puede variar temporalmente.
- **Escalabilidad:** Horizontal (añadir más nodos).
- **Uso Típico:** Sistemas que toleran inconsistencia temporal, Big Data, redes sociales.
- **Ejemplos:** Apache Cassandra, MongoDB.