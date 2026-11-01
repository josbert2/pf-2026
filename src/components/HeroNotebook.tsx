import { motion, useMotionTemplate, useScroll, useTransform } from "motion/react";
import ValuesWidget from "./ValuesWidget";
import Signature from "./Signature";
import { useSiteContent } from "../lib/site-content";

export default function HeroNotebook() {
  const home = useSiteContent("home");
  // The bottom page starts tilted away (book half-open) and flattens as you scroll.
  const { scrollY } = useScroll();
  const pageTilt = useTransform(scrollY, [0, 450], [60, 10]);
  const pageTransform = useMotionTemplate`perspective(3310px) rotateX(${pageTilt}deg)`;

  return (
    <div className="relative md:w-[870px] mx-auto lg:max-w-5xl mx-auto flex flex-col items-center justify-center mt-10 md:mt-6 pointer-events-none" style={{ perspective: "4000px" }}>
      <div className="absolute top-0 left-0 framer-1hjpp53 h-full w-full bg-gradient-to-t from-[#e35342] " />

      {/* 1. TOP PAGE / BINDER OVERLAY */}
      <div 
        className="relative w-full rounded-t-[60px] overflow-visible origin-bottom"
        style={{ transform: "perspective(4105px) rotateX(-5deg)" }}
      >

         {/* Leather Binder Background Top */}
         <div className="absolute inset-x-0 bottom-0 h-full rounded-t-[60px] bg-[#e35342] shadow-inner border-2 border-[#D25E4D] z-0 overflow-hidden">
            <div 
               className="absolute inset-0 opacity-[0.54] mix-blend-multiply" 
               style={{ 
                 backgroundImage: "url('/work-clone/framer/images/FqqwJe3cXajmh3c17ziisS6QOJU.jpg')", 
                 backgroundSize: "1448px auto",
                 backgroundRepeat: "repeat",
                 backgroundPosition: "left top"
               }}
            />
         </div>
         
         {/* Ribbon Left */}
         <div className="absolute -left-12 bottom-[-17px] w-[88px] h-[41px] z-20 pointer-events-none z-10">
            <svg viewBox="0 0 88.5 40.5" className="w-full h-full drop-shadow-md">
              <path d="M 88.5 0 L 37.5 8 L 0 28.5 L 8.5 32.5 L 8.5 40.5 L 43 23 L 88.5 17 Z" fill="#ed7164" />
            </svg>
         </div>

         {/* Ribbon Right */}
         <div className="absolute -right-5 bottom-4 w-[47px] h-[93px] z-20 pointer-events-none z-10">
            <svg viewBox="0 0 46.5 93" className="w-full h-full drop-shadow-md">
              <path d="M 0 23 L 41.5 52 L 46.5 72.5 L 23.5 85.5 L 0 93 L 0 75.5 L 18 69.5 L 28 62.5 L 21 21 L 0 0 Z" fill="#ed7164" />
            </svg>
         </div>

         {/* The Paper Top Page */}
         <div className="relative flex items-center z-10 mx-3 md:mx-6 mt-6 mb-0.5 bg-[#f2e3cf] rounded-t-[20px] rounded-b-[4px] shadow-sm overflow-hidden min-h-[450px] md:min-h-[550px] shadow-[inset_0_-4px_10px_rgba(0,0,0,0.05)]">
            {/* Grid Background */}
            <div 
               className="absolute inset-x-0 top-0 bottom-0 opacity-[0.29] pointer-events-none z-0"
               style={{ 
                 backgroundImage: "url('/work-clone/framer/images/fiStjr6PCyart5FAr44gZdenfA.png')", 
                 backgroundSize: "41.5px auto",
                 backgroundRepeat: "repeat",
                 backgroundPosition: "center top",
                 maskImage: "linear-gradient(rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0) 55%)",
                 WebkitMaskImage: "linear-gradient(rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0) 55%)"
               }}
            />

            {/* Gradient Overlay */}
            <div 
               className="absolute inset-x-0 top-0 bottom-0 pointer-events-none z-0"
               style={{
                 opacity: 0.41,
                 overflow: "clip",
                 background: "linear-gradient(#e0e0e000 0%, #ede2d8a3 5%, #e6e6e508 24%, #e6e6e600 89%, #170f062b 98%, #1a0f04e0 100%)"
               }}
            />
            
           
            
            {/* Top Page Content container */}
            <div className="relative z-20 p-8 md:p-12 lg:p-10 flex flex-col md:flex-row justify-between w-full h-full pointer-events-auto">
               
               {/* Left text column */}
               <div className="flex-1 flex flex-col justify-center">
                  {/* Signature Refined */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                    animate={{ opacity: 1, scale: 1, rotate: -2 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex flex-col mb-4 items-start"
                  >
                     <Signature className="mb-2 -ml-2 drop-shadow-sm" />
                     <div aria-label={home.role} className="flex items-center font-averia text-accent-red text-[26px] tracking-wide font-normal h-10 select-none">
                        {[...home.role].map((char, i) => (
                           <div key={i} className="relative group inline-block pointer-events-auto cursor-default">
                              {/* Layout Stabilizer Letter (Averia) */}
                              <motion.span
                                 initial={{ opacity: 0, y: 5 }}
                                 animate={{ opacity: 1, y: 0 }}
                                 transition={{ duration: 0.3, delay: 0.4 + (i * 0.05) }}
                                 className="inline-block group-hover:invisible"
                              >
                                 {char === " " ? "\u00A0" : char}
                              </motion.span>
                              
                              {/* Hover Overlay Letter (Gochi) */}
                              <span 
                                 className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 font-handwriting text-[32px] rotate-[-2deg] whitespace-nowrap"
                                 style={{ fontFamily: '"Gochi Hand", cursive' }}
                              >
                                 {char === " " ? "\u00A0" : char}
                              </span>
                           </div>
                        ))}
                     </div>
                     <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 1.3 }}
                        className="text-accent-red/90 text-[21px] rotate-[-2deg] -mt-1 select-none"
                        style={{ fontFamily: '"Gochi Hand", cursive' }}
                     >
                        {home.role_sub}
                     </motion.div>
                  </motion.div>
                  
                  <motion.h1 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                    className="font-awesome text-accent-red text-[45px] md:text-[80px] lg:text-[50px] leading-[1.1] tracking-tight mb-8"
                  >
                     {home.headline} <br/>
                     <span className="flex items-center gap-3 md:gap-4">
                        {home.headline_lead} <span className="font-gochi text-accent-red tracking-tighter text-[1.15em]">{home.headline_accent}</span>
                     </span>
                  </motion.h1>
                  
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.5 }}
                    className="font-averia text-accent-red text-lg md:text-[20px] font-light tracking-[-0.04em] mt-2"
                  >
                     {home.location}
                  </motion.p>
               </div>
               
               {/* Right Illustration */}
               <motion.div 
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 1, delay: 0.5 }}
                 className="absolute bottom-[-81px] right-0 let-auto width-full h-full flex justify-end pt-[50px] pl-[50px]"
               >
                  <img 
                     src="/work-clone/framer/images/zreYWHKtYVvdYwuZm8gBYAa3IiA.png" 
                     alt="Hero Illustration"
                     className="w-full h-full object-contain"
                  />
               </motion.div>
            </div>
         </div>
      </div>

      {/* 2. BOOK BINDING CREASE (the fold) */}
      <div className="h-16 w-full flex relative z-30 px-3 md:px-6 -my-8 items-center justify-center">
         <div className="absolute left-[-20px] z-50">
            <img src="/work-clone/framer/images/a5uPbmT6PvUwjD3MFRKJ8andRk.png" alt="Book Crease" className="w-auto h-[200px] object-contain" />
         </div>
          <div className="w-full h-[7px] bg-[#c24234] rounded-[3px] shadow-[inset_0px_2px_4px_rgba(0,0,0,0.3)] border-b border-black/20" />
      </div>

      {/* 3. BOTTOM PAGE CONTAINER */}
      <motion.div
        className="relative w-full rounded-b-[60px] overflow-visible origin-top"
        style={{ transform: pageTransform }}
      >
         <div>
            <div className="framer-wud5gd" data-framer-name="Image">
                  <div
                     style={{
                        position: "absolute",
                        borderRadius: "inherit",
                     
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0
                     }}
                     data-framer-background-image-wrapper="true"
                  >
                     <img
                        decoding="auto"
                        loading="lazy"
                        width={552}
                        height={242}
                        sizes="186px"
                        srcSet="/work-clone/framer/images/BUQeUkXwalGo0ETntC1tuR9TM.png 512w,/work-clone/framer/images/BUQeUkXwalGo0ETntC1tuR9TM.png 552w"
                        src="/work-clone/framer/images/BUQeUkXwalGo0ETntC1tuR9TM.png"
                        alt=""
                        style={{
                        display: "block",
                        width: "100%",
                        height: "100%",
                        borderRadius: "inherit",
                        objectPosition: "center",
                        objectFit: "cover"
                        }}
                     />
                  </div>
               </div>
         </div>
         <div>
            <div className="ssr-variant hidden-wvti7j">
               <div className="framer-hbq7c8" data-framer-name="Image">
                  <div
                     style={{
                     position: "absolute",
                     borderRadius: "inherit",
                    
                     top: 0,
                     right: 0,
                     bottom: 0,
                     left: 0
                     }}
                     data-framer-background-image-wrapper="true"
                  >
                     <img
                     decoding="auto"
                     loading="lazy"
                     width={430}
                     height={462}
                     src="/work-clone/framer/images/rRKteDbgGPSRnYv0ydZFYq7DfI.png"
                     alt=""
                     style={{
                        display: "block",
                        width: "100%",
                        height: "100%",
                        borderRadius: "inherit",
                       
                        objectPosition: "center",
                        objectFit: "cover"
                     }}
                     />
                  </div>
               </div>
               </div>

         </div>
         {/* Leather Binder Background Bottom */}
         <div className="absolute inset-x-0 top-0 h-full rounded-b-[60px] bg-[#e35342] shadow-[0_30px_60px_rgba(0,0,0,0.6)] border-2 border-[#D25E4D] z-0 overflow-hidden">
            <div 
               className="absolute inset-0 opacity-[0.54] mix-blend-multiply" 
               style={{ 
                 backgroundImage: "url('/work-clone/framer/images/FqqwJe3cXajmh3c17ziisS6QOJU.jpg')", 
                 backgroundSize: "1448px auto",
                 backgroundRepeat: "repeat"
               }}
            />
         </div>

         {/* The Paper Bottom Page (No Grid) */}
         <div className="relative z-10 mx-3 md:mx-6 mb-8 mt-0 bg-[#f2e3cf] rounded-t-[4px] rounded-b-[20px] overflow-visible min-h-[400px] md:min-h-[500px] shadow-[0px_4px_5px_2px_rgba(0,0,0,0.47)]">
        <p
          className="absolute left-[150px] top-[24px] z-10 text-accent-red"
          style={{ fontFamily: '"Awesome Serif Semi Bold Tall", serif', fontSize: 16, fontWeight: 600, fontStyle: "italic" }}
        >
          {home.values_caption}
        </p>
        <ValuesWidget pageTilt={pageTilt} values={[home.value_1, home.value_2, home.value_3]} />
         </div>
      </motion.div>
    
    </div>
  );
}
