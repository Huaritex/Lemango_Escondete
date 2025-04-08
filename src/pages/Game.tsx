
import React, { useState, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGame } from "@/contexts/GameContext";
import Map from "@/components/game/Map";
import Timer from "@/components/game/Timer";
import Shop from "@/components/game/Shop";
import PlayerInventory from "@/components/game/PlayerInventory";
import { Home, Eye, EyeOff, SkipForward, HelpCircle, ArrowRight } from "lucide-react";

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
  
  const [tutorialOpen, setTutorialOpen] = useState(true);
  const [tutorialStep, setTutorialStep] = useState(0);
  
  const tutorialSteps = [
    {
      title: "¡Bienvenido a Lemango Escóndete!",
      description: "Un juego de escondite por turnos donde un jugador se esconde y otro lo busca.",
      content: (
        <div className="space-y-4">
          <p>En Lemango Escóndete jugarás por turnos con las siguientes reglas:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Un jugador será el <span className="text-game-hider font-medium">Escondido</span> y otro el <span className="text-game-seeker font-medium">Buscador</span>.</li>
            <li>El juego termina cuando el buscador encuentra al escondido o después de 16 turnos (8 minutos).</li>
            <li>Cada turno dura 30 segundos.</li>
          </ul>
        </div>
      )
    },
    {
      title: "El Mapa y Movimiento",
      description: "Aprende a moverte por el mapa.",
      content: (
        <div className="space-y-4">
          <p>El juego se desarrolla en un mapa cuadriculado:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>El <span className="text-game-hider font-medium">Escondido</span> comienza en la esquina superior izquierda.</li>
            <li>El <span className="text-game-seeker font-medium">Buscador</span> comienza en la esquina inferior derecha.</li>
            <li>En cada turno puedes moverte una casilla en cualquier dirección (horizontal o vertical).</li>
            <li>Para moverte, haz clic en una casilla adyacente a tu posición actual.</li>
          </ul>
        </div>
      )
    },
    {
      title: "La Tienda",
      description: "Usa objetos para ganar ventaja.",
      content: (
        <div className="space-y-4">
          <p>Durante el juego puedes comprar objetos en la tienda:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Usa puntos para comprar objetos que te dan ventajas.</li>
            <li>Cada objeto tiene un tiempo de espera (cooldown) antes de poder usarlo nuevamente.</li>
            <li>El <span className="text-game-hider font-medium">Escondido</span> puede usar objetos para mantenerse oculto.</li>
            <li>El <span className="text-game-seeker font-medium">Buscador</span> puede usar objetos para encontrar al escondido.</li>
          </ul>
        </div>
      )
    },
    {
      title: "Cómo Ganar",
      description: "Objetivos para cada jugador.",
      content: (
        <div className="space-y-4">
          <p><strong className="text-game-hider">Si eres el Escondido:</strong></p>
          <ul className="list-disc pl-5 mb-4">
            <li>Sobrevive durante los 16 turnos sin ser encontrado.</li>
            <li>Usa objetos para despistar al buscador.</li>
            <li>Evita patrones de movimiento predecibles.</li>
          </ul>
          <p><strong className="text-game-seeker">Si eres el Buscador:</strong></p>
          <ul className="list-disc pl-5">
            <li>Encuentra al escondido antes de que terminen los 16 turnos.</li>
            <li>Usa objetos como el radar para localizar al escondido.</li>
            <li>Cubre el mapa de forma sistemática.</li>
          </ul>
        </div>
      )
    }
  ];
  
  const closeTutorial = () => {
    setTutorialOpen(false);
  };
  
  const nextTutorialStep = () => {
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep(tutorialStep + 1);
    } else {
      closeTutorial();
    }
  };
  
  return (
    <div className="min-h-screen bg-game-dark text-game-light p-4">
      <div className="max-w-4xl mx-auto">
        {/* Tutorial Dialog */}
        <Dialog open={tutorialOpen && gamePhase === "setup"} onOpenChange={closeTutorial}>
          <DialogContent className="bg-black/90 border-gray-700 text-game-light max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center">
                <HelpCircle className="mr-2 h-5 w-5 text-yellow-500" />
                {tutorialSteps[tutorialStep].title}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                {tutorialSteps[tutorialStep].description}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {tutorialSteps[tutorialStep].content}
            </div>
            <DialogFooter>
              <div className="flex justify-between w-full">
                <span className="text-sm text-gray-500">
                  Paso {tutorialStep + 1} de {tutorialSteps.length}
                </span>
                <Button onClick={nextTutorialStep}>
                  {tutorialStep === tutorialSteps.length - 1 ? (
                    "Comenzar Juego"
                  ) : (
                    <>
                      Siguiente <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
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
              <CardTitle>¡Bienvenido a Lemango Escóndete!</CardTitle>
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
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setTutorialOpen(true)}>
                <HelpCircle className="mr-2 h-4 w-4" />
                Tutorial
              </Button>
              <Button onClick={startGame}>
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
