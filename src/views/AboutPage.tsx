import { Head } from "vite-react-ssg";
import { motion } from "motion/react";
import TopNav from "../components/TopNav";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";
import FooterSection from "../components/FooterSection";
import { SITE_URL } from "../lib/site";

// Torn-paper top edge, like the notebook sheet ripped off the spiral binder.
const TORN_EDGE =
  "polygon(0 14px, 2% 4px, 5% 12px, 8% 2px, 11% 10px, 14% 3px, 17% 13px, 20% 5px, 23% 11px, 26% 2px, 29% 12px, 32% 4px, 35% 10px, 38% 2px, 41% 13px, 44% 6px, 47% 11px, 50% 3px, 53% 12px, 56% 4px, 59% 10px, 62% 2px, 65% 13px, 68% 5px, 71% 11px, 74% 3px, 77% 12px, 80% 4px, 83% 10px, 86% 2px, 89% 12px, 92% 5px, 95% 11px, 98% 3px, 100% 12px, 100% 100%, 0 100%)";

const ALSO = [
  "a creative developer",
  "an ai-powered coder",
  "a ui/ux tinkerer",
  "a saas builder",
  "a night owl",
];

const ENERGY = [
  "Building products end to end",
  "Shipping cool things",
  "Working with tight-knit teams",
];

const SOUL = [
  "Late-night coding sessions",
  "Good coffee",
  "Creating things",
];

