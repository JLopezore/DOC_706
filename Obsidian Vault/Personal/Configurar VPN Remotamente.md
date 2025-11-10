Esta guía te mostrará cómo configurar un servidor VPN **L2TP/IPsec** en tu router #MikroTik hEX GR3.

## Motivos 
- **Es Rápido:** Utiliza la aceleración de hardware IPsec de tu router.
- **Es Compatible:** Prácticamente todos los sistemas operativos (Windows, macOS, Linux, Android, iOS) tienen un cliente L2TP incorporado, por lo que no necesitas instalar software adicional en tus dispositivos.
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
1. Desde el navegador entrar a la pagina de administración del router, ip de la puerta de enlace
