import React from "react";

interface DecoStickerProps {
  src: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function DecoSticker({ src, alt = "Deco", className = "", style }: DecoStickerProps) {
  return (
    <div 
      className={`absolute pointer-events-none z-0 overflow-visible ${className}`}
      style={style}
    >
      <img 
        src={src} 
        alt={alt} 
        className="block w-full h-full object-cover rounded-inherit"
        draggable={false}
      />
    </div>
  );
}
