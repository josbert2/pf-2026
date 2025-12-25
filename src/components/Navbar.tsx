import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import Logo from "./Logo"

interface NavbarProps {
  className?: string
}

const menuItems = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
]

export default function Navbar({ className = "" }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className={`fixed top-6 right-6 z-50 flex h-12 w-12 flex-col items-center justify-center gap-1.5 rounded-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] backdrop-blur-sm transition-all duration-300 hover:border-[var(--color-border-hover)] ${className}`}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        <motion.span
          className="block h-0.5 w-5 bg-white rounded-full"
          animate={{
            rotate: isOpen ? 45 : 0,
            y: isOpen ? 4 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
        <motion.span
          className="block h-0.5 w-5 bg-white rounded-full"
          animate={{
            opacity: isOpen ? 0 : 1,
            scaleX: isOpen ? 0 : 1,
          }}
          transition={{ duration: 0.2 }}
        />
        <motion.span
          className="block h-0.5 w-5 bg-white rounded-full"
          animate={{
            rotate: isOpen ? -45 : 0,
            y: isOpen ? -4 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </button>

      {/* Full Screen Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center bg-[var(--color-bg)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div 
                className="absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-[#6366f1] opacity-[0.03] blur-[150px]"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
              <motion.div 
                className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-[#ec4899] opacity-[0.03] blur-[150px]"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </div>

            {/* Menu Content */}
            <nav className="relative z-10 flex flex-col items-center gap-2">
              {/* Big Logo */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              >
                <Logo className="h-32 w-32 sm:h-40 sm:w-40" />
              </motion.div>

              {menuItems.map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="group relative overflow-hidden px-8 py-4"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                >
                  <span className="relative z-10 text-5xl font-light text-[var(--color-text-primary)] transition-colors duration-300 group-hover:text-white sm:text-6xl md:text-7xl">
                    {item.label}
                  </span>
                  
                  {/* Hover background */}
                  <motion.div
                    className="absolute inset-0 -z-0 rounded-2xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    style={{ originX: 0 }}
                  />

                  {/* Number indicator */}
                  <motion.span 
                    className="absolute -left-2 top-1/2 -translate-y-1/2 text-sm text-[var(--color-text-muted)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    initial={{ x: -10 }}
                    whileHover={{ x: 0 }}
                  >
                    0{index + 1}
                  </motion.span>
                </motion.a>
              ))}

              {/* Social Links */}
              <motion.div
                className="mt-12 flex gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                {["GitHub", "Twitter", "LinkedIn"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="text-sm text-[var(--color-text-muted)] transition-colors duration-300 hover:text-[var(--color-text-primary)]"
                  >
                    {social}
                  </a>
                ))}
              </motion.div>

              {/* Email */}
              <motion.a
                href="mailto:hello@voidowl.dev"
                className="mt-4 text-sm text-[var(--color-text-secondary)] transition-colors duration-300 hover:text-[var(--color-accent)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                hello@voidowl.dev
              </motion.a>
            </nav>

            {/* Corner decoration */}
            <motion.div
              className="absolute bottom-8 left-8 text-xs text-[var(--color-text-muted)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              © 2026 voidowl
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
