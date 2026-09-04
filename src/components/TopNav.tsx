import { motion } from "motion/react";
 
// Set this to true to force all navigation links to their hover state
const DEBUG_HOVER = false;

export default function TopNav() {
  return (
    <nav className="relative z-50 w-full flex items-center justify-center gap-12 md:gap-16 ">
     

      {/* Navigation Links */}
      <NavLink href="/about" label="about" forceHover={false} />
      <NavLink href="/work" label="Work" />
      <NavLink href="#connect" label="Connect" />
    </nav>
  );
}

function NavLink({ href, label, forceHover = false }: { href: string; label: string; forceHover?: boolean }) {
  const isAbout = label.toLowerCase() === "about";
  const isWork = label.toLowerCase() === "work";
  const isConnect = label.toLowerCase() === "connect";
  const shouldHover = DEBUG_HOVER || forceHover;
  
  return (
    // motion.div, not motion.a: the floating decorations render their own <a>
    // tags and nested anchors are invalid HTML (breaks React hydration).
    <motion.div
      className="relative group block"
      whileHover="hover"
      initial="initial"
      animate={shouldHover ? "hover" : "initial"}
    >
      {/* Invisible bridge to maintain hover state while moving mouse to floating elements */}
      <div className="absolute inset-x-0 bottom-0 -top-32 pointer-events-auto z-0" />
      {isAbout && (
        <motion.div
           className="absolute left-1/2 -translate-x-1/2 -top-[49px] pointer-events-auto"
           variants={{
             initial: { opacity: 0, y: 10, scale: 0.8 },
             hover: { opacity: 1, y: 0, scale: 1 }
           }}
           transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
        >
           <a 
             href="/" 
             className="block text-paper hover:text-accent-red transition-colors duration-200"
             onClick={(e) => e.stopPropagation()}
           >
             <svg width="35" height="35" viewBox="0 0 36.528 36.994" overflow="visible">
                <g>
                   {/* Looking down group (Eyes and Nose) */}
                   <motion.g
                     variants={{
                       initial: { y: 0 },
                       hover: { y: 3 }
                     }}
                     transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                   >
                     <path d="M 17.024 17.375 L 17.024 18.375" fill="transparent" strokeWidth="3" stroke="currentColor" strokeLinecap="round"></path>
                     <path d="M 26.024 17.375 L 26.024 18.375" fill="transparent" strokeWidth="3" stroke="currentColor" strokeLinecap="round"></path>
                     <path d="M 21.524 23.375 L 21.524 24.875" fill="transparent" strokeWidth="2" stroke="currentColor" strokeLinecap="round"></path>
                   </motion.g>
                   
                   <path d="M 17.024 27.875 C 17.024 27.875 19.899 29.625 22.524 29.375 C 25.149 29.125 27.524 26.875 27.524 26.875" fill="transparent" strokeWidth="3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                   <path d="M 1.409 14.859 L 0 5.877 L 7 8.877 L 10.409 1.426 L 13.65 6.524 L 17.48 1.442 L 22 5.377 L 26.844 0 L 28.5 6.877" transform="translate(3.268 -0.95) rotate(8 14.25 7.5)" fill="transparent" strokeWidth="3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                   <path d="M 4.543 17.375 C 4.543 17.375 5.897 38.766 21.543 36.875 C 37.188 34.984 31.266 18.375 31.266 18.375" fill="transparent" strokeWidth="3" stroke="currentColor" strokeLinecap="round"></path>
                   <path d="M 4 0.069 C -1.401 -0.911 -1.113 8.846 3.543 7.941" transform="translate(0.024 17.875) rotate(-7 2 4)" fill="transparent" strokeWidth="3" stroke="currentColor" strokeLinecap="round"></path>
                   <path d="M 4 0.069 C -1.401 -0.911 -1.113 8.846 3.543 7.941" transform="translate(32.524 17.375) rotate(-183 2 4)" fill="transparent" strokeWidth="3" stroke="currentColor" strokeLinecap="round"></path>
                </g>
             </svg>
           </a>
        </motion.div>
      )}

      {isWork && (
        <>
          {/* SVG Scribble */}
          <svg 
            className="absolute pointer-events-none" 
            viewBox="0 0 95 43" 
            style={{
              width: 'calc(100% + 44px)',
              height: '45px',
              top: '-9px',
              left: '-22px',
              zIndex: 0
            }}
          >
            <motion.path 
              d="M 86.759 4.519 C 80.965 -2.317 -5.485 -4.757 0.275 22.178 C 3.425 36.908 42.214 39.876 66.46 31.45 C 101.924 19.124 86.56 3.488 67.822 1.483" 
              fill="transparent" 
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="text-paper/80"
              variants={{
                initial: { pathLength: 0, opacity: 0 },
                hover: { pathLength: 1, opacity: 1 }
              }}
              transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
              transform="translate(3.837 4.568)"
            />
          </svg>

          {/* Work Deco (Navie 4 & 5) */}
          <div className="absolute inset-0 pointer-events-none -z-10">
            <motion.div
              className="absolute left-[8px] -translate-x-1/2   top-[-126px] w-28 h-32 flex items-center justify-center"
              variants={{
                initial: { opacity: 0, scale: 0.8, y: 10 },
                hover: { opacity: 1, scale: 1, y: 0 }
              }}
              transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            >
              <div className="relative w-full h-full">
                {/* Navie 4 (Cuadro) */}
                <img 
                  src="/work-clone/framer/images/WZygymu5Y0XTj6exkgElJgDet8.png" 
                  alt="Frame"
                  className="absolute inset-0 w-full h-full object-contain"
                />
                {/* Navie 5 (Adentro) */}
                <img 
                  src="/work-clone/framer/images/klvZtuhjeLBrHRuCnpOubsPLgI.png" 
                  alt="Navie 5"
                  className="absolute left-[113%] top-[84%] -translate-x-1/2 -translate-y-1/2 w-10 h-auto"
                />
              </div>
            </motion.div>
          </div>

          {/* New SVG Face for Work */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 top-[-56px] pointer-events-auto"
            variants={{
              initial: { opacity: 0, y: 10, scale: 0.8 },
              hover: { opacity: 1, y: 0, scale: 1 }
            }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          >
            <a 
              href="/" 
              className="block text-paper hover:text-accent-red transition-colors duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <svg width="35" height="35" viewBox="0 0 36.528 37.582" overflow="visible">
                <g>
                  <motion.g
                    variants={{
                      initial: { y: 0 },
                      hover: { y: 3 }
                    }}
                    transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                  >
                    <path d="M 14.024 18.582 L 14.024 19.582" fill="transparent" strokeWidth="3" stroke="currentColor" strokeLinecap="round"></path>
                    <path d="M 23.024 18.582 L 23.024 19.582" fill="transparent" strokeWidth="3" stroke="currentColor" strokeLinecap="round"></path>
                    <path d="M 18.524 23.582 L 18.524 25.082" fill="transparent" strokeWidth="2" stroke="currentColor" strokeLinecap="round"></path>
                  </motion.g>
                  <path d="M 13.024 27.667 C 13.024 27.667 16.036 30.44 18.786 30.043 C 21.536 29.647 24.024 27.082 24.024 27.082" fill="transparent" strokeWidth="3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M 0 11.734 L 1 6.734 L 5.975 6.372 L 6.834 1.707 L 14.328 5.281 L 20.319 0 L 22.028 5.631 L 27.117 2.253 L 29.634 8.799" transform="translate(3.609 -0.637) rotate(8 14.75 5.75)" fill="transparent" strokeWidth="3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M 4.543 16.582 C 4.543 16.582 3.749 37.582 19.539 37.582 C 35.329 37.582 31.266 17.582 31.266 17.582" fill="transparent" strokeWidth="3" stroke="currentColor" strokeLinecap="round"></path>
                  <path d="M 4 0.069 C -1.401 -0.911 -1.113 8.846 3.543 7.941" transform="translate(0.024 17.082) rotate(-7 2 4)" fill="transparent" strokeWidth="3" stroke="currentColor" strokeLinecap="round"></path>
                  <path d="M 4 0.069 C -1.401 -0.911 -1.113 8.846 3.543 7.941" transform="translate(32.524 16.582) rotate(-183 2 4)" fill="transparent" strokeWidth="3" stroke="currentColor" strokeLinecap="round"></path>
                </g>
              </svg>
            </a>
          </motion.div>
        </>
      )}

      {isConnect && (
        <>
          {/* SVG Scribble */}
          <svg 
            className="absolute pointer-events-none" 
            viewBox="0 0 95 43" 
            style={{
              width: 'calc(100% + 44px)',
              height: '45px',
              top: '-9px',
              left: '-22px',
              zIndex: 0
            }}
          >
            <motion.path 
              d="M 81.49 16.931 C 81.49 1.676 14.701 -11.069 1.021 14.985 C -12.659 41.038 116.452 46.71 69.49 8.931" 
              fill="transparent" 
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="text-paper/80"
              variants={{
                initial: { pathLength: 0, opacity: 0 },
                hover: { pathLength: 1, opacity: 1 }
              }}
              transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
              transform="translate(7.01 3.931)"
            />
          </svg>

          <motion.div 
            className="absolute left-1/2 -translate-x-1/2 top-[-117px] flex items-center flex-col justify-center gap-4 pointer-events-none -z-10 h-20 w-[280px]"
          variants={{
            initial: { opacity: 0, y: 10, scale: 0.9 },
            hover: { opacity: 1, y: 0, scale: 1 }
          }}
          transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
        >
          {/* LinkedIn Link */}
          <a
            href="https://www.linkedin.com/in/josbert-hernandez-317b77113/"
            target="_blank"
            rel="noopener"
            className="w-7 h-7 flex flex-col items-center justify-center pointer-events-auto hover:scale-110 transition-transform"
            style={{ rotate: '10deg' }}
          >
            <img 
              src="/work-clone/framer/images/sQTVrMmvyy0ZAP9a11y78iBE0o.png" 
              alt="LinkedIn"
              className="w-full h-auto"
            />
          </a>

          {/* Twixxer Link */}
          <a
            href="https://x.com/JosbertHern"
            target="_blank"
            rel="noopener"
            className="w-7 h-7 flex flex-col items-center justify-center pointer-events-auto hover:scale-110 transition-transform"
            style={{ rotate: '-11deg' }}
          >
            <img 
              src="/work-clone/framer/images/kZimamADdUc1StlgrvwXr6WaZRc.png" 
              alt="twixxer"
              className="w-full h-auto"
            />
          </a>

          {/* GitHub Link */}
          <a
            href="https://github.com/josbert2"
            target="_blank"
            rel="noopener"
            className="w-7 h-7 flex flex-col items-center justify-center pointer-events-auto hover:scale-110 transition-transform"
            style={{ rotate: '-15deg' }}
          >
            <img 
              src="/work-clone/framer/images/Yfit95qEPP022gKR3Is3XnmxRds.png" 
              alt="github"
              className="w-full h-auto"
            />
          </a>

         
        </motion.div>
      </>
    )}
      <a href={href} className="block font-gochi text-[24px] md:text-[18px] text-paper hover:text-accent-red transition-colors duration-200 relative z-10">
        {label}
      </a>

      {isAbout && (
        <>
          {/* SVG Scribble */}
          <svg 
            className="absolute pointer-events-none" 
            viewBox="0 0 95 43" 
            style={{
              width: 'calc(100% + 44px)',
              height: '45px',
              top: '-9px',
              left: '-22px',
              zIndex: 0
            }}
          >
            <motion.path 
              d="M 81.49 16.931 C 81.49 1.676 14.701 -11.069 1.021 14.985 C -12.659 41.038 116.452 46.71 69.49 8.931" 
              fill="transparent" 
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="text-paper/80"
              variants={{
                initial: { pathLength: 0, opacity: 0 },
                hover: { pathLength: 1, opacity: 1 }
              }}
              transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
              transform="translate(7.01 3.931)"
            />
          </svg>

          {/* Floating Images (Navie) */}
          <div className="absolute inset-0 pointer-events-none -z-10">
            <motion.img 
              src="/work-clone/framer/images/nXkHodrIJijHtkJK9tj0meJSo.png"
              alt="Navie 1"
              className="absolute w-8 h-auto"
              style={{ top: '-36px', left: '-13%', marginLeft: '-28px' }}
              initial={{ opacity: 0, scale: 0.9 }}
              variants={{ hover: { opacity: 1, scale: 1 } }}
              transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            />
            <motion.img 
              src="/work-clone/framer/images/Js58O0WeXiEecnME3wucn8P1Lg.png"
              alt="Navie 2"
              className="absolute w-8 h-auto"
              style={{ top: '17px', left: '-34px' }}
              initial={{ opacity: 0, scale: 0.9 }}
              variants={{ hover: { opacity: 1, scale: 1 } }}
              transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1], delay: 0.05 }}
            />
            <motion.img 
              src="/work-clone/framer/images/so1wZgMvJhjB3P40EWwFAbrMls.png"
              alt="Navie 3"
              className="absolute w-8 h-auto"
              style={{ top: '-39px', right: '-43px' }}
              initial={{ opacity: 0, scale: 0.9 }}
              variants={{ hover: { opacity: 1, scale: 1 } }}
              transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1], delay: 0.1 }}
            />
          </div>
        </>
      )}

      {/* Hover Decoration (Abstract shapes fading in) */}
      {!isAbout && (
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none -z-10 w-24 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center mix-blend-screen"
          variants={{
            initial: { scale: 0.8, rotate: -10 },
            hover: { scale: 1, rotate: 0 }
          }}
        >
           <div className="w-full h-full h-full" />
        </motion.div>
      )}
    </motion.div>
  );
}
