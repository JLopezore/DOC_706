## 📋 Índice
1. [Desinstalación Completa](#desinstalación-completa)
2. [Instalación Limpia](#instalación-limpia)
3. [Configuración del Clúster](#configuración-del-clúster)
4. [Recomendaciones: Inicio y Apagado de Nodos](#recomendaciones-inicio-y-apagado-de-nodos)
5. [Comandos Útiles](#comandos-útiles)

---

## Desinstalación Completa
### Ejecutar en TODAS las máquinas (.78, .91, .80, .66)

```bash
# 1. Detener todos los procesos de CockroachDB
pkill -9 cockroach

# 2. Verificar que no haya procesos corriendo
ps aux | grep cockroach

# 3. Eliminar el binario de CockroachDB
sudo rm -f /usr/local/bin/cockroach

# 4. Eliminar directorios de datos
rm -rf ~/cockroach-data
rm -rf ~/cockroach-data.backup*

# 5. Eliminar archivos de configuración y servicios (si existen)
sudo rm -f /etc/systemd/system/cockroachdb.service
sudo systemctl daemon-reload

# 6. Eliminar scripts de inicio personalizados
rm -f ~/start-cockroach.sh
rm -f ~/start-node-*.sh
rm -f ~/stop-node.sh

# 7. Eliminar archivos temporales y logs residuales
rm -rf /tmp/cockroach*
rm -rf ~/.cockroach

# 8. Verificar que todo se eliminó
ls -la ~ | grep cockroach
which cockroach  # No debería devolver nada
```

### Verificación Final

```bash
# Confirmar que cockroach no existe
cockroach version  # Debe dar error: command not found

# Verificar puertos liberados
sudo lsof -i :26257  # No debe devolver nada
sudo lsof -i :8080   # No debe devolver nada
```

---

## Instalación Limpia

### Ejecutar en TODAS las máquinas (.78, .91, .80, .66)

#### Paso 1: Descargar CockroachDB

```bash
# Ir al directorio home
cd ~

# Descargar la última versión
wget https://binaries.cockroachdb.com/cockroach-latest.linux-amd64.tgz

# Descomprimir
tar -xzf cockroach-latest.linux-amd64.tgz

# Copiar el binario al PATH del sistema
sudo cp cockroach-*/cockroach /usr/local/bin/

# Verificar instalación
cockroach version

# Limpiar archivos de instalación
rm -rf cockroach-*.tgz cockroach-v*
```

#### Paso 2: Crear Directorio de Datos

```bash
# Crear directorio para almacenar datos
mkdir ~/cockroach-data

# Verificar permisos
ls -ld ~/cockroach-data
```

#### Paso 3: Configurar Firewall

```bash
# Permitir puertos de CockroachDB
sudo ufw allow 26257/tcp comment 'CockroachDB RPC'
sudo ufw allow 8080/tcp comment 'CockroachDB Admin UI'

# Verificar reglas
sudo ufw status
```

#### Paso 4: Sincronización de Tiempo (Crítico)

```bash
# Instalar Chrony
sudo apt update
sudo apt install chrony -y

# Iniciar y habilitar el servicio
sudo systemctl start chrony
sudo systemctl enable chrony

# Verificar sincronización
chronyc tracking
```

---

## 🚀 Configuración del Clúster

### Topología del Clúster

| Máquina | IP | Tipo | Conexión |
|---------|-----|------|----------|
| Nodo 1 | 132.18.53.78 | Fija | Desktop/Servidor |
| Nodo 2 | 132.18.53.91 | Variable | Portátil |
| Nodo 3 | 132.18.53.80 | Variable | Portátil |
| Nodo 4 | 132.18.53.66 | Variable | Portátil |

### Inicialización del Clúster

#### 1️⃣ Nodo Principal (132.18.53.78) - PRIMERO

```bash
# Iniciar el nodo
cockroach start \
  --insecure \
  --store=cockroach-data \
  --listen-addr=132.18.53.78 \
  --advertise-addr=132.18.53.78 \
  --join=132.18.53.78,132.18.53.91,132.18.53.80,132.18.53.66 \
  --background

# Esperar 3 segundos
sleep 3

# Inicializar el clúster (SOLO LA PRIMERA VEZ)
cockroach init --insecure --host=132.18.53.78

# Verificar estado
cockroach node status --insecure --host=132.18.53.78
```

#### 2️⃣ Nodos Secundarios (.91, .80, .66) - DESPUÉS

**En máquina 132.18.53.91:**
```bash
cockroach start \
  --insecure \
  --store=cockroach-data \
  --listen-addr=132.18.53.91 \
  --advertise-addr=132.18.53.91 \
  --join=132.18.53.78 \
  --background
```

**En máquina 132.18.53.80:**
```bash
cockroach start \
  --insecure \
  --store=cockroach-data \
  --listen-addr=132.18.53.80 \
  --advertise-addr=132.18.53.80 \
  --join=132.18.53.78 \
  --background
```

**En máquina 132.18.53.66:**
```bash
cockroach start \
  --insecure \
  --store=cockroach-data \
  --listen-addr=132.18.53.66 \
  --advertise-addr=132.18.53.66 \
  --join=132.18.53.78 \
  --background
```

#### Verificación Final

```bash
# Desde cualquier nodo activo
cockroach node status --insecure --host=132.18.53.78

# Abrir consola web
# http://132.18.53.78:8080
```

## 📊 Consola Web (Admin UI)

### Acceso

```
http://132.18.53.78:8080
```

### Secciones Importantes

| Sección | Descripción |
|---------|-------------|
| **Overview** | Estado general del clúster, nodos activos |
| **Metrics** | Gráficas de rendimiento (QPS, latencia, throughput) |
| **Databases** | Lista de bases de datos y tablas |
| **SQL Activity** | Consultas activas y estadísticas |
| **Network Latency** | Latencia entre nodos |
| **Jobs** | Tareas en ejecución (backups, schema changes) |
| **Advanced Debug** | Herramientas de diagnóstico avanzado |
## 📚 Recursos Adicionales

- **Documentación Oficial**: https://www.cockroachlabs.com/docs/
- **Guía de Arquitectura**: https://www.cockroachlabs.com/docs/stable/architecture/overview.html
- **Troubleshooting**: https://www.cockroachlabs.com/docs/stable/cluster-setup-troubleshooting.html
- **Foro Comunitario**: https://forum.cockroachlabs.com/