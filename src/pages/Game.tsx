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
import { Home, Eye, EyeOff, SkipForward, HelpCircle, ArrowRight, MousePointer, MoveRight } from "lucide-react";

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
  
  const sampleBoard = Array(5).fill(Array(5).fill(null));
  
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space' && gamePhase === 'playing') {
        // Prevent default behavior (scrolling)
        event.preventDefault();
        
        endTurn();
        
        const skipButton = document.querySelector('[data-skip-turn]');
        if (skipButton) {
          skipButton.classList.add('animate-pulse');
          setTimeout(() => {
            skipButton.classList.remove('animate-pulse');
          }, 300);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [gamePhase, endTurn]);
  
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
            <li>Cada turno dura 18 segundos.</li>
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
          
          <div className="mt-4 bg-black/40 p-3 rounded-md">
            <p className="text-sm font-medium mb-2">Ejemplo de Movimiento:</p>
            <div className="grid grid-cols-5 gap-1 mb-3">
              {sampleBoard.map((row, y) => (
                <React.Fragment key={`row-${y}`}>
                  {row.map((_, x) => (
                    <div
                      key={`cell-${x}-${y}`}
                      className={`w-10 h-10 flex items-center justify-center border border-gray-700 rounded-sm ${
                        (x === 0 && y === 0) 
                          ? 'bg-game-hider text-white' 
                          : (x === 4 && y === 4) 
                          ? 'bg-game-seeker text-white'
                          : (x === 1 && y === 0) 
                          ? 'bg-yellow-500/30 border-yellow-500'
                          : 'bg-gray-800/40'
                      }`}
                    >
                      {(x === 0 && y === 0) ? 'E' : (x === 4 && y === 4) ? 'B' : ''}
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
            <div className="flex items-center text-sm text-gray-300">
              <div className="flex items-center">
                <MousePointer className="h-4 w-4 mr-1" /> 
                <span>Haz clic en una casilla adyacente</span>
              </div>
              <MoveRight className="mx-2 h-4 w-4" />
              <div className="w-6 h-6 flex items-center justify-center rounded-sm bg-yellow-500/30 border border-yellow-500">
              </div>
              <span className="ml-2">Casilla válida para moverte</span>
            </div>
          </div>
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
          
          <div className="mt-4 bg-black/40 p-3 rounded-md">
            <p className="text-sm font-medium mb-2">Ejemplo de Objetos:</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="border border-gray-700 p-2 rounded-md bg-gray-800/50">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-game-hider">Humo</span>
                  <span className="text-xs bg-gray-700 px-2 py-0.5 rounded">5 pts</span>
                </div>
                <p className="text-xs text-gray-300">Te vuelve invisible por un turno</p>
              </div>
              <div className="border border-gray-700 p-2 rounded-md bg-gray-800/50">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-game-seeker">Radar</span>
                  <span className="text-xs bg-gray-700 px-2 py-0.5 rounded">10 pts</span>
                </div>
                <p className="text-xs text-gray-300">Detecta al jugador en un radio de 3 casillas</p>
              </div>
            </div>
            <p className="text-sm mt-3">Haz clic en un objeto para comprarlo y luego podrás usarlo durante tu turno.</p>
          </div>
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
          
          <div className="mt-4 bg-black/40 p-3 rounded-md">
            <p className="text-sm font-medium mb-2">Ejemplo de victoria:</p>
            <div className="flex space-x-4">
              <div className="flex-1 border border-gray-700 p-2 rounded-md bg-gray-800/50">
                <p className="text-sm font-medium text-game-hider mb-2">Victoria del Escondido</p>
                <div className="text-xs text-gray-300">
                  Se logra cuando el tiempo se acaba (16 turnos) y el buscador no te ha encontrado
                </div>
                <div className="text-center mt-2">
                  <div className="inline-block px-2 py-1 bg-green-500/20 border border-green-500 text-green-400 rounded text-xs">
                    ¡Supervivencia exitosa!
                  </div>
                </div>
              </div>
              <div className="flex-1 border border-gray-700 p-2 rounded-md bg-gray-800/50">
                <p className="text-sm font-medium text-game-seeker mb-2">Victoria del Buscador</p>
                <div className="text-xs text-gray-300">
                  Se logra cuando encuentras al escondido moviéndote a su misma casilla
                </div>
                <div className="text-center mt-2">
                  <div className="inline-block px-2 py-1 bg-green-500/20 border border-green-500 text-green-400 rounded text-xs">
                    ¡Lo encontraste!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "¡Hora de Jugar!",
      description: "Ya estás listo para comenzar.",
      content: (
        <div className="space-y-4">
          <p>Ahora que conoces las reglas básicas, ¡es hora de jugar!</p>
          <div className="bg-black/40 p-3 rounded-md">
            <p className="text-sm font-medium mb-2">Recuerda:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Muévete una casilla por turno</li>
              <li>Compra objetos para obtener ventajas</li>
              <li>El escondido debe sobrevivir 16 turnos</li>
              <li>El buscador debe encontrar al escondido</li>
            </ul>
            <div className="mt-3 text-center">
              <p className="text-yellow-400">¡Buena suerte!</p>
            </div>
          </div>
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
                Cada turno dura 18 segundos. Los jugadores pueden moverse una casilla por turno en cualquier dirección (horizontal o vertical).
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
                    <Button 
                      onClick={endTurn} 
                      size="sm" 
                      variant="outline"
                      data-skip-turn
                    >
                      <SkipForward className="h-4 w-4 mr-1" />
                      Pasar Turno <span className="ml-1 text-xs opacity-70">[Espacio]</span>
                    </Button>
                  </div>
                  <Timer />
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                          <p>• Cada turno dura 18 segundos.</p>
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
