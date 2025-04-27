import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";

// Game types and interfaces
export type PlayerRole = "hider" | "seeker";
export type PlayerPosition = { x: number; y: number };
export type GamePhase = "setup" | "playing" | "ended";
export type Item = {
  id: string;
  name: string;
  description: string;
  cost: number;
  cooldown: number; // in seconds
  effect: string;
  isAvailable: boolean;
};

export interface PlayerState {
  id: string;
  name: string;
  role: PlayerRole;
  position: PlayerPosition;
  points: number;
  avatar: string;
  color: string;
  image?: string | null; // Añadir campo opcional para la imagen
  visible: boolean;
  items: Item[];
  activeItems: { [key: string]: boolean };
  cooldowns: { [key: string]: number };
}

interface GameContextType {
  gamePhase: GamePhase;
  currentTurn: number;
  turnTimeLeft: number;
  maxTurns: number;
  players: PlayerState[];
  currentPlayer: number;
  mapSize: { width: number; height: number };
  storeItems: Item[];
  
  // Game actions
  startGame: () => void;
  movePlayer: (playerId: string, newPosition: PlayerPosition) => void;
  endTurn: () => void;
  buyItem: (playerId: string, itemId: string) => void;
  useItem: (playerId: string, itemId: string) => void;
  updatePlayerCustomization: (playerId: string, name: string, avatar: string, color: string, image: string | null) => void; // Actualizar firma
  resetGame: () => void;
}

const defaultStoreItems: Item[] = [
  {
    id: "smoke_bomb",
    name: "Bomba de Humo",
    description: "Te vuelve invisible durante 1 turno",
    cost: 100,
    cooldown: 2,
    effect: "invisible",
    isAvailable: true
  },
  {
    id: "radar",
    name: "Radar",
    description: "Revela la posición del escondido",
    cost: 150,
    cooldown: 3,
    effect: "reveal",
    isAvailable: true
  },
  {
    id: "speed_boost",
    name: "Incremento de Velocidad",
    description: "Te permite moverte 2 casillas adicionales en tu próximo turno",
    cost: 75,
    cooldown: 2,
    effect: "speed",
    isAvailable: true
  },
  {
    id: "trap",
    name: "Trampa",
    description: "Coloca una trampa que revela al escondido si pasa sobre ella",
    cost: 125,
    cooldown: 2,
    effect: "trap",
    isAvailable: true
  }
];

