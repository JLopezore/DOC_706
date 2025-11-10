Esta guía te mostrará cómo configurar un servidor VPN **L2TP/IPsec** en tu router #MikroTik hEX GR3.

## Motivos 
- **Es Rápido:** Utiliza la aceleración de hardware IPsec de tu router.
- **Es Compatible:** Prácticamente todos los sistemas operativos (Windows, macOS, Linux, Android, iOS) tienen un cliente L2TP incorporado, por lo que no necesitas instalar software adicional en tus dispositivos.
# Antes de todo realiza un backup
## 1. Instalar escritorio remoto
### PC 1 (Ubuntu)
1. Descargar AnyDesk
	````bash
	wget https://download.anydesk.com/linux/anydesk_6.3.2-1_amd64.deb
	````
2. Instalar 
	````bash
	sudo apt install ./anydesk_6.3.2-1_amd64.deb
	````

### PC2 (enderavourOS)

1. Instalar desde AUR
````bash
yay -S anydesk
````
2. Habilitar/activar el servicio (opcional)
````bash
sudo systemctl enable --now anydesk.service
````
## 2. Revisar IP publica
1. Verificar si es ip estatica o dinamica: entrar a la pagina www.whatismyip.com 
2. Anotar la ip publica
3. Si es dinamica se debe configurar un servicio #DDNS en #MikroTik

## 3. Acceder al router 
Desde el navegador entrar a la pagina de administración del router, ip de la puerta de enlace

## 4. Crear un "Pool" de IPs para la VPN
Definimos un rango de direcciones IP que se asignarán a los dispositivos que se conecten.
Menu->IP -> Pool -> Add new 
**Name:** vpn-pool
**Addresses:** 192.168.100.10-50

**Equivalente en terminal**
````bash
/ip pool add name=vpn-pool ranges=192.168.100.10-192.168.100.50
````

## 5. Configurar el perfil PPP
Aquí definimos los DNS que usarán los clientes VPN.
Menú: PPP -> Profiles -> default-encryption
**Local Address:** `192.168.88.1` (La IP de tu router)
**Remote Address:** `vpn-pool` (El pool que creamos en el paso 1)
**DNS Server:** `192.168.88.1` (o puedes usar `8.8.8.8`)

**Equivalente en terminal**
````
/ppp profile set default-encryption local-address=192.168.88.1 remote-address=vpn-pool dns-server=192.168.88.1
````

## 6. Activar el Servidor L2TP
Aquí es donde "encendemos" la VPN y definimos la clave secreta.
**Menú:** `PPP` -> `Interface` -> **L2TP Server**.
Marca la casilla `Enabled`.
**Default Profile:** `default-encryption`
Marca la casilla `Use IPsec`.
**IPsec Secret:** Escribe una contraseña larga y segura. **¡Esta es tu clave pre-compartida (PSK)!** Anótala bien.
Haz clic en **OK**.
    
> **Equivalente en Terminal:** `/interface l2tp-server server set enabled=yes use-ipsec=yes ipsec-secret="TuClaveSecretaMuyFuerte" default-profile=default-encryption`

## 7. Crear usuarios (secrets)
Se crea usuario y contraseña
**Menú:** `PPP` -> `Secrets` -> `Add New`.
**Name:** Escribe un nombre de usuario (ej. `laptop-t14`)
**Password:** Escribe una contraseña fuerte para _este usuario_.
**Service:** `l2tp`
**Profile:** `default-encryption`
Haz clic en **OK**.

> **Equivalente en Terminal:** `/ppp secret add name=laptop-t14 password="PasswordFuerteParaElUsuario" service=l2tp profile=default-encryption`

## 8. Configurar el Firewall (critico)
Debemos abrir los puertos necesarios en el firewall para permitir que la conexión VPN entre desde Internet.
- **Menú:** `IP` -> `Firewall` -> Pestaña `Filter Rules`
    
- **Importante:** Añade estas reglas **al principio de la lista** (puedes arrastrarlas hacia arriba). Deben estar _antes_ de cualquier regla que diga "drop".