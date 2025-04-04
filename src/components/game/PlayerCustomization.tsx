
import React, { useState } from "react";
import { useGame, PlayerRole } from "@/contexts/GameContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const avatarOptions = [
  { value: "👤", label: "Persona" },
  { value: "👻", label: "Fantasma" },
  { value: "🐱", label: "Gato" },
  { value: "🐶", label: "Perro" },
  { value: "🦊", label: "Zorro" },
];

const colorOptions = [
  { value: "game-hider", label: "Púrpura" },
  { value: "game-seeker", label: "Naranja" },
  { value: "game-success", label: "Verde" },
  { value: "game-info", label: "Azul" },
  { value: "game-warning", label: "Amarillo" },
];

interface PlayerCustomizationProps {
  playerRole: PlayerRole;
}

const PlayerCustomization: React.FC<PlayerCustomizationProps> = ({ playerRole }) => {
  const { players, updatePlayerAvatar } = useGame();
  const player = players.find(p => p.role === playerRole)!;
  const [selectedAvatar, setSelectedAvatar] = useState(player.avatar);
  const [selectedColor, setSelectedColor] = useState(player.color);

  const handleSave = () => {
    if (player) {
      updatePlayerAvatar(player.id, selectedAvatar, selectedColor);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personaliza tu {playerRole === "hider" ? "Escondido" : "Buscador"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Avatar</h3>
          <RadioGroup
            value={selectedAvatar}
            onValueChange={setSelectedAvatar}
            className="flex flex-wrap gap-2"
          >
            {avatarOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem id={`avatar-${option.value}`} value={option.value} />
                <Label htmlFor={`avatar-${option.value}`} className="text-2xl cursor-pointer">
                  {option.value}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Color</h3>
          <RadioGroup
            value={selectedColor}
            onValueChange={setSelectedColor}
            className="flex flex-wrap gap-2"
          >
            {colorOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem id={`color-${option.value}`} value={option.value} />
                <Label htmlFor={`color-${option.value}`} className="cursor-pointer">
                  <div className={`w-6 h-6 rounded-full bg-${option.value}`} />
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="pt-4">
          <Button onClick={handleSave} className="w-full">Guardar</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerCustomization;
