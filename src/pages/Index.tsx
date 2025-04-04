
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GameProvider } from "@/contexts/GameContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Book, Gamepad, User } from "lucide-react";

const Index = () => {
  return (
    <GameProvider>
      <div className="min-h-screen bg-game-dark text-game-light flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8 animate-slide-up">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-game-light mb-2">Lemango Escóndete</h1>
            <p className="text-lg text-gray-400">Un juego de escondite por turnos</p>
          </div>
          
          <Card className="bg-black/40 backdrop-blur-sm border-gray-800 text-game-light">
            <CardHeader>
              <CardTitle className="text-center">Menú Principal</CardTitle>
              <CardDescription className="text-center text-gray-400">
                Selecciona una opción para continuar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full bg-gradient-to-r from-game-hider to-game-seeker hover:opacity-90">
                <Link to="/game">
                  <Gamepad className="mr-2 h-4 w-4" />
                  Jugar
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full border-gray-700 text-gray-300 hover:text-white">
                <Link to="/instructions">
                  <Book className="mr-2 h-4 w-4" />
                  Instrucciones
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full border-gray-700 text-gray-300 hover:text-white">
                <Link to="/customize">
                  <User className="mr-2 h-4 w-4" />
                  Personalizar
                </Link>
              </Button>
            </CardContent>
            <CardFooter className="flex justify-between text-xs text-gray-500">
              <div className="flex items-center">
                <EyeOff className="h-3 w-3 mr-1 text-game-hider" /> 
                <span>Escóndete</span>
              </div>
              <div className="flex items-center">
                <Eye className="h-3 w-3 mr-1 text-game-seeker" /> 
                <span>Busca</span>
              </div>
            </CardFooter>
          </Card>
          
          <p className="text-xs text-center text-gray-500">
            Desarrollado por Lovable - v1.0 - 2023
          </p>
        </div>
      </div>
    </GameProvider>
  );
};

export default Index;
