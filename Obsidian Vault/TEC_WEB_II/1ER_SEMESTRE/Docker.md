Plataforma de software que permite a los desarrolladores crear, implementar y ejecutar aplicaciones dentro de contenedores 
**Contenedores:**  unidades ligeras y portátiles que incluyen todo lo necesario para ejecutar una aplicación de manera consistente en cualquier entorno
### ¿Porque Docker?
#### Portabilidad
- Los contenedores pueden ejecutarse en cualquier máquina con Docker instalado.
- Ej. Un contenedor que funciona en la computadora de un desarrollador funcionará igual en un servidor de producción.
#### Escalabilidad
- Facilita el despliegue y la escalabilidad de aplicaciones, permitiendo la orquestación con herramientas como Kubernetes.
- Ej. Una aplicación puede escalar rápidamente de uno a muchos contenedores para manejar el aumento del tráfico1
#### Eficiencia
- Los contenedores son ligeros
- comparten el kernel del sistema operativo, reduciendo el uso de recursos en comparación con las máquinas virtuales.
#### Consistencia
- Garantiza que las aplicaciones funcionen de la misma manera en todos los entornos
- Ej. Los desarrolladores pueden crear entornos de prueba que sean idénticos a los de producción.
### Conceptos
#### Contenedor
- instancias ejecutables de una imagen de Docker.
- Ej. Un contenedor que ejecuta una aplicación web con todas sus dependencias.
#### Imagen
- Una plantilla de solo lectura utilizada para crear contenedores.
- Las imágenes se pueden versionar y reutilizar.
- Ej. Una imagen de Docker que contiene un servidor web Nginx configurado.
#### Dockerfile
- archivo de texto con un conjunto de instrucciones para construir una imagen.
- Define qué se incluirá en la imagen y cómo se configurará.
- Ej. Un Dockerfile que especifica una imagen base de Ubuntu y las instrucciones para instalar Node.js.
#### Docker Hub
- Un registro en línea donde los desarrolladores pueden almacenar y compartir imágenes de Docker.
- Hay imágenes oficiales y de la comunidad.
- Ej. Descargar una imagen de MySQL desde Docker Hub para usar en un proyecto.

#### 1