
import React from "react";
import { useGame } from "@/contexts/GameContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Coins, Clock } from "lucide-react";

const Shop: React.FC = () => {
  const { storeItems, buyItem, players, currentPlayer } = useGame();
  const currentPlayerState = players[currentPlayer];
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Tienda</span>
          <span className="flex items-center text-yellow-500">
            <Coins className="mr-1 h-4 w-4" />
            {currentPlayerState.points}
          </span>
        </CardTitle>
        <CardDescription>
          Compra objetos para ayudar en tu misión
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {storeItems.map((item) => {
          const isOnCooldown = currentPlayerState.cooldowns[item.id] > 0;
          const cooldownValue = currentPlayerState.cooldowns[item.id] || 0;
          const canAfford = currentPlayerState.points >= item.cost;
          
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
                variant="outline"
                size="sm"
                onClick={() => buyItem(currentPlayerState.id, item.id)}
                disabled={!canAfford || isOnCooldown}
                className="flex items-center"
              >
                <Coins className="mr-1 h-3 w-3 text-yellow-500" />
                {item.cost}
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default Shop;
