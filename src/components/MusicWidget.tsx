import { motion } from "motion/react";
import { Music } from "lucide-react";

const LYRIC = "🎶 Almost heaven, West Virginia. Blue Ridge Mountains Shenandoah River. Life is old there. Older than the trees. Younger than the mountains. Growin like a breeze Country Roads, take me home. To the place I belong West Virginia, mountain momma. Take me home, country roads. 🎶";

export default function MusicWidget() {
  return (
    <section className="w-full bg-ink text-paper py-8 border-t-2 border-black/20 overflow-hidden relative flex items-center shadow-inner">
      <div className="absolute left-0 z-10 bg-gradient-to-r from-ink to-transparent w-32 h-full flex items-center justify-center pointer-events-none text-[#E35342]">
        <Music size={24} className="ml-8" />
      </div>
      <div className="absolute right-0 z-10 bg-gradient-to-l from-ink to-transparent w-32 h-full pointer-events-none" />
      
      <div className="flex font-serif italic text-lg md:text-xl lg:text-2xl tracking-wide whitespace-nowrap opacity-90 pl-32">
        <motion.div
          className="flex gap-16"
          animate={{ x: [0, -2000] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
        >
          <span>{LYRIC}</span>
          <span>{LYRIC}</span>
          <span>{LYRIC}</span>
          <span>{LYRIC}</span>
        </motion.div>
      </div>
    </section>
  );
}
