// Servidor WebSocket con gestión de salas para LAN
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3001 });

// Almacenar clientes y salas
let clients = new Map(); // Map<WebSocket, { id: string, roomId: string | null }>
let rooms = new Map();   // Map<string, { id: string, name: string, code: string, hostId: string, players: string[], isPrivate: boolean, maxPlayers: number, wsClients: Set<WebSocket> }>

console.log('Servidor WebSocket LAN iniciado en el puerto 3001');

wss.on('connection', (ws) => {
  const clientId = 'user-' + Math.random().toString(36).substring(2, 9);
  clients.set(ws, { id: clientId, roomId: null });
  console.log(`Cliente conectado: ${clientId}`);

  // Configurar ping timeout
  let pingTimeout;
  const resetPingTimeout = () => {
    if (pingTimeout) clearTimeout(pingTimeout);
    pingTimeout = setTimeout(() => {
      console.log(`Cliente ${clientId} no respondió al ping, cerrando conexión...`);
      ws.terminate();
    }, 30000); // 30 segundos sin respuesta = desconexión
  };
  resetPingTimeout();

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      // Manejar ping/pong
      if (data.type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong' }));
        resetPingTimeout();
        return;
      }
      
      console.log(`Mensaje recibido de ${clientId}:`, data);

      switch (data.type) {
        case 'room_create':
          handleCreateRoom(ws, clientId, data.payload);
          break;
        case 'room_join':
          handleJoinRoom(ws, clientId, data.payload);
          break;
        // Añadir más casos para otros tipos de mensajes (ej: game_start, player_move)
        default:
          // Reenviar otros mensajes a los miembros de la misma sala (si aplica)
          broadcastToRoom(ws, message, false); // No reenviar al remitente
      }
    } catch (error) {
      console.error(`Error procesando mensaje de ${clientId}:`, error, message.toString());
    }
  });

  ws.on('close', () => {
    const clientInfo = clients.get(ws);
    if (clientInfo) {
      console.log(`Cliente desconectado: ${clientInfo.id}`);
      handleLeaveRoom(ws, clientInfo.id, clientInfo.roomId);
      clients.delete(ws);
    }
  });

  ws.onerror = (error) => {
    const clientInfo = clients.get(ws);
    console.error(`Error WebSocket para cliente ${clientInfo?.id || 'desconocido'}:`, error);
    // Considerar limpiar el cliente si hay error
    if (clientInfo) {
      handleLeaveRoom(ws, clientInfo.id, clientInfo.roomId);
      clients.delete(ws);
    }
  };
});

function handleCreateRoom(ws, clientId, payload) {
  console.log(`[handleCreateRoom] Recibido para ${clientId}:`, payload);
  const { id, name, code, isPrivate, maxPlayers, password } = payload;
  
  // Validación específica para salas privadas
  if (isPrivate && !password) {
    ws.send(JSON.stringify({
      type: 'error',
      payload: { message: 'Las salas privadas requieren contraseña' }
    }));
    return;
  }
  
  // Validación más detallada del payload
  const validationErrors = [];
  if (!id) validationErrors.push('ID de sala no proporcionado');
  if (!name) validationErrors.push('Nombre de sala no proporcionado');
  if (!code) validationErrors.push('Código de sala no proporcionado');
  if (maxPlayers === undefined || maxPlayers <= 0) validationErrors.push('Número máximo de jugadores inválido');
  
  if (validationErrors.length > 0) {
    console.error(`[handleCreateRoom] Errores de validación para ${clientId}:`, validationErrors);
    ws.send(JSON.stringify({
      type: 'error',
      payload: { message: `Datos inválidos para crear la sala: ${validationErrors.join(', ')}` }
    }));
    return;
  }

  if (rooms.has(code)) {
    // Podría enviar un mensaje de error al cliente
    console.warn(`Intento de crear sala con código existente: ${code}`);
    ws.send(JSON.stringify({ type: 'error', payload: { message: 'El código de sala ya existe.' } }));p
    return;
  }

  const newRoom = {
    id,
    name,
    code,
    hostId: clientId, // Asegurarse que el hostId es el clientId del creador
    players: [clientId],
    isPrivate,
    maxPlayers,
    password, // Añadir la contraseña para salas privadas
    wsClients: new Set([ws])
  };
  rooms.set(code, newRoom);
  clients.set(ws, { id: clientId, roomId: code }); // Actualizar roomId del cliente

  console.log(`[handleCreateRoom] Sala creada: ${name} (${code}) por ${clientId}`);
  // Enviar confirmación al creador
  const confirmationMessage = JSON.stringify({ type: 'room_created', payload: { ...newRoom, wsClients: undefined } }); // Excluir wsClients
  console.log(`[handleCreateRoom] Enviando room_created a ${clientId}:`, confirmationMessage); // Log añadido
  ws.send(confirmationMessage);
  // Enviar actualización a todos en la sala (en este caso, solo el creador)
  console.log(`[handleCreateRoom] Llamando a broadcastRoomUpdate para ${code}`); // Log añadido
  broadcastRoomUpdate(code);
}

