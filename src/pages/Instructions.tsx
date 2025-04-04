
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Eye, EyeOff, Clock, ShoppingBag, Gamepad } from "lucide-react";

const Instructions = () => {
  return (
    <div className="min-h-screen bg-game-dark text-game-light p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Instrucciones</h1>
          <Link to="/">
            <Button variant="ghost" size="sm">
              <Home className="h-4 w-4 mr-1" /> Volver
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="basics" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="basics" className="w-full">
              <Gamepad className="h-4 w-4 mr-1" /> Conceptos Básicos
            </TabsTrigger>
            <TabsTrigger value="roles" className="w-full">
              <Eye className="h-4 w-4 mr-1" /> Roles
            </TabsTrigger>
            <TabsTrigger value="items" className="w-full">
              <ShoppingBag className="h-4 w-4 mr-1" /> Objetos
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="basics">
            <Card className="bg-black/40 backdrop-blur-sm border-gray-800 text-game-light">
              <CardHeader>
                <CardTitle>Conceptos Básicos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center">
                    <Clock className="h-4 w-4 mr-1" /> Turnos y Tiempo
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>El juego se divide en turnos de 30 segundos.</li>
                    <li>El juego termina después de 16 turnos (8 minutos) o si el buscador encuentra al escondido.</li>
                    <li>Los jugadores alternan turnos: primero el escondido, luego el buscador.</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center">
                    <Gamepad className="h-4 w-4 mr-1" /> Movimiento
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>En cada turno, un jugador puede moverse una casilla en cualquier dirección (arriba, abajo, izquierda o derecha).</li>
                    <li>No se puede mover en diagonal.</li>
                    <li>No se puede salir del mapa.</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Objetivo</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li><strong>Escondido:</strong> Sobrevivir durante 16 turnos sin ser encontrado.</li>
                    <li><strong>Buscador:</strong> Encontrar al escondido antes de que se acaben los 16 turnos.</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Victoria</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>El escondido gana si logra sobrevivir todos los turnos.</li>
                    <li>El buscador gana si logra encontrar al escondido (estar en la misma casilla).</li>
                    <li>El jugador ganador recibe 200 puntos adicionales.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="roles">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-black/40 backdrop-blur-sm border-gray-800 text-game-light">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-game-hider">
                    <EyeOff className="h-5 w-5 mr-2" /> El Escondido
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>El escondido comienza en la esquina superior izquierda del mapa.</p>
                  <div>
                    <h4 className="font-medium mb-1">Ventajas:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Comienza invisible para el buscador (solo se revela si está en la misma casilla).</li>
                      <li>Puede usar objetos para mantenerse escondido o confundir al buscador.</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Estrategias:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Evita movimientos predecibles.</li>
                      <li>Usa objetos en momentos críticos para evadir al buscador.</li>
                      <li>Maneja bien los puntos para comprar objetos útiles.</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-black/40 backdrop-blur-sm border-gray-800 text-game-light">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-game-seeker">
                    <Eye className="h-5 w-5 mr-2" /> El Buscador
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>El buscador comienza en la esquina inferior derecha del mapa.</p>
                  <div>
                    <h4 className="font-medium mb-1">Ventajas:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Puede ver al escondido cuando está en la misma casilla.</li>
                      <li>Puede usar objetos como el radar para localizar al escondido.</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Estrategias:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Cubre áreas grandes del mapa de forma sistemática.</li>
                      <li>Usa el radar en momentos clave para localizar al escondido.</li>
                      <li>Presta atención a patrones de movimiento del escondido.</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="items">
            <Card className="bg-black/40 backdrop-blur-sm border-gray-800 text-game-light">
              <CardHeader>
                <CardTitle>Objetos en la Tienda</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">
                  Los objetos se compran con puntos. Ambos jugadores comienzan con 100 puntos. 
                  Los objetos tienen un tiempo de reutilización (cooldown) después de ser usados.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-700 rounded-md p-3">
                    <h3 className="font-semibold">Bomba de Humo</h3>
                    <p className="text-xs text-gray-400">Te vuelve invisible durante 1 turno</p>
                    <div className="flex justify-between items-center mt-2 text-xs">
                      <span className="text-yellow-500">Costo: 100 puntos</span>
                      <span className="text-gray-400">Cooldown: 2 turnos</span>
                    </div>
                  </div>
                  
                  <div className="border border-gray-700 rounded-md p-3">
                    <h3 className="font-semibold">Radar</h3>
                    <p className="text-xs text-gray-400">Revela la posición del escondido</p>
                    <div className="flex justify-between items-center mt-2 text-xs">
                      <span className="text-yellow-500">Costo: 150 puntos</span>
                      <span className="text-gray-400">Cooldown: 3 turnos</span>
                    </div>
                  </div>
                  
                  <div className="border border-gray-700 rounded-md p-3">
                    <h3 className="font-semibold">Incremento de Velocidad</h3>
                    <p className="text-xs text-gray-400">Te permite moverte 2 casillas adicionales en tu próximo turno</p>
                    <div className="flex justify-between items-center mt-2 text-xs">
                      <span className="text-yellow-500">Costo: 75 puntos</span>
                      <span className="text-gray-400">Cooldown: 2 turnos</span>
                    </div>
                  </div>
                  
                  <div className="border border-gray-700 rounded-md p-3">
                    <h3 className="font-semibold">Trampa</h3>
                    <p className="text-xs text-gray-400">Coloca una trampa que revela al escondido si pasa sobre ella</p>
                    <div className="flex justify-between items-center mt-2 text-xs">
                      <span className="text-yellow-500">Costo: 125 puntos</span>
                      <span className="text-gray-400">Cooldown: 2 turnos</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <h3 className="font-semibold mb-2">Cómo usar los objetos</h3>
                  <ol className="list-decimal pl-5 space-y-1 text-sm">
                    <li>Compra el objeto en la tienda durante tu turno.</li>
                    <li>El objeto aparecerá en tu inventario.</li>
                    <li>Haz clic en "Usar" para activar el efecto del objeto.</li>
                    <li>Después de usar un objeto, entrará en cooldown y no podrás usarlo hasta que termine.</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 flex justify-center">
          <Button asChild className="mr-4">
            <Link to="/game">Jugar Ahora</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/customize">Personalizar Personaje</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Instructions;
