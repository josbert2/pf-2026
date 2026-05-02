import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

const ILUS_LEFT  = "https://framerusercontent.com/images/Bg0nbySqeUlxqYI6KKDaJ8mbJo.png"; // Slice 10 — small grass
const ILUS_RIGHT = "https://framerusercontent.com/images/DJ6zTo2EiDMZipwzcmZgjH2tNhU.png"; // Slice 8 — character + campfire

// Sizes taken from Framer Variant 1 children — each card has its own
// width/height (no uniform grid). Some are portrait, some landscape.
const POLAROIDS = [
  // Row 1
  { src: "https://framerusercontent.com/images/SMhadH5n5CuLH7ZXJnFHzzfUI7k.png", alt: "Pack shop UI", w: 278, h: 291, rotate: -3 },
  { src: "https://framerusercontent.com/images/ijsWM5MtUuc1y8pWtiDWBHCnuXg.png", alt: "Code editor",  w: 356, h: 269, rotate:  2 },
  { src: "https://framerusercontent.com/images/cmpsfHDSBvMIVkOtMJffhTk8HA.png", alt: "App preview",   w: 287, h: 380, rotate:  4 },
  // Row 2
  {
    src: "https://framerusercontent.com/images/OqvkDghj18vNLRheWfCb9I9ZC5M.png",
    alt: "Who's Speaking",
    href: "https://whosspeaking.framer.website/",
    w: 400, h: 240, rotate: -5,
  },
  { src: "https://framerusercontent.com/images/x3y7QRdmiIS5JFAwhWC4IHHHJsE.png", alt: "Calendar",       w: 327, h: 285, rotate:  1 },
  { src: "https://framerusercontent.com/images/HUqtxwLIEIp2z66d1Rbksv2PbbY.png", alt: "Audio waveform", w: 369, h: 220, rotate:  3 },
  // Row 3
  { src: "https://framerusercontent.com/images/Wiw196PFt5v5LcQxgcrCUB3F0.png", alt: "Wheat trade", w: 380, h: 320, rotate: -2 },
  {
    src: "https://framerusercontent.com/images/Isusj1Nh2i04aFkiuiBVhYCfec.png",
    alt: "The First 2048",
    href: "https://tf2048.io/",
    w: 369, h: 272, rotate: 2,
  },
  { src: "https://framerusercontent.com/images/5YyYUryAtcl0ESyOgNb4S9dajw.png", alt: "Mountain bike", w: 289, h: 310, rotate: -3 },
];

const RULER_NUMBERS = Array.from({ length: 18 }, (_, i) => i + 1);

function Polaroid({
  src,
  alt,
  href,
  delay,
  rotate,
  w,
  h,
}: {
  src: string;
  alt: string;
  href?: string;
  delay: number;
  rotate: number;
  w: number;
  h: number;
}) {
  const Tag = href ? motion.a : motion.div;
  return (
    <Tag
      {...(href ? { href, target: "_blank", rel: "noreferrer" } : {})}
      initial={{ opacity: 0, y: 20, rotate: rotate * 1.6 }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      whileHover={{ y: -4, scale: 1.03, rotate: 0, zIndex: 20 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className="block bg-white cursor-pointer"
      style={{
        width: `${w}px`,
        height: `${h}px`,
        borderRadius: "20px",
        padding: "10px",
        boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.25)",
      }}
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="block w-full h-full object-cover"
        style={{ borderRadius: "12px" }}
      />
    </Tag>
  );
}

export default function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const matRotate = useTransform(scrollYProgress, [0, 1], [-1.5, 0.5]);

  return (
    <section ref={ref} className="relative w-full py-20 md:py-28 px-44 overflow-hidden">
      {/* ─── Top illustration (orange line art: grass tuft + campfire & guitar) ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 mx-auto flex items-end justify-center gap-2 w-[280px] md:w-[388px] -mb-6 md:-mb-10 pointer-events-none"
        style={{ height: 138 }}
      >
        <img
          src={ILUS_LEFT}
          alt=""
          draggable={false}
          className="block object-contain"
          style={{ width: 126, height: 61 }}
        />
        <img
          src={ILUS_RIGHT}
          alt=""
          draggable={false}
          className="block object-contain"
          style={{ width: 252, height: 138 }}
        />
      </motion.div>

      {/* ─── Cutting mat ────────────────────────────────────────────────── */}
      <motion.div
        style={{ rotate: matRotate }}
        className="relative mx-auto w-full max-w-[1530px] pt-[32px] origin-center"
      >
        {/* Red BG — exact Framer spec: rotate -2°, border-radius 13px,
            subtle cream border on top + left, tight drop shadow */}
        <div
          className="relative bg-[#e35342] p-3 md:p-5"
          style={{
            borderRadius: "13px",
            transform: "rotate(-2deg)",
            boxShadow: "0px 3px 2px 1px rgba(0, 0, 0, 0.41)",
            borderTop: "1px solid #f5e1cd",
            borderLeft: "1px solid #f5e1cd",
          }}
        >
          {/* Inner cut mat — exact Framer spec */}
          <div
            className="relative overflow-hidden"
            style={{
              backgroundColor: "#1c1c1c",
              borderRadius: "37px",
              padding: "20px",
              transform: "rotate(1deg)",
              boxShadow: "0px 3px 2px 1px rgba(0, 0, 0, 0.41)",
              borderTop: "3px solid #f5e1cd",
              borderRight: "2px solid #f5e1cd",
              borderBottom: "2px solid #f5e1cd",
              borderLeft: "2px solid #f5e1cd",
            }}
          >
            {/* Mat texture — Framer tiles the 9G25... PNG at 183px as the
                cutting-mat grid/crosshair pattern, with a 3px cream border
                and border-radius 21px */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "url('https://framerusercontent.com/images/9G25ruOgt322clA0e0vFrw4RNEs.png')",
                backgroundRepeat: "repeat",
                backgroundSize: "183px",
                border: "3px solid #f5e1cd",
                borderRadius: "21px",
              }}
            />

            {/* Numbered ruler (1-18 down the left edge) — Framer spec:
                column flex, gap 27px, Inter 16/19.2, color #f5e1cd */}
            <div
              className="absolute left-5 top-5 bottom-5 flex flex-col items-center justify-start pointer-events-none"
              style={{ rowGap: "27px", width: "17.7148px" }}
            >
              {RULER_NUMBERS.map((n) => (
                <span
                  key={n}
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "16px",
                    lineHeight: "19.2px",
                    color: "#f5e1cd",
                  }}
                  className="tabular-nums"
                >
                  {n}
                </span>
              ))}
            </div>

            {/* Polaroid collage — 3×3 with each card at its own real size
                (portrait, landscape, squarish) like in Framer */}
            <div className="relative grid grid-cols-2 md:grid-cols-3 gap-x-6 md:gap-x-10 gap-y-10 md:gap-y-14 px-12 md:px-20 py-12 md:py-16 place-items-center">
              {POLAROIDS.map((p, i) => (
                <Polaroid key={i} {...p} delay={0.05 * i} />
              ))}
            </div>

            {/* Handwritten quote bottom-right */}
            <motion.p
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="absolute bottom-3 right-5 md:bottom-4 md:right-8 font-gochi text-[#f5e6d3]/85 text-[16px] md:text-[20px] leading-none pointer-events-none"
            >
              everything you do, do it with care.
            </motion.p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
