
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGame } from "@/contexts/GameContext";
import Map from "@/components/game/Map";
import Timer from "@/components/game/Timer";
import Shop from "@/components/game/Shop";
import PlayerInventory from "@/components/game/PlayerInventory";
import { Home, Eye, EyeOff, SkipForward } from "lucide-react";

const Game = () => {
  const { 
    gamePhase, 
    players, 
    currentPlayer, 
    currentTurn,
    startGame,
    endTurn,
    resetGame
  } = useGame();
  
  return (
    <div className="min-h-screen bg-game-dark text-game-light p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with navigation and game info */}
        <div className="flex justify-between items-center mb-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <Home className="h-4 w-4 mr-1" /> Inicio
            </Button>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <EyeOff className="h-4 w-4 mr-1 text-game-hider" />
              <span className="text-sm">Escondido</span>
            </div>
            <span className="text-sm text-gray-500">vs</span>
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1 text-game-seeker" />
              <span className="text-sm">Buscador</span>
            </div>
          </div>
          
          <div className="text-sm">
            Turno: {currentTurn}/{16}
          </div>
        </div>
        
        {gamePhase === "setup" && (
          <Card className="mb-8 bg-black/40 backdrop-blur-sm border-gray-800 text-game-light">
            <CardHeader>
              <CardTitle>¡Bienvenido a Cazador Oculto!</CardTitle>
              <CardDescription>
                Un juego de escondite por turnos. El escondido debe evitar ser encontrado por el buscador durante 8 minutos (16 turnos).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                Cada turno dura 30 segundos. Los jugadores pueden moverse una casilla por turno en cualquier dirección (horizontal o vertical).
              </p>
              <p className="text-sm">
                Compra objetos en la tienda para ayudarte en tu misión. El escondido comienza en la esquina superior izquierda y el buscador en la esquina inferior derecha.
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={startGame} className="w-full">
                Comenzar Juego
              </Button>
            </CardFooter>
          </Card>
        )}
        
        {gamePhase === "playing" && (
          <>
            {/* Game info */}
            <div className="mb-4">
              <Card className="bg-black/40 backdrop-blur-sm border-gray-800 text-game-light">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-lg font-semibold">
                        Turno del {players[currentPlayer].role === "hider" ? "Escondido" : "Buscador"}
                      </p>
                      <p className="text-sm text-gray-400">
                        {players[currentPlayer].role === "hider" 
                          ? "Evita ser encontrado" 
                          : "Encuentra al escondido"}
                      </p>
                    </div>
                    <Button onClick={endTurn} size="sm" variant="outline">
                      <SkipForward className="h-4 w-4 mr-1" />
                      Pasar Turno
                    </Button>
                  </div>
                  <Timer />
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Left sidebar with player info */}
              <div className="space-y-4">
                <Card className="bg-black/40 backdrop-blur-sm border-gray-800 text-game-light">
                  <CardHeader>
                    <CardTitle>
                      {players[currentPlayer].role === "hider" ? "Escondido" : "Buscador"}
                    </CardTitle>
                    <CardDescription>
                      Puntos: {players[currentPlayer].points}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center p-4">
                      <div className={`text-4xl mb-2 text-${players[currentPlayer].color}`}>
                        {players[currentPlayer].avatar}
                      </div>
                      <p className="text-sm">
                        {players[currentPlayer].role === "hider"
                          ? "Mantente escondido y sobrevive"
                          : "Encuentra al escondido antes de que se acabe el tiempo"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <PlayerInventory />
              </div>
              
              {/* Game Map */}
              <div className="md:col-span-2">
                <Map />
                
                <div className="mt-4">
                  <Tabs defaultValue="shop">
                    <TabsList className="w-full">
                      <TabsTrigger value="shop" className="w-full">Tienda</TabsTrigger>
                      <TabsTrigger value="rules" className="w-full">Reglas</TabsTrigger>
                    </TabsList>
                    <TabsContent value="shop">
                      <Shop />
                    </TabsContent>
                    <TabsContent value="rules">
                      <Card className="bg-black/40 backdrop-blur-sm border-gray-800 text-game-light">
                        <CardHeader>
                          <CardTitle>Reglas</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <p>• El escondido debe evitar ser encontrado durante 16 turnos (8 minutos).</p>
                          <p>• El buscador debe encontrar al escondido antes de que se acaben los turnos.</p>
                          <p>• Cada turno dura 30 segundos.</p>
                          <p>• Los jugadores se mueven 1 casilla por turno (horizontal o vertical).</p>
                          <p>• Usa la tienda para comprar objetos que te ayuden.</p>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </>
        )}
        
        {gamePhase === "ended" && (
          <Card className="mb-8 bg-black/40 backdrop-blur-sm border-gray-800 text-game-light">
            <CardHeader>
              <CardTitle className="text-center">¡Juego Terminado!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <div className="text-4xl font-bold mb-4">
                {currentTurn > 16 
                  ? "¡El Escondido ha ganado!" 
                  : "¡El Buscador ha ganado!"}
              </div>
              <p>
                {currentTurn > 16 
                  ? "El escondido logró sobrevivir durante 8 minutos." 
                  : "El buscador encontró al escondido."}
              </p>
              <div className="flex justify-center pt-4">
                <Button onClick={resetGame} className="mx-2">
                  Jugar de Nuevo
                </Button>
                <Button asChild variant="outline" className="mx-2">
                  <Link to="/">Volver al Inicio</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Game;
