
import React, { useEffect, useState } from "react";
import { useGame } from "@/contexts/GameContext";
import { Progress } from "@/components/ui/progress";

const Timer: React.FC = () => {
  const { turnTimeLeft, currentPlayer, players } = useGame();
  const [progressValue, setProgressValue] = useState(100);
  
  useEffect(() => {
    // Convert seconds to percentage
    setProgressValue((turnTimeLeft / 30) * 100);
  }, [turnTimeLeft]);
  
  const playerColor = players[currentPlayer].role === "hider" 
    ? "bg-game-hider" 
    : "bg-game-seeker";
    
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">
          Turno de: {players[currentPlayer].name}
        </span>
        <span className="text-sm font-medium">
          {turnTimeLeft}s
        </span>
      </div>
      <Progress value={progressValue} className={`h-2 ${playerColor}`} />
    </div>
  );
};

export default Timer;
