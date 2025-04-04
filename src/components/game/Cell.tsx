
import React from "react";
import { PlayerState } from "@/contexts/GameContext";

interface CellProps {
  x: number;
  y: number;
  onClick: () => void;
  players: PlayerState[];
}

const Cell: React.FC<CellProps> = ({ x, y, onClick, players }) => {
  const hasPlayer = players.length > 0;
  
  // Different cell styles for different positions
  const isCorner = (x === 0 && y === 0) || 
                   (x === 0 && y === 9) || 
                   (x === 9 && y === 0) || 
                   (x === 9 && y === 9);
                   
  const isEdge = x === 0 || x === 9 || y === 0 || y === 9;
  
  let cellStyle = "w-12 h-12 flex items-center justify-center transition-all duration-200";
  
  if (isCorner) {
    cellStyle += " bg-gray-800";
  } else if (isEdge) {
    cellStyle += " bg-gray-700";
  } else {
    cellStyle += " bg-gray-600";
  }
  
  cellStyle += " hover:bg-gray-500 cursor-pointer";
  
  return (
    <div className={cellStyle} onClick={onClick}>
      {hasPlayer ? (
        <div className={`text-2xl animate-pulse-player text-${players[0].color}`}>
          {players[0].avatar}
        </div>
      ) : (
        <span className="text-xs text-gray-400 opacity-30">{`${x},${y}`}</span>
      )}
    </div>
  );
};

export default Cell;
