# Lemango Escóndete 🎮

¡Bienvenido a Lemango Escóndete! Un emocionante juego de escondite por turnos donde un jugador se esconde y otro lo busca.

## 🎯 Características del Juego

- **Jugabilidad por Turnos**: Partidas de 16 turnos (8 minutos)
- **Dos Roles**: Escondido y Buscador
- **Sistema de Objetos**: Tienda con objetos especiales
- **Interfaz Moderna**: Diseño intuitivo y atractivo

## 🚀 Tecnologías Utilizadas

- React + TypeScript
- Vite
- Tailwind CSS
- Shadcn/ui

## 📋 Requisitos Previos

- Node.js (versión 18 o superior)
- npm (incluido con Node.js)

## 🛠️ Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/Huaritex/Lemango_Escondete.git
```

2. Navega al directorio del proyecto:
```bash
cd Lemango_Escondete
```

3. Instala las dependencias:
```bash
npm install
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## 🎮 Cómo Jugar

1. El Escondido comienza en la esquina superior izquierda
2. El Buscador comienza en la esquina inferior derecha
3. Cada jugador tiene 30 segundos por turno

## 🌐 Configuración de la conexión entre laptops

Para permitir que dos laptops se conecten en una red local, sigue estos pasos:

### En la primera laptop (servidor)

1. Averigua la dirección IP de la primera laptop en la red local:
   - Abre una terminal o símbolo del sistema
   - Ejecuta `ipconfig` (Windows) o `ifconfig` (Mac/Linux)
   - Busca la dirección IPv4 de tu adaptador de red (generalmente comienza con 192.168.x.x)

2. No es necesario cambiar nada en la primera laptop, ya que el servidor se ejecutará localmente.

### En la segunda laptop (cliente)

1. Modifica el archivo `.env.local` en la raíz del proyecto:
   ```
   NEXT_PUBLIC_WS_SERVER_IP=192.168.x.x  # Reemplaza con la IP de la primera laptop
   NEXT_PUBLIC_WS_SERVER_PORT=3001
   ```

2. Asegúrate de que ambas laptops estén conectadas a la misma red local.

### Notas importantes

- El puerto 3001 debe estar abierto en el firewall de la primera laptop.
- Si tienes problemas de conexión, verifica que no haya restricciones de firewall bloqueando la comunicación.
- La aplicación debe reiniciarse después de modificar el archivo `.env.local` para que los cambios surtan efecto.
4. Muévete una casilla por turno (horizontal o vertical)
5. Usa la tienda para comprar objetos especiales
6. Presiona Espacio para saltar tu turno

## 🏆 Objetivos

- **Escondido**: Sobrevive durante los 16 turnos sin ser encontrado
- **Buscador**: Encuentra al escondido antes de que se acaben los turnos

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que te gustaría hacer.

---

Desarrollado con ❤️ por Huaritex
