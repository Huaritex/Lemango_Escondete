import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoom } from '@/contexts/RoomContext';
import RoomManager from '@/components/room/RoomManager';
import { Button } from '@/components/ui/button';
import AnimatedBackground from '@/components/AnimatedBackground';
import '@/styles/glassmorphism.css';

const Lobby: React.FC = () => {
  const navigate = useNavigate();
  const { currentRoom, leaveRoom } = useRoom();

  const handleStartGame = () => {
    if (currentRoom) {
      navigate('/game');
    }
  };

  const handleLeaveRoom = () => {
    leaveRoom();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-game-dark flex flex-col items-center justify-center p-4 relative">
      <AnimatedBackground />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0" />
      <div className="max-w-4xl w-full space-y-8 relative z-10 glass-container">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Lemango Escondete</h1>
          <p className="text-gray-400">Únete a una sala para comenzar a jugar</p>
        </div>

        <div className="flex flex-col items-center space-y-6">
          <RoomManager />

          {currentRoom && (
            <div className="space-x-4">
              <Button
                onClick={handleStartGame}
                className="bg-green-600 hover:bg-green-700"
              >
                Iniciar Juego
              </Button>
              <Button
                onClick={handleLeaveRoom}
                variant="destructive"
              >
                Abandonar Sala
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lobby;