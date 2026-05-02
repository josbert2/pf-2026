import { motion } from "motion/react";

export default function FooterMarquee() {
  return (
    <div className="w-full bg-paper border-t-2 border-ink overflow-hidden py-3 font-mono text-ink text-sm uppercase tracking-widest flex shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      <motion.div
        className="flex whitespace-nowrap gap-8"
        animate={{ x: [0, -1000] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 20,
        }}
      >
        <span>✺ everything you do, do it with care</span>
        <span>✺ everything you do, do it with care</span>
        <span>✺ everything you do, do it with care</span>
        <span>✺ everything you do, do it with care</span>
        <span>✺ everything you do, do it with care</span>
        
        {/* DUPLICATE FOR SEAMLESS LOOP */}
        <span>✺ everything you do, do it with care</span>
        <span>✺ everything you do, do it with care</span>
        <span>✺ everything you do, do it with care</span>
        <span>✺ everything you do, do it with care</span>
        <span>✺ everything you do, do it with care</span>
      </motion.div>
    </div>
  );
}
