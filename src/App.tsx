
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Game from "./pages/Game";
import Instructions from "./pages/Instructions";
import Customize from "./pages/Customize";
import Tutorial from "./pages/Tutorial";
import NotFound from "./pages/NotFound";
import { GameProvider } from "./contexts/GameContext";
import { RoomProvider } from "./contexts/RoomContext";
import Lobby from "./pages/Lobby";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <RoomProvider>
        <GameProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/lobby" element={<Lobby />} />
              <Route path="/game" element={<Game />} />
              <Route path="/instructions" element={<Instructions />} />
              <Route path="/customize" element={<Customize />} />
              <Route path="/tutorial" element={<Tutorial />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </GameProvider>
      </RoomProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
