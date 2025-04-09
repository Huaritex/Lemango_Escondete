
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, PlayCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AnimatedBackground from "@/components/AnimatedBackground";

const Tutorial = () => {
  const [showVideo, setShowVideo] = useState(false);
  
  return (
    <div className="min-h-screen bg-game-dark text-game-light p-4 flex flex-col items-center justify-center relative">
      <AnimatedBackground />
      
      <div className="max-w-4xl w-full relative z-10 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Tutorial: ¿Cómo jugar?</h1>
          <Link to="/">
            <Button variant="outline" size="sm">
              <Home className="h-4 w-4 mr-1" /> Volver al Inicio
            </Button>
          </Link>
        </div>
        
        <Card className="bg-black/40 backdrop-blur-sm border-gray-800 text-game-light p-6">
          <div className="aspect-video w-full bg-black/60 rounded-lg overflow-hidden flex items-center justify-center">
            {/* Thumbnail with play button */}
            <div 
              className="relative w-full h-full cursor-pointer group"
              onClick={() => setShowVideo(true)}
            >
              <img 
                src="https://images.unsplash.com/photo-1500673922987-e212871fec22" 
                alt="Tutorial Preview" 
                className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <PlayCircle className="w-20 h-20 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <h3 className="text-xl font-bold">Tutorial: Lemango Escóndete</h3>
                <p className="text-sm text-gray-300">Aprende a jugar en menos de 5 minutos</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 space-y-4">
            <h2 className="text-xl font-bold">¿Qué aprenderás?</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Las reglas básicas del juego</li>
              <li>Cómo moverte por el tablero</li>
              <li>Cómo usar los objetos de la tienda</li>
              <li>Estrategias para ganar como Escondido y como Buscador</li>
              <li>Consejos para conseguir más puntos</li>
            </ul>
            
            <div className="mt-8">
              <Button 
                className="bg-gradient-to-r from-game-hider to-game-seeker hover:opacity-90"
                onClick={() => setShowVideo(true)}
              >
                <PlayCircle className="mr-2 h-4 w-4" />
                Ver Tutorial Ahora
              </Button>
            </div>
          </div>
        </Card>
        
        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link to="/game">Jugar Ahora</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/instructions">Ver Instrucciones Detalladas</Link>
          </Button>
        </div>
      </div>
      
      <Dialog open={showVideo} onOpenChange={setShowVideo}>
        <DialogContent className="bg-black border-gray-800 p-0 max-w-4xl w-[90vw]">
          <DialogHeader className="p-4">
            <DialogTitle>Tutorial: Lemango Escóndete</DialogTitle>
            <DialogDescription>
              Un tutorial paso a paso para principiantes
            </DialogDescription>
          </DialogHeader>
          <div className="aspect-video w-full">
            <VideoPlayer />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Simple placeholder video player component
const VideoPlayer = () => {
  return (
    <div className="bg-black w-full h-full flex flex-col">
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-8">
          {/* Intro section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">¡Bienvenido a Lemango Escóndete!</h2>
            <p>Este es un juego de escondite por turnos donde un jugador se esconde y otro lo busca.</p>
            
            <div className="bg-gray-900/50 p-4 rounded-lg">
              <h3 className="font-bold mb-2">Lo básico:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>El juego dura 16 turnos (8 minutos)</li>
                <li>El <span className="text-game-hider">Escondido</span> empieza en la esquina superior izquierda</li>
                <li>El <span className="text-game-seeker">Buscador</span> empieza en la esquina inferior derecha</li>
                <li>Cada jugador tiene 30 segundos para su turno</li>
                <li>Presiona <kbd className="px-2 py-1 bg-gray-800 rounded">Espacio</kbd> para saltar tu turno</li>
              </ul>
            </div>
          </div>
          
          {/* Movement section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Cómo moverte</h2>
            <p>Puedes moverte una casilla en cada turno hacia arriba, abajo, izquierda o derecha.</p>
            
            <div className="grid grid-cols-3 gap-1 w-32 mx-auto my-4">
              <div className="w-10 h-10"></div>
              <div className="w-10 h-10 bg-gray-700/50 rounded-md flex items-center justify-center">↑</div>
              <div className="w-10 h-10"></div>
              
              <div className="w-10 h-10 bg-gray-700/50 rounded-md flex items-center justify-center">←</div>
              <div className="w-10 h-10 bg-blue-600/50 rounded-md flex items-center justify-center">
                <span className="h-4 w-4 bg-white rounded-full"></span>
              </div>
              <div className="w-10 h-10 bg-gray-700/50 rounded-md flex items-center justify-center">→</div>
              
              <div className="w-10 h-10"></div>
              <div className="w-10 h-10 bg-gray-700/50 rounded-md flex items-center justify-center">↓</div>
              <div className="w-10 h-10"></div>
            </div>
            
            <p className="text-sm">Nota: No puedes moverte en diagonal ni salir del mapa.</p>
          </div>
          
          {/* Objects section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Objetos de la tienda</h2>
            <p>Puedes comprar objetos con los puntos que ganas en cada turno.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="border border-gray-700 rounded-md p-3">
                <h3 className="font-semibold">Bomba de Humo</h3>
                <p className="text-xs text-gray-400">Te vuelve invisible durante 1 turno</p>
                <div className="flex justify-between items-center mt-2 text-xs">
                  <span className="text-yellow-500">Costo: 100 puntos</span>
                </div>
              </div>
              
              <div className="border border-gray-700 rounded-md p-3">
                <h3 className="font-semibold">Radar</h3>
                <p className="text-xs text-gray-400">Revela la posición del escondido</p>
                <div className="flex justify-between items-center mt-2 text-xs">
                  <span className="text-yellow-500">Costo: 150 puntos</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Winning section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">¿Cómo ganar?</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-game-hider/30 rounded-md p-4">
                <h3 className="text-game-hider font-bold mb-2">Para ganar como Escondido:</h3>
                <p className="text-sm">Sobrevive durante los 16 turnos sin ser encontrado.</p>
              </div>
              
              <div className="border border-game-seeker/30 rounded-md p-4">
                <h3 className="text-game-seeker font-bold mb-2">Para ganar como Buscador:</h3>
                <p className="text-sm">Encuentra al escondido antes de que se terminen los turnos.</p>
              </div>
            </div>
          </div>
          
          {/* Tips section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Consejos para principiantes</h2>
            
            <div className="bg-gray-900/50 p-4 rounded-lg">
              <ul className="list-disc pl-5 space-y-2">
                <li>Usa la <kbd className="px-2 py-1 bg-gray-800 rounded">Barra espaciadora</kbd> para saltar tu turno si no quieres moverte</li>
                <li>No gastes todos tus puntos al inicio, guarda algunos para emergencias</li>
                <li>Como Escondido, cambia tu dirección frecuentemente para confundir</li>
                <li>Como Buscador, cubre las áreas del mapa sistemáticamente</li>
              </ul>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-xl font-bold">¡Ahora estás listo para jugar!</p>
            <Button asChild className="mt-4 bg-gradient-to-r from-game-hider to-game-seeker hover:opacity-90">
              <Link to="/game">Comenzar a Jugar</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
