import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { COLOR, FONT } from "./tokens";

/**
 * Card "but I'm also" — `framer-1v46bda` (355x349, rotate -1deg).
 * Contiene el título `framer-joasiy` y la lista `framer-i9jeek` de 6 roles.
 * En el original un item está activo (opacity 1) y el resto a 0.6; acá
 * lo ciclamos para reproducir la animación.
 */

const PARTS = [
  "an ai-powered coder",
  "a digital artist",
  "a mentor",
  "a martial artist",
  "a cautious skateboarder",
  "a loving husband and father",
];

export default function PartsOfMe() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % PARTS.length),
      2200,
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{
        width: 355,
        height: 349,
        padding: "0 10px",
        backgroundColor: COLOR.creamPaper,
        borderRadius: 1,
        boxShadow: "rgba(0,0,0,0.25) 0px 1px 2px 0px",
        transform: "rotate(-1deg)",
        overflow: "clip",
      }}
    >
      {/* framer-148s8sg */}
      <div
        className="flex flex-col items-center"
        style={{ width: 335, gap: 10 }}
      >
        {/* Título — framer-joasiy */}
        <h3
          className="w-full text-left"
          style={{
            fontFamily: FONT.hand,
            fontSize: 26,
            lineHeight: "31.2px",
            color: COLOR.red,
          }}
        >
          I'm a product designer
          <br />
          but I'm also&hellip;
        </h3>

        {/* Lista — framer-i9jeek */}
        <ul
          className="flex flex-col w-full"
          style={{ paddingLeft: 20 }}
        >
          {PARTS.map((part, i) => (
            <li key={part} className="list-none" style={{ height: 39 }}>
              <motion.span
                className="block"
                style={{
                  fontFamily: FONT.hand,
                  fontSize: 26,
                  lineHeight: "39px",
                  color: COLOR.red,
                }}
                animate={{ opacity: i === active ? 1 : 0.6 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                {part}
              </motion.span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
