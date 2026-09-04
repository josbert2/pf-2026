import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

const CHECKLIST_ITEMS = [
  "Impactful work",
  "Meaningful work",
  "Diversed team of talented folks",
];

const LYRIC =
  "Almost heaven, West Virginia.     Blue Ridge Mountains Shenandoah River .      Life is old there.      Older than the trees.      Younger than the mountains.      Growin like a breeze Country Roads,      take me home.      To the place I belong West Virginia, mountain momma.      Take me home, country roads.";

export default function FooterSection() {
  return (
    <section
      className="relative w-full flex flex-col items-center"
      style={{ paddingTop: 100, paddingBottom: 50, gap: 57 }}
    >
      {/* ── TOP ROW: Checklist + Red Rectangle + Giphy ── */}
      <div
        className="w-full max-w-[1471px] flex flex-col lg:flex-row items-center lg:items-stretch justify-center px-6"
        style={{ gap: 57 }}
      >
        {/* LEFT — Checklist Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full max-w-[773px] rounded-[30px] p-[30px] flex flex-row items-center gap-[10px] shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
          style={{ backgroundColor: "#f5e1cd" }}
        >
          {/* Content column (header + checklist + CTA) */}
          <div className="flex-1 flex flex-col items-center justify-center gap-[10px]">
            {/* Header with top/bottom red borders */}
            <div
              className="w-full relative h-[66px]"
              style={{
                borderTop: "1px solid #e35342",
                borderBottom: "2px solid #e35342",
              }}
            >
              <p
                className="absolute left-[1px] whitespace-nowrap"
                style={{
                  fontFamily: '"Awesome Serif Semi Bold Extra Tall", serif',
                  fontSize: 29,
                  fontWeight: 600,
                  color: "#e35342",
                  lineHeight: "34.8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                What I look for
              </p>
            </div>

            {/* Checklist Items */}
            <div className="w-full flex flex-col">
              {CHECKLIST_ITEMS.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-[10px] py-[10px] cursor-pointer"
                  style={{
                    borderBottom:
                      i < CHECKLIST_ITEMS.length - 1
                        ? "1px dashed #e35342"
                        : "none",
                    height: i < CHECKLIST_ITEMS.length - 1 ? 50 : 40,
                  }}
                >
                  {/* Checkbox SVG */}
                  <div className="w-[30px] h-[30px] flex items-center justify-center shrink-0">
                    <svg width="20" height="19" viewBox="0 0 20 19" fill="none">
                      <rect
                        x="0.5"
                        y="0.5"
                        width="19"
                        height="18"
                        rx="3"
                        fill="#e35342"
                        stroke="#e35342"
                      />
                      <path
                        d="M5 9.5L8.5 13L15 6"
                        stroke="#f5e1cd"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p
                    style={{
                      fontFamily:
                        '"JetBrains Mono", "IBM Plex Mono", monospace',
                      fontSize: 15,
                      color: "#171717",
                      lineHeight: "26.4px",
                    }}
                  >
                    {item}
                  </p>
                </div>
              ))}
            </div>

            {/* let's chat CTA */}
            <div className="w-full flex justify-center pt-[15px]">
              <a
                href="mailto:lapsun.j.zhang@gmail.com"
                className="group relative inline-flex items-center gap-[10px]"
              >
                {/* Hand-drawn border SVG (pill shape) */}
                <svg
                  width="151"
                  height="51"
                  viewBox="0 0 151 51"
                  fill="none"
                  className="absolute inset-0"
                >
                  <rect
                    x="1.5"
                    y="1.5"
                    width="148"
                    height="48"
                    rx="24"
                    stroke="#e35342"
                    strokeWidth="2"
                  />
                </svg>
                <span
                  className="relative z-10 flex items-center gap-2 px-8 py-3"
                  style={{
                    fontFamily:
                      '"JetBrains Mono", "IBM Plex Mono", monospace',
                    fontSize: 15,
                    color: "#e35342",
                    fontWeight: 500,
                  }}
                >
                  let's chat!
                  <ArrowRight size={16} />
                </span>
              </a>
            </div>
          </div>

          {/* Red hand-drawn rectangle (decorative image) */}
          <div className="hidden md:block w-[311px] h-[308px] shrink-0">
            <img
              src="/work-clone/framer/images/iSwyFpVCzzKTbmhtq2Gakc2k5Xk.png"
              alt="Hand-drawn rectangle"
              className="w-full h-full object-contain"
              style={{ borderRadius: 22 }}
              loading="lazy"
            />
          </div>
        </motion.div>

        {/* RIGHT COLUMN — Call card + Giphy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="flex flex-col gap-2 relative max-w-[478px]"
        >
          {/* Label above giphy */}
          <p
            className="text-ink/50 mb-1"
            style={{
              fontFamily: '"JetBrains Mono", "IBM Plex Mono", monospace',
              fontSize: 13,
            }}
          >
            Insert a "I need to chat with you" giphy
          </p>

          {/* Giphy */}
          <div className="w-full overflow-hidden rounded-xl">
            <img
              src="/work-clone/framer/images/7DHkysRvD4huqiyxAljijYYcc.gif"
              alt="I need to chat with you"
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>
        </motion.div>
      </div>

      {/* ── BOTTOM ROW: Doodles + Music Marquee ── */}
      <div
        className="w-full max-w-[1471px] flex flex-col items-center relative px-6"
        style={{ gap: 43 }}
      >
        {/* Decorative doodle images scattered */}
        <div className="relative w-full hidden lg:block" style={{ height: 250 }}>
          {/* Slice 45 — flowers (left) */}
          <img
            src="/work-clone/framer/images/FRkj7J6yOqj9bBSMBJF7zdRGrY.png"
            alt="Flowers doodle"
            className="absolute"
            style={{ left: 0, top: 0, width: 191, height: 163 }}
            loading="lazy"
          />

          {/* Slice 35 — bird (right-ish) */}
          <img
            src="/work-clone/framer/images/raBEoGeB7wmHSyDXXPu6VzQPAg.png"
            alt="Bird doodle"
            className="absolute"
            style={{ right: 299, top: 114, width: 121, height: 116 }}
            loading="lazy"
          />

          {/* Slice 48 — computer+bird (far right) */}
          <img
            src="/work-clone/framer/images/zbVoYsGmG4nEEedbtgkv5193W6I.png"
            alt="Computer bird doodle"
            className="absolute"
            style={{ right: 0, bottom: 0, width: 207, height: 196 }}
            loading="lazy"
          />

          {/* Slice 52 — more flowers (left side lower) */}
          <img
            src="/work-clone/framer/images/EYbfG6roNwIxhPystqzDKOK4.png"
            alt="Flowers doodle 2"
            className="absolute"
            style={{ left: 85, bottom: 0, width: 201, height: 233 }}
            loading="lazy"
          />
        </div>

        {/* Music marquee link */}
        <a
          href="./#:vgdrfY_Pe"
          className="w-full max-w-[655px] flex items-center gap-[10px] overflow-hidden"
          style={{ height: 47 }}
        >
          <span
            className="shrink-0"
            style={{
              fontFamily: '"JetBrains Mono", "IBM Plex Mono", monospace',
              fontSize: 15,
              color: "#e35342",
            }}
          >
            🎶
          </span>
          <div className="flex-1 overflow-hidden">
            <motion.div
              className="flex whitespace-nowrap"
              animate={{ x: [0, -2800] }}
              transition={{
                repeat: Infinity,
                ease: "linear",
                duration: 40,
              }}
            >
              <span
                className="mr-[100px]"
                style={{
                  fontFamily:
                    '"Awesome Serif Semi Bold Extra Tall", serif',
                  fontSize: 15,
                  color: "#e35342",
                }}
              >
                {LYRIC}
              </span>
              <span
                style={{
                  fontFamily:
                    '"Awesome Serif Semi Bold Extra Tall", serif',
                  fontSize: 15,
                  color: "#e35342",
                }}
              >
                {LYRIC}
              </span>
            </motion.div>
          </div>
          <span
            className="shrink-0"
            style={{
              fontFamily: '"JetBrains Mono", "IBM Plex Mono", monospace',
              fontSize: 15,
              color: "#e35342",
            }}
          >
            🎶
          </span>
        </a>
      </div>
    </section>
  );
}