function handleJoinRoom(ws, clientId, payload) {
  const { code, password } = payload;
  const room = rooms.get(code);

  if (!room) {
    console.warn(`Intento de unirse a sala inexistente: ${code}`);
    ws.send(JSON.stringify({ type: 'error', payload: { message: 'La sala no existe.' } }));
    return;
  }

  // Validar contraseña para salas privadas
  if (room.isPrivate && room.password !== password) {
    console.warn(`Contraseña incorrecta para sala privada: ${code}`);
    ws.send(JSON.stringify({ type: 'error', payload: { message: 'Contraseña incorrecta para la sala privada.' } }));
    return;
  }

  if (room.players.length >= room.maxPlayers) {
    console.warn(`Intento de unirse a sala llena: ${code}`);
    ws.send(JSON.stringify({ type: 'error', payload: { message: 'La sala está llena.' } }));
    return;
  }

  if (room.players.includes(clientId)) {
     console.warn(`Cliente ${clientId} ya está en la sala ${code}`);
     // Podrías simplemente actualizar su estado o reenviar la info de la sala
     clients.set(ws, { id: clientId, roomId: code });
     ws.send(JSON.stringify({ type: 'room_joined', payload: room })); // Reenviar estado actual
     return;
  }

  // Añadir cliente a la sala
  room.players.push(clientId);
  room.wsClients.add(ws);
  clients.set(ws, { id: clientId, roomId: code }); // Actualizar roomId del cliente

  console.log(`Cliente ${clientId} se unió a la sala: ${room.name} (${code})`);
  // Enviar confirmación al cliente que se unió
  ws.send(JSON.stringify({ type: 'room_joined', payload: room }));
  // Notificar a todos en la sala sobre el nuevo miembro
  broadcastRoomUpdate(code);
}

function handleLeaveRoom(ws, clientId, roomId) {
  if (!roomId) return; // No estaba en ninguna sala

  const room = rooms.get(roomId);
  if (room) {
    room.players = room.players.filter(pId => pId !== clientId);
    room.wsClients.delete(ws);
    clients.set(ws, { id: clientId, roomId: null }); // Limpiar roomId del cliente

    console.log(`Cliente ${clientId} abandonó la sala: ${room.name} (${roomId})`);

    if (room.players.length === 0) {
      // Si la sala queda vacía, eliminarla
      rooms.delete(roomId);
      console.log(`Sala eliminada por estar vacía: ${room.name} (${roomId})`);
    } else {
      // Si el host se va, asignar nuevo host (ej: el siguiente en la lista)
      if (room.hostId === clientId) {
        room.hostId = room.players[0];
        console.log(`Nuevo host para la sala ${roomId}: ${room.hostId}`);
      }
      // Notificar a los restantes sobre la salida y posible cambio de host
      broadcastRoomUpdate(roomId);
    }
  }
}

// Envía una actualización del estado de la sala a todos sus miembros
function broadcastRoomUpdate(roomId) {
  const room = rooms.get(roomId);
  if (room) {
    const roomState = { ...room, wsClients: undefined }; // No enviar los objetos WebSocket
    const message = JSON.stringify({ type: 'room_update', payload: roomState });
    console.log(`[broadcastRoomUpdate] Enviando actualización para sala ${roomId}:`, message); // Log añadido
    room.wsClients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      } else {
        console.warn(`[broadcastRoomUpdate] Cliente en sala ${roomId} no está OPEN. State: ${client.readyState}`);
      }
    });
    // console.log(`Actualización enviada para sala ${roomId}`); // Comentado o eliminado para evitar duplicidad
  }
}

// Envía un mensaje a todos en la sala del remitente (excepto opcionalmente al remitente)
function broadcastToRoom(senderWs, message, includeSender = false) {
  const senderInfo = clients.get(senderWs);
  if (!senderInfo || !senderInfo.roomId) return; // Remitente no encontrado o no en sala

  const room = rooms.get(senderInfo.roomId);
  if (room) {
    room.wsClients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        if (includeSender || client !== senderWs) {
          client.send(message);
        }
      }
    });
  }
}