const NERD = [
  { k: "AI agents", v: "half my tools talk back to me" },
  { k: "Self-hosting", v: "everything runs in Docker" },
  { k: "Warzone stats", v: "my bot tracks the squad" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen relative font-mono overflow-hidden flex flex-col">
      <Head>
        <title>About — josbert</title>
        <meta
          name="description"
          content="Who's Josbert? Frontend engineer & creative developer from Santiago — turning complex ideas into things you can click."
        />
        <link rel="canonical" href={`${SITE_URL}/about`} />
        <meta property="og:title" content="About — josbert" />
        <meta
          property="og:description"
          content="Frontend engineer & creative developer from Santiago."
        />
        <meta property="og:url" content={`${SITE_URL}/about`} />
        <meta property="og:type" content="website" />
      </Head>

      <div className="flex w-full flex-1 justify-between relative z-10">
        <LeftSidebar />

        <main className="mt-40 mb-24 flex flex-col items-center z-10 mx-auto w-full max-w-5xl px-4">
          <div className="mt-8 md:mt-0 w-full max-w-5xl">
            <TopNav />
          </div>

          {/* ===== TORN NOTEBOOK SHEET ON RED BOARD ===== */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative w-full mt-14"
          >
            {/* Red board behind */}
            <div className="absolute -inset-x-3 -top-2 -bottom-5 rounded-[26px] bg-[#e35342] border-2 border-[#D25E4D] shadow-inner overflow-hidden rotate-[0.4deg]">
              <div
                className="absolute inset-0 opacity-[0.54] mix-blend-multiply"
                style={{
                  backgroundImage:
                    "url('/work-clone/framer/images/FqqwJe3cXajmh3c17ziisS6QOJU.jpg')",
                  backgroundSize: "1448px auto",
                  backgroundRepeat: "repeat",
                }}
              />
            </div>

            {/* The paper */}
            <div
              className="relative bg-[#f2e3cf] px-8 md:px-16 pt-12 pb-16"
              style={{ clipPath: TORN_EDGE }}
            >
              {/* Grid background */}
              <div
                className="absolute inset-0 opacity-[0.29] pointer-events-none"
                style={{
                  backgroundImage:
                    "url('/work-clone/framer/images/fiStjr6PCyart5FAr44gZdenfA.png')",
                  backgroundSize: "41.5px auto",
                  backgroundRepeat: "repeat",
                  maskImage:
                    "linear-gradient(rgb(0,0,0) 0%, rgba(0,0,0,0.35) 100%)",
                }}
              />

              <div className="relative">
                <span className="font-departure text-ink/70 text-sm tracking-widest">
                  Senior level
                </span>

                <h1
                  className="mt-10 max-w-xl text-accent-red text-[34px] md:text-[44px] leading-[1.05]"
                  style={{ fontFamily: '"Awesome Serif Regular", serif' }}
                >
                  For the past few years, I&apos;ve been turning complex ideas
                  into things you can click.
                </h1>

                <div className="mt-12 flex flex-col md:flex-row justify-between items-start gap-10">
                  {/* Handwritten list */}
                  <div
                    className="text-accent-red text-[22px] leading-relaxed"
                    style={{ fontFamily: '"Gochi Hand", cursive' }}
                  >
                    <p>I&apos;m a frontend engineer</p>
                    <p>but I&apos;m also…</p>
                    <ul className="mt-4 space-y-2">
                      {ALSO.map((item, i) => (
                        <motion.li
                          key={item}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + i * 0.12 }}
                          className="pl-4"
                          style={{ rotate: `${(i % 2 === 0 ? -1 : 1) * 0.8}deg` }}
                        >
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Polaroid */}
                  <motion.div
                    initial={{ opacity: 0, rotate: 6, y: 10 }}
                    animate={{ opacity: 1, rotate: 3, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="bg-white p-3 pb-2 shadow-lg shrink-0 md:mr-8"
                    style={{ width: "240px" }}
                  >
                    <img
                      src="/work-clone/josbert/josbert-photo.png"
                      alt="Josbert at his desk"
                      className="w-full aspect-square object-cover grayscale"
                    />
                    <p
                      className="text-center text-accent-red text-[26px] mt-1"
                      style={{ fontFamily: '"Gochi Hand", cursive' }}
                    >
                      Josbert
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ===== TWO OVERLAPPING CARDS ===== */}
          <div className="relative mt-28 mb-10 w-full flex flex-col md:flex-row items-center justify-center">
            {/* Cream card */}
            <motion.div
              initial={{ opacity: 0, y: 20, rotate: -4 }}
              whileInView={{ opacity: 1, y: 0, rotate: -3 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
              className="relative z-10 bg-[#f2e3cf] p-6 shadow-xl w-[320px] md:-mr-6"
            >
              <div className="grid grid-cols-2 gap-2">
                <img src="/work-clone/josbert/wasin-hero.png" alt="wasin" className="h-24 w-full object-cover object-left-top" />
                <img src="/work-clone/josbert/erp-hero.png" alt="bookforce ERP" className="h-24 w-full object-cover object-left-top" />
                <img src="/work-clone/josbert/josbert-projects.png" alt="side projects" className="h-24 w-full object-cover object-left-top" />
                <img src="/work-clone/josbert/erp-pos.png" alt="POS" className="h-24 w-full object-cover object-left-top" />
              </div>
              <h2
                className="mt-4 text-ink text-[22px] italic"
                style={{ fontFamily: '"Awesome Serif Regular", serif' }}
              >
                What gives me energy
              </h2>
              <ul className="mt-2 text-ink/80 text-[13px] font-mono space-y-1">
                {ENERGY.map((e) => (
                  <li key={e}>- {e}</li>
                ))}
              </ul>
            </motion.div>

            {/* Red card */}
            <motion.div
              initial={{ opacity: 0, y: 24, rotate: 4 }}
              whileInView={{ opacity: 1, y: 8, rotate: 2 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="relative bg-[#e35342] text-[#f2e3cf] p-7 shadow-xl w-[340px]"
            >
              <h2 className="text-[22px]" style={{ fontFamily: '"Gochi Hand", cursive' }}>
                What fuels my soul
              </h2>
              <ul className="mt-2 text-[15px] space-y-1" style={{ fontFamily: '"Gochi Hand", cursive' }}>
                {SOUL.map((s) => (
                  <li key={s}>- {s}</li>
                ))}
              </ul>

              <h2 className="mt-6 text-[22px] leading-tight" style={{ fontFamily: '"Gochi Hand", cursive' }}>
                Stuff that I&apos;ll nerd out on
                <span className="block text-[13px] opacity-80">(that is not frontend)</span>
              </h2>
              <ul className="mt-2 text-[15px] space-y-1" style={{ fontFamily: '"Gochi Hand", cursive' }}>
                {NERD.map((n) => (
                  <li key={n.k}>
                    - {n.k} — {n.v}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </main>

        <RightSidebar />
      </div>

      <FooterSection />
    </div>
  );
}
