// Definición de tipos para mensajes WebSocket
interface BaseWSMessage {
  type: string;
  payload: unknown;
}

interface RoomMessage extends BaseWSMessage {
  type: 'room_update' | 'player_joined' | 'player_left' | 'create_room' | 'join_room' | 'leave_room';
  payload: {
    id?: string;
    name?: string;
    players?: string[];
    maxPlayers?: number;
    status?: 'waiting' | 'playing' | 'ended';
    player?: string;
  };
}

type WSMessage = RoomMessage;

let ws: WebSocket | null = null;
let messageHandler: ((data: WSMessage) => void) | null = null;

export const connectWS = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      ws = new WebSocket(url);

      ws.onopen = () => {
        console.log('[wsClient] Conexión establecida');
        resolve(true);
      };

      ws.onerror = (error) => {
        console.error('[wsClient] Error de conexión:', error);
        console.log('[wsClient] Asegúrate de que el servidor WebSocket esté ejecutándose en la dirección especificada');
        resolve(false);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          messageHandler?.(data);
        } catch (error) {
          console.error('[wsClient] Error al procesar mensaje:', error);
        }
      };

      ws.onclose = () => {
        console.log('[wsClient] Conexión cerrada');
        ws = null;
      };

    } catch (error) {
      console.error('[wsClient] Error al crear conexión:', error);
      resolve(false);
    }
  });
};

export const sendWS = (data: WSMessage): boolean => {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    console.error('[wsClient] No hay conexión activa. Asegúrate de que el servidor esté en ejecución y que estés conectado.');
    return false;
  }

  try {
    ws.send(JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('[wsClient] Error al enviar mensaje:', error);
    return false;
  }
};

export const onWSMessage = (handler: (data: WSMessage) => void): void => {
  messageHandler = handler;
};

export const disconnectWS = (): void => {
  if (ws) {
    ws.close();
    ws = null;
  }
  messageHandler = null;
};