## Entorno

``` yaml
version: '3.9'

services:
  postgres:
    image: postgres:16
    container_name: postgres-db
    restart: always
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: admin123
      POSTGRES_DB: testdb
    ports:
      - "5432:5432"
    volumes:
      - ./postgres_data:/var/lib/postgresql/data

  oracle:
    image: gvenzl/oracle-free:23.5-slim
    container_name: oracle-db
    restart: always
    environment:
      ORACLE_PASSWORD: admin123
      APP_USER: appuser
      APP_USER_PASSWORD: appuser123
    ports:
      - "1521:1521"
      - "5500:5500"
    volumes:
      - ./oracle_data:/opt/oracle/oradata
```

## Levantar los contenedores

```
docker compose up -d
```

**Verificar:** `docker ps`

## Conectarse

#### PostgreSQL

```
docker exec -it postgres-db psql -U admin -d testdb
```
#### Oracle

```
docker exec -it oracle-db sqlplus appuser/appuser123@//localhost:1521/FREEPDB1
```

## Crear los objetos