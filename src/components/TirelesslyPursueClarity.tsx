import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

const LUCKY_CAT = "https://framerusercontent.com/images/f2PEJg4oioBRT5hs3v6NNeskQ.png";
const IMG_L1    = "https://framerusercontent.com/images/Wiw196PFt5v5LcQxgcrCUB3F0.png";
const IMG_L2    = "https://framerusercontent.com/images/JCVH1U71jmRJSgalqgIDAfuO8.png";
const IMG_R1    = "https://framerusercontent.com/images/qPdyyjiGVcYhSJZ659iudjEFmbw.png";
const IMG_R2    = "https://framerusercontent.com/images/JiCsfFAbrVrZSX3x7Y9dkgzckI.png";
const SLICE_52  = "https://framerusercontent.com/images/EYbfG6roNwIxhPystqzDKOK4.png";

const CARD_SHADOW = "0px 1px 2px 0px rgba(0, 0, 0, 0.25)";

function Card({
  src,
  href,
  height,
  imgHeight,
  delay = 0,
}: {
  src: string;
  href?: string;
  height: number;
  imgHeight: number;
  delay?: number;
}) {
  return (
    <motion.a
      href={href ?? "#"}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      className="block w-full rounded-[20px] overflow-hidden bg-white"
      style={{ height, boxShadow: CARD_SHADOW }}
    >
      <img
        src={src}
        alt=""
        className="w-full object-cover"
        style={{ height: imgHeight }}
      />
    </motion.a>
  );
}

export default function TirelesslyPursueClarity() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Subtle parallax: left col scrolls up a bit slower than right
  const yLeft  = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const yRight = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <section
      ref={containerRef}
      className="w-full flex justify-center py-[50px] overflow-hidden"
    >
      {/* ── Max-width wrapper ─────────────────────────────────────── */}
      <div className="w-full max-w-[1200px] px-4 flex flex-col md:flex-row items-stretch gap-0">

        {/* ── LEFT COLUMN ──────────────────────────────────────────── */}
        <motion.div
          style={{ y: yLeft }}
          className="flex-1 flex flex-col items-end justify-center gap-[63px] relative"
        >
          {/* Deco: lucky cat — absolutely positioned above cards */}
          <motion.img
            src={LUCKY_CAT}
            alt="Lucky cat"
            initial={{ opacity: 0, scale: 0.8, rotate: 15 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute w-[144px] object-contain pointer-events-none hidden md:block"
            style={{ height: 206, top: -68, left: 130 }}
          />

          <Card src={IMG_L1} height={392} imgHeight={372} delay={0}   />
          <Card src={IMG_L2} height={349} imgHeight={329} delay={0.1} />
        </motion.div>

        {/* ── MIDDLE SPACER ────────────────────────────────────────── */}
        <div className="hidden md:block shrink-0" style={{ minWidth: 412 }} />

        {/* ── RIGHT COLUMN ─────────────────────────────────────────── */}
        <motion.div
          style={{ y: yRight }}
          className="flex-1 flex flex-col items-start justify-center gap-[57px] relative mt-12 md:mt-0"
        >
          <Card src={IMG_R1} height={320} imgHeight={300} delay={0.15} />
          <Card src={IMG_R2} height={400} imgHeight={380} delay={0.25} />

          {/* Deco: slice — bottom-right decoration */}
          <motion.img
            src={SLICE_52}
            alt=""
            initial={{ opacity: 0, rotate: -15, scale: 0.6 }}
            whileInView={{ opacity: 1, rotate: -10, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 90, delay: 0.35 }}
            className="absolute w-[201px] object-contain pointer-events-none hidden md:block"
            style={{ height: 232, bottom: -60, right: -40 }}
          />
        </motion.div>

      </div>
    </section>
  );
}
