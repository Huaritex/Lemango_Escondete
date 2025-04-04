
import React from "react";
import { useGame } from "@/contexts/GameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

const PlayerInventory: React.FC = () => {
  const { players, currentPlayer, useItem } = useGame();
  const player = players[currentPlayer];
  
  if (player.items.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Inventario</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">No tienes objetos. Compra algunos en la tienda!</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Inventario</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {player.items.map((item) => {
          const isOnCooldown = player.cooldowns[item.id] > 0;
          const cooldownValue = player.cooldowns[item.id] || 0;
          
          return (
            <div
              key={item.id}
              className="flex items-center justify-between p-2 border rounded-md"
            >
              <div>
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-xs text-gray-500">{item.description}</p>
                {isOnCooldown && (
                  <p className="text-xs flex items-center text-yellow-500">
                    <Clock className="h-3 w-3 mr-1" />
                    Disponible en {cooldownValue} turnos
                  </p>
                )}
              </div>
              <Button
                size="sm"
                onClick={() => useItem(player.id, item.id)}
                disabled={isOnCooldown}
                variant={isOnCooldown ? "outline" : "default"}
              >
                Usar
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default PlayerInventory;
