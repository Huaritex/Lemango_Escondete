import React, { useState } from 'react';
import { useNetwork } from '@/contexts/NetworkContext';
import { useRoom } from '@/contexts/RoomContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const NetworkManager: React.FC = () => {
  const { networkState, startHosting, joinGame } = useNetwork();
  const { currentRoom } = useRoom();
  const [hostId, setHostId] = useState('');

  const handleStartHosting = async () => {
    try {
      const peerId = await startHosting();
      toast.success('Sala creada exitosamente', {
        description: `Tu ID de conexión es: ${peerId}`
      });
    } catch (error) {
      toast.error('Error al crear la sala', {
        description: 'Por favor, intenta nuevamente'
      });
    }
  };

  const handleJoinGame = async () => {
    if (!hostId.trim()) {
      toast.error('ID de conexión inválido', {
        description: 'Por favor, ingresa un ID válido'
      });
      return;
    }

    try {
      await joinGame(hostId);
      toast.success('Conectado exitosamente', {
        description: 'Te has unido a la partida'
      });
    } catch (error) {
      toast.error('Error al unirse a la partida', {
        description: 'Por favor, verifica el ID e intenta nuevamente'
      });
    }
  };

  if (!currentRoom) return null;

  return (
    <Card className="bg-black/40 backdrop-blur-sm border-gray-800 text-game-light">
      <CardHeader>
        <CardTitle>Conexión Local</CardTitle>
      </CardHeader>
      <CardContent>
        {!networkState.isConnected ? (
          <div className="space-y-4">
            <div>
              <Button
                onClick={handleStartHosting}
                className="w-full bg-gradient-to-r from-game-hider to-game-seeker hover:opacity-90"
              >
                Crear Partida Local
              </Button>
            </div>
            <div className="space-y-2">
              <Input
                placeholder="Ingresa el ID de la partida"
                value={hostId}
                onChange={(e) => setHostId(e.target.value)}
              />
              <Button
                onClick={handleJoinGame}
                className="w-full"
                disabled={!hostId.trim()}
              >
                Unirse a Partida Local
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm">
              Estado: {networkState.isHost ? 'Anfitrión' : 'Conectado'}
            </p>
            <p className="text-sm">
              Jugadores conectados: {networkState.connections.length + 1}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NetworkManager;