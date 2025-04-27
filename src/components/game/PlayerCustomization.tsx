
import React, { useState, useRef, useEffect } from "react";
import { useGame, PlayerRole } from "@/contexts/GameContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Importar Input
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Upload } from "lucide-react"; // Importar iconos

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
  const { players, updatePlayerCustomization } = useGame(); // Usar nueva función
  const player = players.find(p => p.role === playerRole)!;
  const [selectedAvatar, setSelectedAvatar] = useState(player.avatar);
  const [selectedColor, setSelectedColor] = useState(player.color);
  const [playerName, setPlayerName] = useState(player.name); // Estado para el nombre
  const [playerImage, setPlayerImage] = useState<string | null>(player.image || null); // Estado para la imagen (URL o null)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const handleSave = () => {
    if (player) {
      updatePlayerCustomization(player.id, playerName, selectedAvatar, selectedColor, playerImage);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPlayerImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraClick = async () => {
    setCameraError(null);
    try {
      // Solicitar permiso para la cámara
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Detener el stream inmediatamente, solo necesitábamos el permiso
      stream.getTracks().forEach(track => track.stop());
      // Si el permiso se concede, activar el input de la cámara
      cameraInputRef.current?.click();
    } catch (err) {
      console.error("Error al acceder a la cámara:", err);
      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError') {
          setCameraError("Permiso de cámara denegado. Por favor, habilita el acceso en la configuración de tu navegador.");
        } else if (err.name === 'NotFoundError') {
          setCameraError("No se encontró ninguna cámara conectada.");
        } else {
          setCameraError("Error al acceder a la cámara. Asegúrate de que no esté siendo usada por otra aplicación.");
        }
      } else {
        setCameraError("Ocurrió un error inesperado al intentar usar la cámara.");
      }
    }
  };

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPlayerImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="bg-black/40 backdrop-blur-sm border-gray-800 text-game-light">
      <CardHeader>
        <CardTitle>Personaliza tu {playerRole === "hider" ? "Escondido" : "Buscador"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor={`name-${playerRole}`} className="text-sm font-medium">Nombre</Label>
          <Input
            id={`name-${playerRole}`}
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder={`Nombre del ${playerRole === "hider" ? "Escondido" : "Buscador"}`}
            className="bg-gray-800/50 border-gray-700 text-white"
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Imagen / Skin</h3>
          <div className="flex items-center space-x-4">
            {playerImage ? (
              <img src={playerImage} alt="Player skin" className="w-16 h-16 rounded-full object-cover border-2 border-gray-600" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-3xl">
                {selectedAvatar}
              </div>
            )}
            <div className="flex flex-col space-y-2">
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="border-gray-700 text-gray-300 hover:text-white">
                <Upload className="mr-2 h-4 w-4" /> Cargar Archivo
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <Button variant="outline" size="sm" onClick={handleCameraClick} className="border-gray-700 text-gray-300 hover:text-white">
                <Camera className="mr-2 h-4 w-4" /> Usar Cámara
              </Button>
              <input
                type="file"
                ref={cameraInputRef}
                onChange={handleCameraCapture}
                accept="image/*"
                capture="environment" // O 'user' para cámara frontal
                style={{ display: 'none' }}
              />
            </div>
          </div>
          {cameraError && <p className="text-xs text-red-500 mt-2">{cameraError}</p>}
          <p className="text-xs text-gray-400 mt-2">Si no subes una imagen, se usará el avatar seleccionado.</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Avatar (si no usas imagen)</h3>
          <RadioGroup
            value={selectedAvatar}
            onValueChange={setSelectedAvatar}
            className="flex flex-wrap gap-2"
          >
            {avatarOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem id={`avatar-${playerRole}-${option.value}`} value={option.value} className="text-white border-gray-600" />
                <Label htmlFor={`avatar-${playerRole}-${option.value}`} className="text-2xl cursor-pointer">
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
                <RadioGroupItem id={`color-${playerRole}-${option.value}`} value={option.value} className="text-white border-gray-600" />
                <Label htmlFor={`color-${playerRole}-${option.value}`} className="cursor-pointer">
                  <div className={`w-6 h-6 rounded-full bg-${option.value} border border-gray-600`} />
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="pt-4">
          <Button onClick={handleSave} className="w-full bg-gradient-to-r from-game-hider to-game-seeker hover:opacity-90">Guardar Cambios</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerCustomization;
