import React from 'react';
import { useRoom } from '@/contexts/RoomContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

const NetworkManager: React.FC = () => {
  const { currentRoom, createRoom, joinRoom, leaveRoom, wsConnected } = useRoom();

  const handleCreateRoom = async () => {
    try {
      await createRoom('Sala de Juego');
      toast({
        title: 'Sala creada',
        description: 'Esperando a otro jugador...'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo crear la sala',
        variant: 'destructive'
      });
    }
  };

  const handleJoinRoom = async () => {
    try {
      const joined = await joinRoom();
      if (joined) {
        toast({
          title: 'Conectado',
          description: 'Te has unido a la sala'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo unir a la sala',
        variant: 'destructive'
      });
    }
  };

  return (
    <Card className="bg-black/40 backdrop-blur-sm border-gray-800 text-game-light">
      <CardHeader>
        <CardTitle>Conexión Local</CardTitle>
      </CardHeader>
      <CardContent>
        {!wsConnected ? (
          <div className="space-y-4">
            <Button
              onClick={handleCreateRoom}
              className="w-full bg-gradient-to-r from-game-hider to-game-seeker hover:opacity-90"
            >
              Crear Sala
            </Button>
            <Button
              onClick={handleJoinRoom}
              className="w-full"
            >
              Unirse a Sala
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm">
              Estado: {currentRoom?.players.length === 2 ? 'Sala Llena' : 'Esperando Jugador'}
            </p>
            <p className="text-sm">
              Jugadores: {currentRoom?.players.length || 1}/2
            </p>
            <Button
              onClick={leaveRoom}
              variant="destructive"
              className="w-full mt-4"
            >
              Salir
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NetworkManager;