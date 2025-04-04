
import React from "react";
import { useGame, PlayerPosition } from "@/contexts/GameContext";
import Cell from "./Cell";

const Map: React.FC = () => {
  const { mapSize, players, currentPlayer, movePlayer } = useGame();
  const { width, height } = mapSize;
  
  const handleCellClick = (x: number, y: number) => {
    // Only allow moving one cell at a time (except when speed boost is active)
    const player = players[currentPlayer];
    const currentPos = player.position;
    
    // Calculate Manhattan distance (for simple movement)
    const distance = Math.abs(x - currentPos.x) + Math.abs(y - currentPos.y);
    
    // Check if movement is valid (1 cell at a time)
    if (distance === 1) {
      movePlayer(player.id, { x, y });
    }
  };
  
  const generateGrid = () => {
    const grid = [];
    
    for (let y = 0; y < height; y++) {
      const row = [];
      for (let x = 0; x < width; x++) {
        // Check if any player is on this cell
        const playersOnCell = players.filter(
          p => p.position.x === x && p.position.y === y && p.visible
        );
        
        row.push(
          <Cell 
            key={`${x}-${y}`} 
            x={x} 
            y={y} 
            onClick={() => handleCellClick(x, y)}
            players={playersOnCell}
          />
        );
      }
      grid.push(
        <div key={`row-${y}`} className="flex">
          {row}
        </div>
      );
    }
    
    return grid;
  };
  
  return (
    <div className="bg-game-dark p-2 rounded-lg shadow-lg animate-fade-in">
      <div className="grid-container">{generateGrid()}</div>
    </div>
  );
};

export default Map;
