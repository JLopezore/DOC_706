Una **Base de Datos Distribuida (BDD)** es una colección de múltiples bases de datos lógicamente interconectadas que se encuentran físicamente distribuidas en una red de computadoras.

### Características Clave

1. **Integración Lógica:** A diferencia de solo acceder a múltiples bases de datos distintas, la BDD se diseña de manera que parezca ser **una única base de datos** para el usuario. Esto se llama **transparencia de distribución**.
2. **Transparencia de Distribución:** El usuario final interactúa con la BDD como si todos los datos estuvieran almacenados en un solo lugar central. El **Sistema de Gestión de Bases de Datos Distribuidas (SGBDD)** se encarga de:
    - **Fragmentación:** Dividir la base de datos en partes (fragmentos).
    - **Asignación:** Decidir dónde almacenar cada fragmento (en qué nodo de la red).
    - **Replicación:** Copiar fragmentos en múltiples nodos para mejorar la disponibilidad y el rendimiento.
3. **Control Centralizado de la Distribución:** Sí existe un sistema de gestión (el SGBDD) que **coordina** las operaciones, garantiza la **consistencia** (que los datos sean correctos en todos los nodos) y maneja las **transacciones** que pueden involucrar a múltiples sitios. Esto es lo que quizás llamas el "controlador corazón".
4. **Homogeneidad/Heterogeneidad:**
    - **Homogéneas:** Todos los sitios usan el mismo SGBD.
    - **Heterogéneas:** Los sitios pueden usar diferentes SGBD (por ejemplo, un nodo usa Oracle y otro usa PostgreSQL). En este caso, el SGBDD actúa como un **_middleware_** para unificar el acceso.


La analogía de "unir el acceso de múltiples bases de datos en una sola base de datos distribuida" es correcta en el **objetivo para el usuario (la transparencia)**, pero incorrecta si implica que simplemente se agrega una capa por encima de bases de datos preexistentes y no relacionadas.

Una BDD generalmente implica un **diseño intencional** de cómo se dividen, almacenan y acceden los datos a través de la red para que actúen como una única entidad. Se trata de **integración** y **cohesión**, no solo de **conexión**.