
import React, { useEffect, useRef } from "react";

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Ajustar el tamaño del canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Configuración de partículas
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      type: "hider" | "seeker";
    }> = [];

    // Colores para cada tipo de partícula
    const colors = {
      hider: "rgba(0, 255, 136, 0.8)", // Verde neón para el escondido
      seeker: "rgba(255, 0, 89, 0.8)", // Rojo neón para el buscador
    };

    // Crear partículas iniciales
    const createParticles = () => {
      const numParticles = 50;
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          speedX: (Math.random() - 0.5) * 2,
          speedY: (Math.random() - 0.5) * 2,
          color: Math.random() > 0.5 ? colors.hider : colors.seeker,
          type: Math.random() > 0.5 ? "hider" : "seeker",
        });
      }
    };
    createParticles();

    // Dibujar líneas entre partículas cercanas
    const drawLines = (particle: typeof particles[0]) => {
      particles.forEach((p) => {
        const distance = Math.sqrt(
          Math.pow(particle.x - p.x, 2) + Math.pow(particle.y - p.y, 2)
        );
        if (distance < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${particle.type === "hider" ? "0,255,136" : "255,0,89"}, ${(1 - distance / 100) * 0.2})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }
      });
    };

    // Animar partículas
    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Rebotar en los bordes
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

        // Dibujar partícula
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // Dibujar líneas de conexión
        drawLines(particle);
      });

      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full z-0"
      style={{ background: "linear-gradient(to bottom, #000000, #1a1a1a)" }}
    />
  );
};

export default AnimatedBackground;
