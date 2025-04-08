
import React from "react";

const AnimatedBackground: React.FC = () => {
  return (
    <section className="absolute w-full h-full flex justify-center items-center gap-0.5 flex-wrap overflow-hidden -z-10">
      <style>{`
        section {
          position: absolute;
          width: 100vw;
          height: 100vh;
          display: flex;
          justify-center;
          align-items: center;
          gap: 2px;
          flex-wrap: wrap;
          overflow: hidden;
        }
        section::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </section>
  );
};

export default AnimatedBackground;
