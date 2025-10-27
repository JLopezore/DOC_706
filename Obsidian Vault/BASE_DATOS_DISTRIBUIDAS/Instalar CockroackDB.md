**Instalar CockroackDB**  
  
```bash  
# Descargar el binario de CockroachDB (ejemplo para Linux/amd64)  
wget https://binaries.cockroachdb.com/cockroach-latest.linux-amd64.tgz  
  
# Descomprimir el archivo  
tar -xzf cockroach-latest.linux-amd64.tgz  
  
# Copiar el binario a un directorio en tu PATH para poder ejecutar 'cockroach' fácilmente  
sudo cp cockroach-latest.linux-amd64/cockroach /usr/local/bin/  
```  
  
**Sincronización de Tiempo (NTP)**  
  
Es **crítico** que el tiempo esté sincronizado entre todos los nodos del clúster (la diferencia no debe exceder los 500 ms). Instala y verifica un servicio como **NTP** o **Chrony**.  
  
```  
# Ejemplo para instalar Chrony en sistemas basados en Debian/Ubuntu  
sudo apt install chrony  
# O en sistemas basados en RHEL/CentOS  
sudo yum install chrony  
```  
  
  
**Inicializar el primer nodo**  
  
```bash  
mkdir cockroach-data  
cockroach start \  
--insecure \  
--store=cockroach-data \  
--listen-addr=132.18.53.78 \  
--advertise-addr=132.18.53.78 \  
--join=132.18.53.78,132.18.53.79,132.18.53.80,132.18.53.66 \  
--background  
cockroach init --insecure --host=132.18.53.78  
```  
  
  
**Inicializar satelites**  
  
```bash  
mkdir cockroach-data  
cockroach start \  
--insecure \  
--store=cockroach-data \  
--listen-addr=132.18.53.91 \  
--advertise-addr=132.18.53.91 \  
--join=132.18.53.78 \  
--background  
```  
  
```bash  
mkdir cockroach-data  
cockroach start \  
--insecure \  
--store=cockroach-data \  
--listen-addr=132.18.53.80 \  
--advertise-addr=132.18.53.80 \  
--join=132.18.53.78 \  
--background  
```  
  
```bash  
mkdir cockroach-data  
cockroach start \  
--insecure \  
--store=cockroach-data \  
--listen-addr=132.18.53.66 \  
--advertise-addr=132.18.53.66 \  
--join=132.18.53.78 \  
--background  
```  
Conectar local 
```
cockroach sql --insecure --host=<IP_DEL_NODO>  
```  
  
En el navegador  
http://132.18.53.78:8080

## Conectar por SSH
```
