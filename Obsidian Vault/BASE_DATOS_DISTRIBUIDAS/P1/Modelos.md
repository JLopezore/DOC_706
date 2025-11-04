## Clasificación de Sistemas de Bases de Datos Distribuidas (DDBMS)

### **1. Autonomía**

| Nivel | Descripción                            |
| :---- | :------------------------------------- |
| **0** | Integración total (sin autonomía)      |
| **1** | Semiautonomía                          |
| **2** | Aislamiento total (autonomía completa) |

---

### **2. Distribución**

| Nivel | Descripción                               |
| :---- | :---------------------------------------- |
| **0** | No hay distribución                       |
| **1** | Arquitectura Cliente–Servidor             |
| **2** | Distribución punto a punto (Peer-to-Peer) |

---

### **3. Heterogeneidad**

|Nivel|Descripción|
|:--|:--|
|**0**|Sistema homogéneo|
|**1**|Sistema heterogéneo|

---

## **Ejemplos de Combinaciones (A–D–H)**

| Código       | Descripción                                                  |
| :----------- | :----------------------------------------------------------- |
| **A0–D0–H0** | Sistema compuesto                                            |
| **A0–D0–H1** | Sistema con múltiples sistemas de datos                      |
| **A0–D1–H0** | Arquitectura Cliente–Servidor                                |
| **A0–D2–H0** | Todos los nodos con el mismo nivel jerárquico                |
| **A1–D0–H0** | Sistema autónomo o federado                                  |
| **A1–D0–H1** | Sistema semi-autónomo y heterogéneo                          |
| **A1–D1–H1** | DDBMS heterogéneo y federado                                 |
| **A2–D0–H0** | Sistema completamente autónomo                               |
| **A2–D0–H1** | Sistema autónomo y heterogéneo                               |
| **A2–D2–H1** | DDBMS totalmente autónomo y heterogéneo (distribución total) |

### DBMS -> Cliente servidor 

#### Cliente-Servidor (Client-Server)

En este modelo, la aplicación de base de datos se divide en dos partes principales:

Servidor de Base de Datos (Database Server): Es un programa central que gestiona los datos, procesa las consultas (queries) y se encarga de las tareas esenciales del DBMS, como la seguridad, el respaldo y la concurrencia. Reside en una máquina potente.

Clientes (Clients): Son aplicaciones o interfaces de usuario que se ejecutan en otras máquinas (o la misma). Envían solicitudes (consultas o comandos) al servidor para recuperar o manipular datos. El servidor ejecuta la solicitud y envía los resultados de vuelta al cliente.

**Características:***

- Centralización: Los datos se almacenan y gestionan centralmente en el servidor.

- Escalabilidad: Se puede escalar el poder del servidor de forma independiente al número de clientes.

- Rendimiento: El servidor, al ser una máquina dedicada, puede optimizar el procesamiento de las consultas.

- Seguridad: Es más fácil controlar y asegurar el acceso a los datos desde un punto central.

#### DBMS -> Peer to peer

Peer-to-Peer (P2P)

En un DBMS con arquitectura P2P, no hay un servidor central dedicado. En cambio, cada nodo (computadora, o peer) en la red actúa simultáneamente como cliente y servidor para los demás.

Características clave:

Descentralización: El control y, a menudo, los datos se distribuyen entre múltiples nodos.

Tolerancia a Fallos: Si un nodo falla, la red puede seguir operando con los nodos restantes.

Distribución de Carga: La carga de trabajo se reparte entre todos los participantes.

# Fragmentación en DDBMS

> Fuente: [Notes Station - Fragmentation in DDBMS](https://notes-station.blogspot.com/2018/05/fragmentation-in-ddbms.html)

---
## Definición
La **fragmentación** es el proceso de dividir una tabla grande en múltiples tablas más pequeñas llamadas **fragmentos** dentro de un sistema de base de datos distribuida (**DDBMS**).  
Su objetivo es **mejorar el rendimiento, la disponibilidad y la localización de los datos**.

> Requisito clave: los fragmentos deben permitir **reconstruir la tabla original** (propiedad de *reconstructividad*).

---

## Tipos de Fragmentación

### 1. Fragmentación Horizontal
- Divide la tabla **por filas (tuplas)**.  
- Cada fragmento contiene todas las columnas originales, pero sólo un subconjunto de registros.  
- Se basa en una **condición lógica** sobre los atributos.

**Ejemplo:**
```sql
SELECT * FROM STUDENT WHERE Course = 'Computer Science';
````

**Resultado:** un fragmento con los estudiantes del curso de informática.

**Ventaja:** reduce el volumen de datos manejado por cada sitio.

---

### 2. Fragmentación Vertical

- Divide la tabla **por columnas (atributos)**.
- Cada fragmento debe incluir la **clave primaria** para permitir la reconstrucción de la tabla completa.
- Facilita la **seguridad** al poder aislar columnas sensibles.

**Ejemplo:**

```text
Fragmento 1: (Regd_No, Name, Course, Semester)
Fragmento 2: (Regd_No, Fees, Marks)
```

**Ventaja:** los datos sensibles o de uso limitado pueden mantenerse separados.

---

### 3. Fragmentación Híbrida (Mixta)

- Combina fragmentación **horizontal y vertical**.
- Se puede aplicar en cualquier orden:
    - Primero horizontal y luego vertical.
    - O viceversa.

**Ventaja:** mayor flexibilidad.  
**Desventaja:** mayor complejidad en la reconstrucción.

---

## Ventajas de la Fragmentación

- **Eficiencia:** los datos se almacenan cerca del sitio donde se usan.
- **Consultas locales:** muchas operaciones no requieren acceso remoto.
- **Seguridad:** cada nodo sólo contiene los datos necesarios.
- **Escalabilidad:** los fragmentos se pueden manejar y replicar de forma independiente.

---

## Desventajas de la Fragmentación

- **Coste de reconstrucción:** unir fragmentos puede requerir alto procesamiento.
- **Latencia:** si una consulta necesita datos de varios fragmentos, aumenta el tráfico.
- **Riesgo de pérdida:** si no hay copias distribuidas, puede perderse información en caso de falla.
- **Gestión compleja:** el control y optimización de fragmentos puede ser difícil.

---

# Que es federado

Un **sistema de bases de datos federadas** (Federated Database System, FDBS) es un modelo para conectar varias bases de datos independientes, que pueden ser distintas entre sí, de modo que aparenten funcionar como una sola para el usuario, sin tener que combinar todas físicamente.

# BD Particionada

Los datos se dividen en partes mas pequeñas (particiones) cada parte se almacena en un nodo

# BD Hibrida

Combina bd particionadas y federadas, son autónomas y cooperan entre si y las particionadas que están distribuidas en nodos diferentes

# BD Replicada
Las copias se almacenan en múltiples nodos para proporcionar disponibilidad y tolerancia a fallos

# Aplicaciones de las BD distribuidas

- **Balanceo de carga**
- **Distribución global de datos** (mejora la latencia)
- **Escalabilidad eficiente** (horizontal:agregar mas nodos(?) , vertical(?))
- **Localidad de datos y cumplimiento**
- **Alta disponibilidad y tolerancia a fallos**
- **Rendimiento**

# ASCID

- **Atomicidad**
- **Consistencia**
- **Aislamiento**
- **Durabilidad**

Para aplicaciones que requieran información congruente y actualizada
Para apps banacarias,etc

# BASE

- **Basically Available**
- **Soft State**
- **Eventually consistency**

Aplicaciones escalables que toleren inconsistencia
Para redes sociales, big data, etc