// Create the context with a default undefined value
const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();
  const [gamePhase, setGamePhase] = useState<GamePhase>("setup");
  const [currentTurn, setCurrentTurn] = useState(1);
  const [turnTimeLeft, setTurnTimeLeft] = useState(18); // Changed from 30 to 18 seconds per turn
  const [maxTurns, setMaxTurns] = useState(16); // 8 minutes in total (with 18s per turn, total time reduced)
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState(0); // Index of current player
  const [mapSize] = useState({ width: 10, height: 10 });
  const [storeItems, setStoreItems] = useState<Item[]>(defaultStoreItems);
  
  const [players, setPlayers] = useState<PlayerState[]>([
    {
      id: "player1",
      name: "Escondido",
      role: "hider",
      position: { x: 1, y: 1 },
      points: 100,
      avatar: "👤",
      color: "game-hider",
      image: null, // Inicializar imagen
      visible: false,
      items: [],
      activeItems: {},
      cooldowns: {}
    },
    {
      id: "player2",
      name: "Buscador",
      role: "seeker",
      position: { x: 8, y: 8 },
      points: 100,
      avatar: "👁️",
      color: "game-seeker",
      image: null, // Inicializar imagen
      visible: true,
      items: [],
      activeItems: {},
      cooldowns: {}
    }
  ]);

  // Define endTurn with useCallback to avoid dependency issues
  const endTurn = useCallback(() => {
    if (timerInterval) clearInterval(timerInterval);
    
    // Update turn counter and switch player
    setCurrentTurn(prev => prev + 1);
    setCurrentPlayer(prev => (prev + 1) % players.length);
    setTurnTimeLeft(18); // Reset timer to 18 seconds
    
    toast({
      title: "Cambio de turno",
      description: `Turno del ${players[(currentPlayer + 1) % players.length].role === "hider" ? "Escondido" : "Buscador"}`,
    });
  }, [timerInterval, players, currentPlayer, toast]);

  // Timer effect for turn management
  useEffect(() => {
    if (gamePhase === "playing") {
      const interval = setInterval(() => {
        setTurnTimeLeft((prev) => {
          if (prev <= 1) {
            endTurn();
            return 18; // Reset timer to 18 seconds for next turn
          }
          return prev - 1;
        });
      }, 1000);

      setTimerInterval(interval);

      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [gamePhase, currentPlayer, endTurn]);

  // Handle cooldowns
  useEffect(() => {
    if (gamePhase === "playing" && currentPlayer === 0) { // Only decrement at the start of hider's turn
      setPlayers(prevPlayers => {
        return prevPlayers.map(player => {
          const updatedCooldowns = { ...player.cooldowns };
          
          // Decrease all cooldowns by 1
          Object.keys(updatedCooldowns).forEach(itemId => {
            if (updatedCooldowns[itemId] > 0) {
              updatedCooldowns[itemId] -= 1;
            }
          });
          
          return {
            ...player,
            cooldowns: updatedCooldowns
          };
        });
      });
    }
  }, [currentTurn]);

  // Check for win conditions
  useEffect(() => {
    if (gamePhase === "playing") {
      // Check if seeker found hider
      const hider = players.find(p => p.role === "hider");
      const seeker = players.find(p => p.role === "seeker");
      
      if (hider && seeker && 
          hider.position.x === seeker.position.x && 
          hider.position.y === seeker.position.y) {
        toast({
          title: "¡Buscador gana!",
          description: "¡El buscador ha encontrado al escondido!",
        });
        endGame("seeker");
      }
      
      // Check if max turns reached
      if (currentTurn > maxTurns) {
        toast({
          title: "¡Escondido gana!",
          description: "¡El escondido ha sobrevivido durante 8 minutos!",
        });
        endGame("hider");
      }
    }
  }, [players, currentTurn]);

  // Game actions
  const startGame = () => {
    setGamePhase("playing");
    setCurrentTurn(1);
    setTurnTimeLeft(18); // Changed from 30 to 18 seconds
    setCurrentPlayer(0); // Hider starts
  };
  
  const endGame = (winner: PlayerRole) => {
    setGamePhase("ended");
    if (timerInterval) clearInterval(timerInterval);
    
    // Award points
    setPlayers(prevPlayers => {
      return prevPlayers.map(player => {
        if (player.role === winner) {
          return { ...player, points: player.points + 200 };
        }
        return player;
      });
    });
  };
  
  const resetGame = () => {
    if (timerInterval) clearInterval(timerInterval);
    
    setGamePhase("setup");
    setCurrentTurn(1);
    setTurnTimeLeft(18);
    setCurrentPlayer(0);
    
    // Reset player positions, visibility, items, cooldowns, name, and image
    setPlayers(prevPlayers => {
      return prevPlayers.map(player => {
        const initialPosition = player.role === "hider" ? { x: 1, y: 1 } : { x: 8, y: 8 };
        const initialName = player.role === "hider" ? "Escondido" : "Buscador";
        const initialAvatar = player.role === "hider" ? "👤" : "👁️";
        const initialColor = player.role === "hider" ? "game-hider" : "game-seeker";
        return {
          ...player,
          position: initialPosition,
          visible: player.role === "seeker", // Hider is invisible by default
          activeItems: {},
          cooldowns: {},
          items: [], // Also reset items
          points: 100, // Reset points if needed, or keep them
          name: initialName, // Reset name
          avatar: initialAvatar, // Reset avatar
          color: initialColor, // Reset color
          image: null // Reset image
        };
      });
    });

    // Reset store items availability if needed
    // setStoreItems(defaultStoreItems);

    toast({
      title: "Juego Reiniciado",
      description: "La partida ha sido reiniciada. ¡Prepara tu estrategia!",
    });
  };

  const movePlayer = (playerId: string, newPosition: PlayerPosition) => {
    // Check if the position is valid (within map bounds)
    if (
      newPosition.x < 0 || 
      newPosition.x >= mapSize.width || 
      newPosition.y < 0 || 
      newPosition.y >= mapSize.height
    ) {
      toast({
        title: "Movimiento inválido",
        description: "¡No puedes moverte fuera del mapa!",
        variant: "destructive"
      });
      return;
    }
    
    // Update player position
    setPlayers(prevPlayers => {
      return prevPlayers.map(player => {
        if (player.id === playerId) {
          return { ...player, position: newPosition };
        }
        return player;
      });
    });
  };

  // La función endTurn ahora está definida con useCallback arriba

  const buyItem = (playerId: string, itemId: string) => {
    const item = storeItems.find(item => item.id === itemId);
    const player = players.find(player => player.id === playerId);
    
    if (!item || !player) return;
    
    if (player.points >= item.cost) {
      // Deduct points and add item to player's inventory
      setPlayers(prevPlayers => {
        return prevPlayers.map(p => {
          if (p.id === playerId) { 
            return {
              ...p,
              points: p.points - item.cost,
              items: [...p.items, item]
            };
          }
          return p;
        });
      });
      
      toast({
        title: "Objeto comprado",
        description: `Has comprado ${item.name}`,
      });
    } else {
      toast({
        title: "Puntos insuficientes",
        description: "No tienes suficientes puntos para comprar este objeto",
        variant: "destructive"
      });
    }
  };

  const useItem = (playerId: string, itemId: string) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return;
    
    const item = player.items.find(i => i.id === itemId);
    if (!item) return;
    
    // Check if the item is on cooldown
    if (player.cooldowns[itemId] > 0) {
      toast({
        title: "Objeto en cooldown",
        description: `${item.name} estará disponible en ${player.cooldowns[itemId]} turnos`,
        variant: "destructive"
      });
      return;
    }
    
    // Apply item effect
    setPlayers(prevPlayers => {
      return prevPlayers.map(p => {
        if (p.id === playerId) {
          // Apply effect based on item type
          const updatedActiveItems = { ...p.activeItems };
          const updatedCooldowns = { ...p.cooldowns };
          
          updatedActiveItems[itemId] = true;
          updatedCooldowns[itemId] = item.cooldown;
          
          let updatedPlayer = {
            ...p,
            activeItems: updatedActiveItems,
            cooldowns: updatedCooldowns
          };
          
          // Apply special effects
          switch (item.effect) {
            case "invisible":
              updatedPlayer.visible = false;
              break;
            case "reveal":
              // Find and reveal the hider
              const hider = prevPlayers.find(p => p.role === "hider");
              if (hider) {
                toast({
                  title: "¡Escondido revelado!",
                  description: `El escondido está en la posición (${hider.position.x + 1}, ${hider.position.y + 1})`,
                });
              }
              break;
            // Other effects can be implemented here
          }
          
          return updatedPlayer;
        }
        return p;
      });
    });
    
    toast({
      title: "Objeto usado",
      description: `Has usado ${item.name}`,
    });
  };

  const updatePlayerCustomization = (playerId: string, name: string, avatar: string, color: string, image: string | null) => {
    setPlayers(prevPlayers =>
      prevPlayers.map(player =>
        player.id === playerId ? { ...player, name, avatar, color, image } : player
      )
    );
    toast({
      title: "Personalización guardada",
      description: `Se actualizó la configuración para ${name}.`,
    });
  };

  // Context value
  const value: GameContextType = {
    gamePhase,
    currentTurn,
    turnTimeLeft,
    maxTurns,
    players,
    currentPlayer,
    mapSize,
    storeItems,
    
    startGame,
    movePlayer,
    endTurn,
    buyItem,
    useItem,
    updatePlayerCustomization, // Añadir la nueva función al contexto
    resetGame
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

// Custom hook to use the game context
export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
