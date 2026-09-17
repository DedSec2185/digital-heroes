import React, { useEffect, useState } from 'react';

export const InteractiveBackdrop: React.FC = () => {
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: -500, y: -500 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Interactive Cursor Spotlight Glow */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-3xl transition-transform duration-75 ease-out opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.45) 0%, rgba(245, 158, 11, 0.15) 45%, transparent 70%)',
          transform: `translate(${mousePos.x - 300}px, ${mousePos.y - 300}px)`,
        }}
      />

      {/* Cyber Grid Pattern with Radial Vignette */}
      <div className="absolute inset-0 bg-grid-pattern bg-radial-mask opacity-30" />

      {/* Ambient Drifting Glowing Orbs */}
      <div className="absolute top-10 left-[15%] w-96 h-96 rounded-full bg-emerald-600/15 blur-[120px] animate-float" />
      <div className="absolute top-[40%] right-[10%] w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[140px] animate-float-reverse" />
      <div className="absolute bottom-[10%] left-[25%] w-[450px] h-[450px] rounded-full bg-teal-600/15 blur-[130px] animate-float" />
    </div>
  );
};
