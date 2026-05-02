import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export default function FooterCTA() {
  return (
    <section className="w-full bg-paper py-24 md:py-40 relative overflow-hidden z-10 flex flex-col items-center border-t-2 border-dashed border-ink/20">
      
      {/* Decorative Postal Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none opacity-20">
        <svg viewBox="0 0 200 200" className="w-full h-full text-ink">
          <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="2" />
          <text x="100" y="105" textAnchor="middle" fontSize="14" fill="currentColor" transform="rotate(15 100 100)">PRIORITY</text>
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-6 w-full flex flex-col md:flex-row items-center md:items-start justify-between gap-16 relative z-10">
        
        <motion.div 
          className="w-full md:w-1/2"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ink font-bold leading-tight tracking-tight mb-8">
            What I look for in my next gig:
          </h2>
          
          <ul className="space-y-6 font-mono text-ink/80 text-sm md:text-base">
            <li className="flex items-start gap-4">
              <span className="text-[#E35342] text-xl leading-none mt-1">{"->"}</span>
              <p>Work that is impactful, and adds to people's lives rather than takes away.</p>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-[#E35342] text-xl leading-none mt-1">{"->"}</span>
              <p>Work that means something to you, me, and the team.</p>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-[#E35342] text-xl leading-none mt-1">{"->"}</span>
              <p>A culturally and geographically diverse team of incredibly talented folks.</p>
            </li>
          </ul>
        </motion.div>

        <motion.div 
          className="w-full md:w-1/2 flex justify-center md:justify-end"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <a
            href="mailto:hello@jackiezhang.co.za"
            className="group relative inline-flex items-center justify-center gap-4 px-8 py-5 text-lg font-bold text-[#E35342] border-2 border-[#E35342] rounded-full overflow-hidden transition-all hover:text-paper"
          >
            <span className="absolute inset-0 w-full h-full bg-[#E35342] transform -translate-x-full ease-out duration-300 group-hover:translate-x-0" />
            <span className="relative font-mono z-10 flex items-center gap-2">
              let's chat! <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </a>
        </motion.div>
      </div>

    </section>
  );
}
