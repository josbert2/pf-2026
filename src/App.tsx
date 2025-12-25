import { LayoutGroup, motion } from "motion/react"
import { useState } from "react"
import TextRotate from "./components/TextRotate"
import Logo from "./components/Logo"
import Navbar from "./components/Navbar"

// Colores flat/suaves para cada palabra
const colors = [
  "#6366f1", // indigo - products
  "#8b5cf6", // violet - experiences  
  "#ec4899", // pink - interfaces
  "#f97316", // orange - solutions
  "#10b981", // emerald - ideas
]

function App() {
  const [currentColor, setCurrentColor] = useState(colors[0])

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Navbar */}
      <Navbar />
      
      {/* Hero Section */}
      <header className="relative">
        <div className="mx-auto max-w-6xl px-6 py-32 lg:py-48">
          <div className="max-w-3xl">
            {/* Logo & Name */}
            <div className="mb-8 flex items-center gap-4">
              <Logo className="h-16 w-16" />
              <span className="text-2xl font-medium tracking-tight text-[var(--color-text-primary)]">
                voidowl
              </span>
            </div>
            
            {/* Label */}
            <span className="text-label text-[#414158] mb-4 block">
              Software Developer
            </span>
            
            {/* Animated Heading */}
            <LayoutGroup>
              <motion.h1 
                className="flex flex-wrap items-center text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl lg:text-6xl"
                layout
              >
                <motion.span
                  className="mr-3"
                  layout
                  transition={{ type: "spring", damping: 30, stiffness: 400 }}
                >
                  Building{" "}
                </motion.span>
                <motion.div
                  className="overflow-hidden rounded-lg px-3 py-1"
                  animate={{ backgroundColor: currentColor }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <TextRotate
                    texts={[
                      "products",
                      "experiences",
                      "interfaces",
                      "solutions",
                      "ideas",
                    ]}
                    mainClassName="text-white overflow-hidden justify-center"
                    staggerFrom="last"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-120%" }}
                    staggerDuration={0.025}
                    splitLevelClassName="overflow-hidden pb-1"
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                    rotationInterval={2500}
                    onNext={(index) => setCurrentColor(colors[index])}
                  />
                </motion.div>
              </motion.h1>
            </LayoutGroup>
            
            {/* Subheading */}
            <p className="mt-6 text-lg leading-relaxed text-[var(--color-text-secondary)] lg:text-xl">
              I help companies design and develop intuitive software that solves real problems. 
              Currently focused on web applications and design systems.
            </p>
            
            {/* CTAs */}
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#work"
                className="inline-flex items-center justify-center rounded-[14px] bg-[var(--color-text-primary)] px-6 py-3 text-sm font-medium text-[var(--color-bg)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              >
                View Work
              </a>
              <a
                href="#contact"
                className="inline-flex text-[#042A4D] items-center justify-center rounded-[14px] border border-[var(--color-border)] bg-transparent px-6 py-3 text-sm font-medium text-[var(--color-text-primary)] transition-all duration-200 hover:border-[var(--color-border-hover)] hover:bg-[var(--color-bg-elevated)]"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </div>
        
        {/* Subtle gradient glow */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[var(--color-accent)] opacity-[0.03] blur-[120px]" />
        </div>
      </header>

      {/* Divider */}
      <div className="section-divider mx-auto max-w-6xl" />

      {/* Work Section Placeholder */}
      <section id="work" className="mx-auto max-w-6xl px-6 py-24">
        <span className="text-label mb-4 block">Selected Work</span>
        <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] sm:text-3xl">
          Projects that I'm proud of
        </h2>
        <p className="mt-4 text-[var(--color-text-secondary)]">
          {/* TODO: Add project cards */}
          Coming soon...
        </p>
      </section>

      {/* Divider */}
      <div className="section-divider mx-auto max-w-6xl" />

      {/* Contact Section Placeholder */}
      <section id="contact" className="mx-auto max-w-6xl px-6 py-24">
        <span className="text-label mb-4 block">Contact</span>
        <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] sm:text-3xl">
          Let's work together
        </h2>
        <p className="mt-4 text-[var(--color-text-secondary)]">
          {/* TODO: Add contact info */}
          Email: hello@example.com
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-[var(--color-text-muted)]">
          © 2026 voidowl. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default App
