import { motion } from "motion/react";

const STAMPS = [
  { src: "https://framerusercontent.com/images/JnX4DQ93dVEHzTFGkUsZLNV4.png?width=157&height=157", alt: "Zhang" },
  { src: "https://framerusercontent.com/images/RYvnMMGEz4Ds3BGL5W1lRp9GOCU.png?width=157&height=157", alt: "Restaurant kid" },
  { src: "https://framerusercontent.com/images/zs8DG1Zf6J6s1d5yc00xHp98b60.png?width=157&height=157", alt: "Digital world" },
  { src: "https://framerusercontent.com/images/X8TlTAmfaqh8FaOYxjSjYMniaE.png?width=157&height=159", alt: "Fynbos" },
  { src: "https://framerusercontent.com/images/J4bjhr8zDlxffN0kZnWBShva0GY.png?width=157&height=157", alt: "Night owl" },
  { src: "https://framerusercontent.com/images/2LGPmWLUdShRmg0q79YvdcxivM.png?width=157&height=157", alt: "More fynbos" },
  { src: "https://framerusercontent.com/images/jvHISkS7qP9hkgBbgfRCAiPpjjI.png?width=157&height=163", alt: "Even more fynbos" },
  { src: "https://framerusercontent.com/images/z0ha6Cap1xjkHBWyu1iV9tnWBNQ.png?width=157&height=157", alt: "The Black Axe!" },
];

function StampImage({ src, alt }: { src: string, alt: string }) {
  return (
    <motion.div 
      initial="initial"
      whileHover="hover"
      className="relative group w-16 h-16 shrink-0 cursor-pointer overflow-visible mx-auto"
    >
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover transition-opacity duration-300 opacity-70 group-hover:opacity-100"
      />
      
      {/* Tooltip on the LEFT */}
      <motion.div 
        variants={{
          initial: { opacity: 0, x: 10, scale: 0.95 },
          hover: { opacity: 1, x: 0, scale: 1 }
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="absolute right-full mr-4 top-1/2 -translate-y-1/2 pointer-events-none z-50 flex items-center justify-end origin-right"
      >
        <p className="font-handwriting text-accent-red text-[16px] md:text-[18px] whitespace-nowrap leading-none text-right">
          {alt}
        </p>
      </motion.div>
    </motion.div>
  );
}

export default function RightSidebar() {
  const items = [...STAMPS, ...STAMPS, ...STAMPS, ...STAMPS]; // Extra padding for smoother scroll

  return (
    <div className="hidden lg:flex  shrink-0 flex-col items-center fixed h-screen right-0 top-0 z-20 bg-transparent">
      {/* Top and Bottom fades */}
      <div 
        className="absolute top-0 left-0 w-full h-16 z-30 pointer-events-none" 
        style={{ background: 'linear-gradient(to bottom, var(--bg-desk) 0%, transparent)' }}
      />
      <div 
        className="absolute bottom-0 left-0 w-full h-16 z-30 pointer-events-none" 
        style={{ background: 'linear-gradient(to top, var(--bg-desk) 0%, transparent)' }}
      />
      
      <motion.div
        className="flex flex-col gap-1 w-full will-change-transform pt-4"
       // animate={{ y: ["0%", "-33.33%"] }} 
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 35, // slightly slower than left side
        }}
        whileHover={{ animationPlayState: "paused" }}
      >
        {items.map((stamp, i) => (
          <StampImage key={i} src={stamp.src} alt={stamp.alt} />
        ))}
      </motion.div>
    </div>
  );
}
