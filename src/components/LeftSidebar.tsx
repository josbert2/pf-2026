import { motion } from "motion/react";

const STAMPS = [
  { src: "https://framerusercontent.com/images/JnX4DQ93dVEHzTFGkUsZLNV4.png", alt: "Zhang" },
  { src: "https://framerusercontent.com/images/RYvnMMGEz4Ds3BGL5W1lRp9GOCU.png", alt: "Grew up in a resturant" },
  { src: "https://framerusercontent.com/images/zs8DG1Zf6J6s1d5yc00xHp98b60.png", alt: "Digital world" },
  { src: "https://framerusercontent.com/images/X8TlTAmfaqh8FaOYxjSjYMniaE.png", alt: "Fynbos" },
  { src: "https://framerusercontent.com/images/J4bjhr8zDlxffN0kZnWBShva0GY.png", alt: "Night owl" },
  { src: "https://framerusercontent.com/images/2LGPmWLUdShRmg0q79YvdcxivM.png", alt: "More fynbos" },
  { src: "https://framerusercontent.com/images/jvHISkS7qP9hkgBbgfRCAiPpjjI.png", alt: "Even more fynbos" },
  { src: "https://framerusercontent.com/images/z0ha6Cap1xjkHBWyu1iV9tnWBNQ.png", alt: "The Black Axe!" },
];

export default function LeftSidebar() {
  // Duplicate array for seamless infinite vertical scroll
  const items = [...STAMPS, ...STAMPS, ...STAMPS];

  return (
    <div className="hidden lg:flex  shrink-0 flex-col items-center fixed h-screen left-0 top-0 z-20bg-transparent">
      {/* Top and Bottom fades to mask the scrolling elements gracefully */}
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
          duration: 25, // Scrolling speed
        }}
        // Stop animation on hover
        whileHover={{ animationPlayState: "paused" }}
      >
        {items.map((stamp, i) => (
          <motion.div 
            key={i} 
            initial="initial"
            whileHover="hover"
            className="relative group w-16 h-16 shrink-0 cursor-pointer overflow-visible"
          >
            <img 
              src={stamp.src} 
              alt={stamp.alt} 
              className="w-full h-full object-cover transition-opacity duration-300 opacity-70 group-hover:opacity-100"
            />
            {/* Motion Tooltip for Hover */}
            <motion.div 
              variants={{
                initial: { opacity: 0, x: -10, scale: 0.95 },
                hover: { opacity: 1, x: 0, scale: 1 }
              }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute left-full ml-4 top-1/2 -translate-y-1/2 pointer-events-none z-50 origin-left"
            >
              <p className="font-handwriting text-accent-red text-[16px] md:text-[18px] whitespace-nowrap leading-none">
                {stamp.alt}
              </p>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
