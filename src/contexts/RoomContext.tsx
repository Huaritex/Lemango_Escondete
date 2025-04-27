import React, { createContext, useState, useContext } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface RoomState {
  id: string;
  name: string;
  code: string;
  hostId: string;
  players: string[];
  isPrivate: boolean;
  maxPlayers: number;
}

interface RoomContextType {
  currentRoom: RoomState | null;
  createRoom: (name: string, isPrivate: boolean) => Promise<string>;
  joinRoom: (code: string) => Promise<boolean>;
  leaveRoom: () => void;
  updateRoom: (roomData: Partial<RoomState>) => void;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();
  const [currentRoom, setCurrentRoom] = useState<RoomState | null>(null);

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const createRoom = async (name: string, isPrivate: boolean) => {
    try {
      const roomCode = generateRoomCode();
      const newRoom: RoomState = {
        id: crypto.randomUUID(),
        name,
        code: roomCode,
        hostId: 'user-' + Math.random().toString(36).substring(2, 9),
        players: [],
        isPrivate,
        maxPlayers: 8
      };

      setCurrentRoom(newRoom);
      toast({
        title: '¡Sala creada!',
        description: `Código de la sala: ${roomCode}`
      });

      return roomCode;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo crear la sala',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const joinRoom = async (code: string) => {
    try {
      // Aquí se implementará la lógica para unirse a una sala existente
      // usando el código proporcionado
      if (code.length !== 6) {
        throw new Error('Código de sala inválido');
      }

      // Simulación de unirse a una sala
      const mockRoom: RoomState = {
        id: crypto.randomUUID(),
        name: 'Sala de Juego',
        code: code,
        hostId: 'host-id',
        players: [],
        isPrivate: true,
        maxPlayers: 8
      };

      setCurrentRoom(mockRoom);
      toast({
        title: '¡Conectado!',
        description: `Te has unido a la sala ${mockRoom.name}`
      });

      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo unir a la sala',
        variant: 'destructive'
      });
      return false;
    }
  };

  const leaveRoom = () => {
    setCurrentRoom(null);
    toast({
      title: 'Desconectado',
      description: 'Has abandonado la sala'
    });
  };

  const updateRoom = (roomData: Partial<RoomState>) => {
    if (currentRoom) {
      setCurrentRoom({ ...currentRoom, ...roomData });
    }
  };

  const value = {
    currentRoom,
    createRoom,
    joinRoom,
    leaveRoom,
    updateRoom
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