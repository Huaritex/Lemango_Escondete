import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRoom } from './RoomContext';
import Peer, { DataConnection } from 'peerjs';

interface NetworkState {
  isHost: boolean;
  isConnected: boolean;
  peerId: string;
  connections: Array<{
    peerId: string;
    playerName: string;
    connection: DataConnection;
  }>;
}

interface NetworkContextType {
  networkState: NetworkState;
  startHosting: () => Promise<void>;
  joinGame: (hostId: string) => Promise<void>;
  disconnect: () => void;
  sendGameState: (state: any) => void;
  onGameStateReceived: (callback: (state: any) => void) => void;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const NetworkProvider = ({ children }: { children: React.ReactNode }) => {
  const { currentRoom } = useRoom();
  const [networkState, setNetworkState] = useState<NetworkState>({
    isHost: false,
    isConnected: false,
    peerId: '',
    connections: []
  });

  const [peer, setPeer] = useState<Peer>();

  // Inicializar Peer cuando el componente se monta
  useEffect(() => {
    const initializePeer = async () => {
      try {
        const newPeer = new Peer();
        
        newPeer.on('open', (id) => {
          setNetworkState(prev => ({ ...prev, peerId: id }));
        });

        newPeer.on('connection', (conn) => {
          conn.on('open', () => {
            conn.on('data', (data) => {
              // Manejar los datos recibidos
              if (typeof data === 'object' && data.type === 'gameState') {
                // Emitir el evento de estado del juego recibido
                window.dispatchEvent(new CustomEvent('gameStateReceived', { detail: data.state }));
              }
            });

            setNetworkState(prev => ({
              ...prev,
              connections: [...prev.connections, {
                peerId: conn.peer,
                playerName: 'Jugador',
                connection: conn
              }]
            }));
          });
        });

        setPeer(newPeer);
      } catch (error) {
        console.error('Error al inicializar peer:', error);
      }
    };

    initializePeer();

    return () => {
      peer?.disconnect();
      peer?.destroy();
    };
  }, []);

  const startHosting = async () => {
    try {
      if (!peer) throw new Error('Peer no inicializado');
      
      setNetworkState(prev => ({
        ...prev,
        isHost: true,
        isConnected: true
      }));

      return peer.id; // Retornar el ID para compartir con otros jugadores
    } catch (error) {
      console.error('Error al iniciar el hosting:', error);
      throw error;
    }
  };

  const joinGame = async (hostId: string) => {
    try {
      if (!peer) throw new Error('Peer no inicializado');
      
      const conn = peer.connect(hostId);
      
      conn.on('open', () => {
        conn.on('data', (data) => {
          if (typeof data === 'object' && data.type === 'gameState') {
            window.dispatchEvent(new CustomEvent('gameStateReceived', { detail: data.state }));
          }
        });

        setNetworkState(prev => ({
          ...prev,
          isHost: false,
          isConnected: true,
          connections: [...prev.connections, {
            peerId: hostId,
            playerName: 'Host',
            connection: conn
          }]
        }));
      });
    } catch (error) {
      console.error('Error al unirse al juego:', error);
      throw error;
    }
  };

  const disconnect = () => {
    networkState.connections.forEach(({ connection }) => {
      connection.close();
    });

    peer?.disconnect();
    
    setNetworkState({
      isHost: false,
      isConnected: false,
      peerId: '',
      connections: []
    });
  };

  const sendGameState = (state: any) => {
    if (networkState.isConnected) {
      const gameStateData = {
        type: 'gameState',
        state: state
      };

      networkState.connections.forEach(({ connection }) => {
        connection.send(gameStateData);
      });
    }
  };

  const onGameStateReceived = (callback: (state: any) => void) => {
    if (networkState.isConnected) {
      window.addEventListener('gameStateReceived', ((event: CustomEvent) => {
        callback(event.detail);
      }) as EventListener);
    }
  };

  const value: NetworkContextType = {
    networkState,
    startHosting,
    joinGame,
    disconnect,
    sendGameState,
    onGameStateReceived
  };

  return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>;
};

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error('useNetwork debe ser usado dentro de un NetworkProvider');
  }
  return context;
};