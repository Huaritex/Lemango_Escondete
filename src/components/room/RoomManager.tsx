import React, { useState } from 'react';
import { useRoom } from '@/contexts/RoomContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const RoomManager: React.FC = () => {
  const { createRoom, joinRoom, currentRoom } = useRoom();
  const [roomName, setRoomName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateRoom = async () => {
    if (!roomName.trim()) return;
    setIsLoading(true);
    try {
      await createRoom(roomName, isPrivate);
    } catch (error) {
      console.error('Error al crear la sala:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!roomCode.trim()) return;
    setIsLoading(true);
    try {
      await joinRoom(roomCode.toUpperCase());
    } catch (error) {
      console.error('Error al unirse a la sala:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (currentRoom) {
    return (
      <Card className="w-[350px] shadow-lg">
        <CardHeader>
          <CardTitle>Sala: {currentRoom.name}</CardTitle>
          <CardDescription>
            Código: {currentRoom.code}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>Jugadores: {currentRoom.players.length}/{currentRoom.maxPlayers}</p>
            <p>Estado: {currentRoom.isPrivate ? 'Privada' : 'Pública'}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-[350px] shadow-lg">
      <CardHeader>
        <CardTitle>Unirse a una Partida</CardTitle>
        <CardDescription>
          Crea una sala nueva o únete a una existente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Crear Sala</TabsTrigger>
            <TabsTrigger value="join">Unirse</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Nombre de la sala"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                disabled={isLoading}
              />
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPrivate"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="isPrivate">Sala Privada</label>
              </div>
            </div>
            <Button
              onClick={handleCreateRoom}
              disabled={!roomName.trim() || isLoading}
              className="w-full"
            >
              {isLoading ? 'Creando...' : 'Crear Sala'}
            </Button>
          </TabsContent>

          <TabsContent value="join" className="space-y-4">
            <Input
              placeholder="Código de sala"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              maxLength={6}
              disabled={isLoading}
            />
            <Button
              onClick={handleJoinRoom}
              disabled={!roomCode.trim() || isLoading}
              className="w-full"
            >
              {isLoading ? 'Uniéndose...' : 'Unirse a Sala'}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RoomManager;