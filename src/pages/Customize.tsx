
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home } from "lucide-react";
import PlayerCustomization from "@/components/game/PlayerCustomization";
import { GameProvider } from "@/contexts/GameContext";

const Customize = () => {
  return (
    <GameProvider>
      <div className="min-h-screen bg-game-dark text-game-light p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Personalización</h1>
            <Link to="/">
              <Button variant="ghost" size="sm">
                <Home className="h-4 w-4 mr-1" /> Volver
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PlayerCustomization playerRole="hider" />
            <PlayerCustomization playerRole="seeker" />
          </div>

          <div className="mt-8 text-center">
            <Button asChild className="mx-auto">
              <Link to="/game">Comenzar a Jugar</Link>
            </Button>
          </div>
        </div>
      </div>
    </GameProvider>
  );
};

export default Customize;
