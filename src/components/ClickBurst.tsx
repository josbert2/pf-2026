import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Burst {
  id: number;
  x: number;
  y: number;
}

export default function ClickBurst() {
  const [bursts, setBursts] = useState<Burst[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Create a unique ID for each click
      const id = Date.now();
      
      setBursts((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);

      // Remove the burst after animation completes
      setTimeout(() => {
        setBursts((prev) => prev.filter((b) => b.id !== id));
      }, 1000);
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      <AnimatePresence>
        {bursts.map((burst) => (
          <motion.div
            key={burst.id}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="absolute"
            style={{
              left: burst.x,
              top: burst.y,
              transform: "translate(-50%, -50%)",
            }}
          >
            <svg
              width="85"
              height="85"
              viewBox="0 0 85 85"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="overflow-visible"
            >
              {/* Top Right */}
              <motion.path
                d="M 48.5 36.5 Q 57.5 21.5 60.5 24.5 T 72.5 12.5"
                stroke="#D25E4D"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 1 }}
                animate={{ pathLength: [0, 1, 1], opacity: [1, 1, 0] }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
              {/* Top */}
              <motion.path
                d="M 42.5 34 Q 38.25 17 42.5 17 T 42.5 0"
                stroke="#D25E4D"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 1 }}
                animate={{ pathLength: [0, 1, 1], opacity: [1, 1, 0] }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
              />
              {/* Top Left */}
              <motion.path
                d="M 36.5 36.5 Q 21.5 27.5 24.5 24.5 T 12.5 12.5"
                stroke="#D25E4D"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 1 }}
                animate={{ pathLength: [0, 1, 1], opacity: [1, 1, 0] }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
              />
              {/* Left */}
              <motion.path
                d="M 34 42.5 Q 17 46.75 17 42.5 T 0 42.5"
                stroke="#D25E4D"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 1 }}
                animate={{ pathLength: [0, 1, 1], opacity: [1, 1, 0] }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
              />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
