import { motion } from "motion/react";

export default function ProfilePolaroid() {
  return (
    <section className="w-full flex justify-center items-center py-20 px-4 md:py-32 relative z-20">
      <motion.div
        initial={{ opacity: 0, y: 30, rotate: -10 }}
        whileInView={{ opacity: 1, y: 0, rotate: -2 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
        className="relative bg-white p-3 md:p-4 pb-12 md:pb-16 shadow-2xl rounded-sm max-w-[320px] md:max-w-[400px] border border-black/5"
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-[#e8e4d9]">
          <img
            src="https://framerusercontent.com/images/X8TlTAmfaqh8FaOYxjSjYMniaE.png" 
            alt="Jackie Zhang"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        
        {/* The Signature */}
        <div className="absolute bottom-3 left-0 w-full flex justify-center items-center">
          <p className="font-handwriting text-[#E35342] text-4xl md:text-5xl transform -rotate-2 mix-blend-multiply">
            Jackie.
          </p>
        </div>
        
        {/* Masking tape on top */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 md:w-32 h-8 bg-paper backdrop-blur-sm transform rotate-1 border border-black/5 shadow-sm opacity-90 mix-blend-multiply" />
      </motion.div>
    </section>
  );
}
