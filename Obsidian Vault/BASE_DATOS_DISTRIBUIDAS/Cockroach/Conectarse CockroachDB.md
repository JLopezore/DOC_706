**Instalar postgreSQL**
```bash
sudo apt install postgresql
```

**Obtener el certificado para poder conectarse al cluster**
```bash
curl --create-dirs -o $HOME/.postgresql/root.crt 'https://cockroachlabs.cloud/clusters/b47360c5-b885-459c-b63f-c2c02ec450aa/cert'
```

**Plantilla para conectarse al cluster:**
```bash
psql "postgresql://<USER>:<SQL-USER-PASSWORD>@@rapid-beaski-17010.j77.aws-us-east-2.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full"
```

**El mío funcionando**
```bash
psql "postgresql://yhosmar:Iuy_gkBr3qJ-WDz59DHQUQ@rapid-beaski-17010.j77.aws-us-east-2.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full"
```

**Configurar la variable de entorno de conexión**

- Linux
```bash
export DATABASE_URL="<connection-string>"
```
- Windows
```powershell
$env:DATABASE_URL = "<connection-string>"
```
- Mac
```bash
export DATABASE_URL="<connection-string>"
```

**El mío funcionando**
```bash
export DATABASE_URL="postgresql://yhosmar:Iuy_gkBr3qJ-WDz59DHQUQ@rapid-beaski-17010.j77.aws-us-east-2.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full"
```


**Crear una base y tabla**

```sql
CREATE DATABASE ejemplo;
```

```sql
\c ejemplo
```

```sql
CREATE TABLE alumnos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    edad INT
);
```

```sql
INSERT INTO alumnos (nombre, correo, edad)
VALUES
('Ana Pérez', 'ana@example.com', 25),
('Juan López', 'juan@example.com', 30),
('María García', 'maria@example.com', 22);
```

```sql
SELECT * FROM alumnos;
```


**Probar en otra maquina**

```sql
\c ejemplo
```


```sql
SELECT * FROM alumnos;
```
