import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Signature from "./Signature";
import { useSiteContent } from "../lib/site-content";

const IMG = "/work-clone/framer/images/";

const RED = "#e35342";
const CREAM = "#f2e3cf";
const GOCHI = '"Gochi Hand", cursive';

export default function FooterSection() {
  const footer = useSiteContent("footer");
  const items = footer.checklist;
  const [checked, setChecked] = useState<boolean[]>([]);
  const [showGiphy, setShowGiphy] = useState(false);

  const toggle = (i: number) =>
    setChecked((prev) => items.map((_, j) => (j === i ? !prev[j] : Boolean(prev[j]))));

  return (
    <section
      className="relative w-full flex flex-col items-center"
      style={{ paddingTop: 100, paddingBottom: 50, gap: 57 }}
    >
      {/* ── TOP ROW: Checklist card, flanked by doodles ── */}
      <div className="relative w-full max-w-[773px] px-6 md:px-0">
        {/* Flowers (left of the card) */}
        <img
          src={IMG + "EYbfG6roNwIxhPystqzDKOK4.png"}
          alt=""
          aria-hidden="true"
          className="absolute hidden xl:block pointer-events-none"
          style={{ right: "calc(100% + 64px)", top: 115, width: 201, height: 233 }}
          loading="lazy"
        />
        {/* Small bird peeking behind the card's right edge */}
        <img
          src={IMG + "raBEoGeB7wmHSyDXXPu6VzQPAg.png"}
          alt=""
          aria-hidden="true"
          className="absolute hidden lg:block pointer-events-none"
          style={{ left: "calc(100% - 85px)", top: 20, width: 121, height: 116, zIndex: 0 }}
          loading="lazy"
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 w-full rounded-[30px] p-[30px] flex flex-row items-center gap-[10px] shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
          style={{ backgroundColor: CREAM }}
        >
          {/* Content column (header + checklist + CTA) */}
          <div className="flex-1 flex flex-col items-center justify-center gap-[10px]">
            {/* Header with top/bottom red borders */}
            <div
              className="w-full relative h-[66px]"
              style={{
                borderTop: `1px solid ${RED}`,
                borderBottom: `2px solid ${RED}`,
              }}
            >
              <p
                className="absolute left-[1px] whitespace-nowrap"
                style={{
                  fontFamily: '"Awesome Serif Semi Bold Extra Tall", serif',
                  fontSize: 29,
                  fontWeight: 600,
                  color: RED,
                  lineHeight: "34.8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                {footer.checklist_title}
              </p>
            </div>

            {/* Checklist Items — click to tick */}
            <div className="w-full flex flex-col">
              {items.map((item, i) => (
                <button
                  key={item}
                  type="button"
                  role="checkbox"
                  aria-checked={Boolean(checked[i])}
                  onClick={() => toggle(i)}
                  className="flex items-center gap-[10px] py-[10px] text-left cursor-pointer"
                  style={{
                    borderBottom:
                      i < items.length - 1 ? `1px dashed ${RED}` : "none",
                    height: i < items.length - 1 ? 50 : 40,
                  }}
                >
                  <span className="w-[30px] h-[30px] flex items-center justify-center shrink-0">
                    <svg width="20" height="19" viewBox="0 0 20 19" fill="none">
                      <rect
                        x="1"
                        y="1"
                        width="18"
                        height="17"
                        rx="1.5"
                        fill={checked[i] ? RED : "none"}
                        stroke={RED}
                        strokeWidth="1.6"
                      />
                      {checked[i] && (
                        <path
                          d="M5 9.5L8.5 13L15 6"
                          stroke={CREAM}
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      )}
                    </svg>
                  </span>
                  <span
                    style={{
                      fontFamily: GOCHI,
                      fontSize: 20,
                      color: RED,
                      lineHeight: "26px",
                      textDecoration: checked[i] ? "line-through" : "none",
                    }}
                  >
                    {item}
                  </span>
                </button>
              ))}
            </div>

            {/* let's chat CTA — hovering reveals the giphy call card */}
            <div className="w-full flex justify-center pt-[15px]">
              <div
                className="relative"
                onMouseEnter={() => setShowGiphy(true)}
                onMouseLeave={() => setShowGiphy(false)}
              >
                <a
                  href={`mailto:${footer.contact_email}`}
                  onFocus={() => setShowGiphy(true)}
                  onBlur={() => setShowGiphy(false)}
                  className="inline-flex items-center justify-center rounded-[6px] px-[30px] h-[48px] transition-colors hover:bg-[#e35342]/10"
                  style={{
                    border: `2px solid ${RED}`,
                    fontFamily: GOCHI,
                    fontSize: 20,
                    color: RED,
                  }}
                >
                  {footer.cta_label}
                </a>

                <AnimatePresence>
                  {showGiphy && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, rotate: -2, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, rotate: 2, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-1/2 bottom-[calc(100%+16px)] -translate-x-1/2 w-[320px] overflow-hidden rounded-xl shadow-2xl pointer-events-none z-30"
                    >
                      <img
                        src={IMG + "7DHkysRvD4huqiyxAljijYYcc.gif"}
                        alt="I need to chat with you"
                        className="w-full h-auto object-cover"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Red hand-drawn rectangle (decorative image) */}
          <div className="hidden md:block w-[311px] h-[308px] shrink-0">
            <img
              src={IMG + "iSwyFpVCzzKTbmhtq2Gakc2k5Xk.png"}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-contain"
              style={{ borderRadius: 22 }}
              loading="lazy"
            />
          </div>
        </motion.div>
      </div>

      {/* ── BOTTOM ROW: Computer doodle, music marquee, signature ── */}
      <div
        className="relative w-full max-w-[1440px] flex flex-col items-center px-6"
        style={{ gap: 43 }}
      >
        {/* Big bird (far right) */}
        <img
          src={IMG + "zbVoYsGmG4nEEedbtgkv5193W6I.png"}
          alt=""
          aria-hidden="true"
          className="absolute hidden lg:block pointer-events-none"
          style={{ right: 5, top: -30, width: 207, height: 197 }}
          loading="lazy"
        />

        {/* Computer doodle (centered) */}
        <img
          src={IMG + "FRkj7J6yOqj9bBSMBJF7zdRGrY.png"}
          alt=""
          aria-hidden="true"
          style={{ width: 191, height: 163 }}
          loading="lazy"
        />

        {/* Music marquee link */}
        <a
          href="./#:vgdrfY_Pe"
          className="w-full max-w-[655px] flex items-center gap-[10px] overflow-hidden"
          style={{ height: 47, color: CREAM }}
        >
          <span className="shrink-0" style={{ fontSize: 15 }}>🎶</span>
          <div className="flex-1 overflow-hidden">
            <motion.div
              className="flex whitespace-nowrap"
              animate={{ x: [0, -2800] }}
              transition={{
                repeat: Infinity,
                ease: "linear",
                duration: 40,
              }}
              style={{ fontFamily: GOCHI, fontSize: 20 }}
            >
              <span className="mr-[100px]">{footer.lyric}</span>
              <span>{footer.lyric}</span>
            </motion.div>
          </div>
          <span className="shrink-0" style={{ fontSize: 15 }}>🎶</span>
        </a>

        {/* Signature */}
        <Signature width={152} />
      </div>
    </section>
  );
}
