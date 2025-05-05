import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { connectWS, sendWS, onWSMessage, disconnectWS } from "@/lib/wsClient";

// Tipos de mensajes WebSocket
interface RoomPayload {
  id: string;
  name: string;
  players: string[];
  maxPlayers: number;
  status: 'waiting' | 'playing' | 'ended';
}

interface PlayerPayload {
  player: string;
}

interface CreateRoomPayload {
  name: string;
  maxPlayers: number;
}

type WSMessage =
  | { type: 'room_update'; payload: RoomPayload }
  | { type: 'player_joined'; payload: PlayerPayload }
  | { type: 'player_left'; payload: PlayerPayload }
  | { type: 'create_room'; payload: CreateRoomPayload }
  | { type: 'join_room'; payload: Record<string, never> }
  | { type: 'leave_room'; payload: Record<string, never> };

interface RoomState {
  id: string;
  name: string;
  players: string[];
  maxPlayers: number;
  status: 'waiting' | 'playing' | 'ended';
}

interface RoomContextType {
  currentRoom: RoomState | null;
  createRoom: (name: string) => Promise<void>;
  joinRoom: () => Promise<boolean>;
  leaveRoom: () => void;
  wsConnected: boolean;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();
  const [currentRoom, setCurrentRoom] = useState<RoomState | null>(null);
  const [wsConnected, setWsConnected] = useState(false);

  // Configuración del servidor WebSocket
  const WS_SERVER_IP = import.meta.env.VITE_WS_SERVER_IP || "localhost";
  const WS_SERVER_PORT = import.meta.env.VITE_WS_SERVER_PORT || "3001";
  
  const MAX_RECONNECT_ATTEMPTS = 3;
const RECONNECT_DELAY = 1000; // 1 segundo

const connectToLAN = async (attempt: number = 1): Promise<boolean> => {
    try {
      const serverUrl = `ws://${WS_SERVER_IP}:${WS_SERVER_PORT}`;
      console.log("[RoomContext] Intentando conectar a:", serverUrl);
      
      const connected = await connectWS(serverUrl);
      if (!connected) {
        if (attempt < MAX_RECONNECT_ATTEMPTS) {
          console.log(`[RoomContext] Intento ${attempt} fallido, reintentando en ${RECONNECT_DELAY}ms...`);
          await new Promise(resolve => setTimeout(resolve, RECONNECT_DELAY));
          return connectToLAN(attempt + 1);
        }
        throw new Error(`No se pudo establecer la conexión después de ${MAX_RECONNECT_ATTEMPTS} intentos`);
      }

      setWsConnected(true);
      
      onWSMessage((data: unknown) => {
        try {
          if (!data || typeof data !== 'object' || !('type' in data) || !('payload' in data)) {
            throw new Error('Mensaje recibido inválido');
          }
          
          const message = data as WSMessage;

          switch (message.type) {
            case "room_update": {
              const roomData = message.payload;
              setCurrentRoom(roomData);
              break;
            }
            case "player_joined": {
              if (currentRoom) {
                setCurrentRoom({
                  ...currentRoom,
                  players: [...currentRoom.players, message.payload.player]
                });
              }
              break;
            }
            case "player_left": {
              if (currentRoom) {
                setCurrentRoom({
                  ...currentRoom,
                  players: currentRoom.players.filter(p => p !== message.payload.player)
                });
              }
              break;
            }
          }
        } catch (error) {
          console.error("[RoomContext] Error procesando mensaje:", error);
          toast({
            title: 'Error de comunicación',
            description: error instanceof Error ? error.message : 'Error desconocido',
            variant: 'destructive'
          });
        }
      });

      return true;
    } catch (error) {
      console.error("[RoomContext] Error en connectToLAN:", error);
      setWsConnected(false);
      toast({
        title: 'Error de conexión',
        description: error instanceof Error ? error.message : 'No se pudo establecer la conexión',
        variant: 'destructive'
      });
      return false;
    }
  };

  const validateRoomName = (name: string): boolean => {
    const trimmedName = name.trim();
    return trimmedName.length >= 3 && trimmedName.length <= 20;
  };

  const createRoom = async (name: string) => {
    try {
      const trimmedName = name.trim();
      if (!validateRoomName(trimmedName)) {
        toast({
          title: 'Error de validación',
          description: 'El nombre de la sala debe tener entre 3 y 20 caracteres',
          variant: 'destructive'
        });
        return;
      }

      if (wsConnected) {
        disconnectWS();
        setWsConnected(false);
      }

      const connected = await connectToLAN();
      if (!connected) {
        throw new Error('No se pudo establecer la conexión');
      }

      sendWS({
        type: "create_room",
        payload: {
          name: trimmedName,
          maxPlayers: 2
        }
      });

    } catch (error) {
      console.error("[RoomContext] Error en createRoom:", error);
      if (wsConnected) {
        disconnectWS();
        setWsConnected(false);
      }
      
      toast({
        title: 'Error al crear sala',
        description: error instanceof Error ? error.message : 'Error inesperado',
        variant: 'destructive'
      });
    }
  };

  const joinRoom = async (): Promise<boolean> => {
    try {
      if (wsConnected) {
        disconnectWS();
        setWsConnected(false);
      }

      const connected = await connectToLAN();
      if (!connected) {
        throw new Error('No se pudo establecer la conexión');
      }

      sendWS({
        type: "create_room",
        payload: {
          name: "Player's Room",
          maxPlayers: 2
        }
      });
      sendWS({ type: "join_room", payload: {} });
      return true;

    } catch (error) {
      console.error('[RoomContext] Error en joinRoom:', error);
      if (wsConnected) {
        disconnectWS();
        setWsConnected(false);
      }
      
      toast({
        title: 'Error al unirse',
        description: error instanceof Error ? error.message : 'Error inesperado',
        variant: 'destructive'
      });
      return false;
    }
  };

  const cleanupConnection = () => {
    try {
      if (wsConnected) {
        disconnectWS();
        setWsConnected(false);
        setCurrentRoom(null);
      }
    } catch (error) {
      console.error("[RoomContext] Error en cleanupConnection:", error);
    }
  };

  // Limpiar la conexión cuando el componente se desmonta
  useEffect(() => {
    return () => cleanupConnection();
  }, []);

  const leaveRoom = () => {
    try {
      if (wsConnected) {
        sendWS({ type: "leave_room", payload: {} });
        cleanupConnection();
      }
      toast({
        title: 'Desconectado',
        description: 'Has abandonado la sala'
      });
    } catch (error) {
      console.error("[RoomContext] Error al abandonar la sala:", error);
      toast({
        title: 'Error',
        description: 'Error al abandonar la sala',
        variant: 'destructive'
      });
    }
  };

  const value: RoomContextType = {
    currentRoom,
    createRoom,
    joinRoom,
    leaveRoom,
    wsConnected
  };

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};

export const useRoom = () => {
  const context = useContext(RoomContext);
  if (context === undefined) {
    throw new Error('useRoom debe ser usado dentro de un RoomProvider');
  }
  return context;
};