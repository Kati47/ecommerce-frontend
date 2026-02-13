"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function SplashScreen() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = globalThis.setTimeout(() => {
      setVisible(false);
    }, 2600);

    return () => globalThis.clearTimeout(timer);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-50 grid place-items-center overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: 'url("/marbel.jpg")',
      }}
    >
      {/* Overlay for better logo visibility */}
      <div className="absolute inset-0 bg-black/10" />
      
      <div className="relative z-10 animate-splash text-center">
        <div className="mx-auto mb-6 h-px w-28 luxury-divider" />
        <Image
          src="/logogogo-removebg-preview-Picsart-AiImageEnhancer.png"
          alt="Blisora logo"
          width={240}
          height={120}
          priority
          className="mx-auto"
        />
        <div className="mx-auto mt-6 h-px w-28 luxury-divider" />
      </div>
    </div>
  );
}
