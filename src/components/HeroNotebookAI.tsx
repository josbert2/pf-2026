import { motion } from "motion/react";
import ValuesWidget from "./ValuesWidget";

const ROLE_LABEL = "Product Designer & AI Builder";
const ROLE_CHARS = ROLE_LABEL.split("");
const ROLE_STAGGER = 0.03;

export default function HeroNotebookAI() {
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
                 backgroundImage: "url('https://framerusercontent.com/images/FqqwJe3cXajmh3c17ziisS6QOJU.jpg')",
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
         <div className="relative flex items-center z-10 mx-3 md:mx-6 mt-6 mb-0.5 bg-[#f2e3cf] rounded-t-[20px] rounded-b-[4px] shadow-sm overflow-hidden min-h-[450px] md:min-h-[550px] shadow-[inset_0_-4px_10px_rgba(0,0,0,0.05)] bg-[#f5e1cd]">
            {/* Grid Background */}
            <div
               className="absolute inset-x-0 top-0 bottom-0 opacity-[0.29] pointer-events-none z-0"
               style={{
                 backgroundImage: "url('https://framerusercontent.com/images/fiStjr6PCyart5FAr44gZdenfA.png')",
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
                     <svg width="164" height="53" viewBox="0 0 164 53" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-2 -ml-2 drop-shadow-sm">
                        <path d="M5.98828 6.44025C11.9883 4.44025 19.9883 2.44025 25.9883 1.44025" stroke="#E35341" strokeWidth="2.88" strokeMiterlimit="10" strokeLinecap="round"/>
                        <path d="M15.9883 1.44025C17.9883 13.4402 19.9883 25.4402 17.9883 35.4402C15.9883 43.4402 9.98829 49.4402 3.98829 45.4402C-0.0117075 41.4402 0.988292 35.4402 4.98829 32.4402" stroke="#E35341" strokeWidth="2.88" strokeMiterlimit="10" strokeLinecap="round"/>
                        <path d="M31.9883 20.4402C26.9883 18.4402 20.9883 22.4402 20.9883 29.4402C20.9883 37.4402 27.9883 41.4402 33.9883 39.4402C39.9883 37.4402 43.9883 30.4402 40.9883 24.4402C38.9883 20.4402 33.9883 18.4402 31.9883 20.4402Z" stroke="#E35341" strokeWidth="2.88" strokeMiterlimit="10" strokeLinecap="round"/>
                        <path d="M54.9883 21.4402C50.9883 19.4402 43.9883 20.4402 42.9883 24.4402C41.9883 28.4402 46.9883 30.4402 50.9883 32.4402C54.9883 34.4402 56.9883 37.4402 53.9883 40.4402C50.9883 43.4402 44.9883 43.4402 40.9883 41.4402" stroke="#E35341" strokeWidth="2.88" strokeMiterlimit="10" strokeLinecap="round"/>
                        <path d="M56.9883 8.44025C57.9883 19.4402 59.9883 30.4402 60.9883 42.4402" stroke="#E35341" strokeWidth="2.88" strokeMiterlimit="10" strokeLinecap="round"/>
                        <path d="M60.9883 23.4402C65.9883 19.4402 72.9883 18.4402 75.9883 23.4402C79.9883 29.4402 76.9883 39.4402 71.9883 42.4402C66.9883 45.4402 60.9883 42.4402 59.9883 36.4402" stroke="#E35341" strokeWidth="2.88" strokeMiterlimit="10" strokeLinecap="round"/>
                        <path d="M79.9883 31.4402H95.9883" stroke="#E35341" strokeWidth="2.88" strokeMiterlimit="10" strokeLinecap="round"/>
                        <path d="M95.9882 31.4403C98.9882 27.4403 97.9882 22.4403 92.9882 21.4403C86.9882 20.4403 79.9882 24.4403 78.9882 30.4403C77.9882 36.4403 81.9882 43.4403 88.9882 44.4403C93.9882 44.4403 97.9882 41.4403 99.9882 38.4403" stroke="#E35341" strokeWidth="2.88" strokeMiterlimit="10" strokeLinecap="round"/>
                        <path d="M101.988 25.4402C102.988 32.4402 103.988 38.4402 104.988 45.4402" stroke="#E35341" strokeWidth="2.88" strokeMiterlimit="10" strokeLinecap="round"/>
                        <path d="M102.988 28.4402C105.988 23.4402 110.988 21.4402 114.988 22.4402C117.988 23.4402 118.988 26.4402 117.988 29.4402" stroke="#E35341" strokeWidth="2.88" strokeMiterlimit="10" strokeLinecap="round"/>
                        <path d="M124.988 9.44025C124.988 22.4402 123.988 34.4402 122.988 46.4402C122.988 49.4402 124.988 51.4402 127.988 50.4402C130.988 49.4402 133.988 46.4402 135.988 43.4402" stroke="#E35341" strokeWidth="2.88" strokeMiterlimit="10" strokeLinecap="round"/>
                        <path d="M118.988 23.4402C122.988 22.4402 127.988 22.4402 132.988 22.4402" stroke="#E35341" strokeWidth="2.88" strokeMiterlimit="10" strokeLinecap="round"/>
                        <path d="M149.988 20.4402C149.988 18.4402 151.988 17.4402 151.988 19.4402" stroke="#E35341" strokeWidth="2.5" strokeMiterlimit="10" strokeLinecap="round"/>
                        <path d="M157.988 18.4402C157.988 16.4402 159.988 15.4402 159.988 17.4402" stroke="#E35341" strokeWidth="2.5" strokeMiterlimit="10" strokeLinecap="round"/>
                        <path d="M148.988 25.4402C150.988 30.4402 156.988 32.4402 161.988 29.4402" stroke="#E35341" strokeWidth="2.5" strokeMiterlimit="10" strokeLinecap="round"/>
                     </svg>
                     <div aria-label={ROLE_LABEL} className="flex items-center font-averia text-accent-red text-[22px] md:text-[26px] tracking-wide font-normal h-10 select-none">
                        {ROLE_CHARS.map((char, i) => (
                           <div key={i} className="relative group inline-block pointer-events-auto cursor-default">
                              {/* Layout Stabilizer Letter (Averia) */}
                              <motion.span
                                 initial={{ opacity: 0, y: 5 }}
                                 animate={{ opacity: 1, y: 0 }}
                                 transition={{ duration: 0.3, delay: 0.4 + (i * ROLE_STAGGER) }}
                                 className="inline-block group-hover:invisible"
                              >
                                 {char === " " ? " " : char}
                              </motion.span>

                              {/* Hover Overlay Letter (Gochi) */}
                              <span
                                 className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 font-handwriting text-[32px] rotate-[-2deg] whitespace-nowrap"
                                 style={{ fontFamily: '"Gochi Hand", cursive' }}
                              >
                                 {char === " " ? " " : char}
                              </span>
                           </div>
                        ))}
                     </div>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.3 }}
                    className="font-awesome text-accent-red text-[45px] md:text-[80px] lg:text-[50px] leading-[1.1] tracking-tight mb-8"
                  >
                     Software should <br/>
                     <span className="flex items-center gap-3 md:gap-4">
                        feel <span className="font-gochi text-accent-red tracking-tighter text-[1.15em]">honest</span>
                     </span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.6 }}
                    className="font-averia text-accent-red text-lg md:text-[20px] font-light tracking-[-0.04em] mt-2"
                  >
                     Santiago • GMT -3:00
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
                     src="https://framerusercontent.com/images/zreYWHKtYVvdYwuZm8gBYAa3IiA.png"
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
            <img src="https://framerusercontent.com/images/a5uPbmT6PvUwjD3MFRKJ8andRk.png?width=444&height=437" alt="Book Crease" className="w-auto h-[200px] object-contain" />
         </div>
          <div className="w-full h-[7px] bg-[#c24234] rounded-[3px] shadow-[inset_0px_2px_4px_rgba(0,0,0,0.3)] border-b border-black/20" />
      </div>

      {/* 3. BOTTOM PAGE CONTAINER */}
      <div
        className="relative w-full rounded-b-[60px] overflow-visible origin-top"
        style={{ transform: "perspective(3310px) rotateX(10deg)" }}
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
                        srcSet="https://framerusercontent.com/images/BUQeUkXwalGo0ETntC1tuR9TM.png?scale-down-to=512&width=552&height=242 512w,https://framerusercontent.com/images/BUQeUkXwalGo0ETntC1tuR9TM.png?width=552&height=242 552w"
                        src="https://framerusercontent.com/images/BUQeUkXwalGo0ETntC1tuR9TM.png?width=552&height=242"
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
                     src="https://framerusercontent.com/images/rRKteDbgGPSRnYv0ydZFYq7DfI.png?width=430&height=462"
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
                 backgroundImage: "url('https://framerusercontent.com/images/FqqwJe3cXajmh3c17ziisS6QOJU.jpg')",
                 backgroundSize: "1448px auto",
                 backgroundRepeat: "repeat"
               }}
            />
         </div>

         {/* The Paper Bottom Page (No Grid) */}
         <div className="relative z-10 mx-3 md:mx-6 mb-8 mt-0 bg-[#f2e3cf] rounded-t-[4px] rounded-b-[20px] overflow-clip min-h-[400px] md:min-h-[500px] shadow-[0px_4px_5px_2px_rgba(0,0,0,0.47)]">
        <ValuesWidget />

         </div>
      </div>

    </div>
  );
}
