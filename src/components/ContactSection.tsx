import { useState } from "react";
import { motion } from "motion/react";

const ITEMS = [
  {
    label: "Impactful work",
    image: "https://framerusercontent.com/images/upRTLhrb9FYLUfioJJJLdT8ZfA8.png?scale-down-to=1024&width=1602&height=1586",
  },
  {
    label: "Meaningful work",
    image: "https://framerusercontent.com/images/hqMcMJhPtNEU5lwCAR4SLOb6Kk.png?scale-down-to=1024&width=1602&height=1586",
  },
  {
    label: "Diversed team of talented folks",
    image: "https://framerusercontent.com/images/oTiZAIs1hqi7Ry0p78DYOWXefzE.png?scale-down-to=1024&width=1602&height=1586",
  },
];

// slot 0 = front (most recent), slot 1 = mid, slot 2 = back
const STACK_OFFSETS = [
  { x: 0,  y: 0,  rotate: 0, scale: 1    },
  { x: 8,  y: 6,  rotate: 4, scale: 0.97 },
  { x: 16, y: 12, rotate: 8, scale: 0.94 },
];

function CheckboxEmpty() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" className="flex-shrink-0">
      <rect x="1" y="1" width="24" height="24" rx="4" stroke="#e35342" strokeWidth="2" />
    </svg>
  );
}

function CheckboxChecked() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" className="flex-shrink-0">
      <rect x="1" y="1" width="24" height="24" rx="4" fill="#e35342" stroke="#e35342" strokeWidth="2" />
      <path d="M6 13.5L10.5 18L20 8" stroke="#f2e3cf" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ContactSection() {
  // ordered list of checked item indices — first checked = back, last checked = front
  const [stack, setStack] = useState<number[]>([]);

  const toggle = (i: number) => {
    setStack((prev) =>
      prev.includes(i)
        ? prev.filter((x) => x !== i)   // uncheck → remove from stack
        : [...prev, i]                   // check → push to front
    );
  };

  const isChecked = (i: number) => stack.includes(i);

  return (
    <div className="w-full flex justify-center py-16 px-4">
      <div
        className="flex flex-col md:flex-row gap-[10px] p-[30px] rounded-[30px]"
        style={{
          background: "#f2e3cf",
          boxShadow: "rgba(0, 0, 0, 0.4) 0px 1px 2px 0px",
          width: "773px",
          maxWidth: "100%",
          minHeight: "374px",
        }}
      >
        {/* Left: Checklist */}
        <div className="flex-1 flex flex-col justify-center min-w-0">
          <div
            className="flex items-center h-[66px]"
            style={{
              borderTop: "1px solid #e35342",
              borderBottom: "2px solid #e35342",
            }}
          >
            <span className="font-awesome text-[#e35342] text-[29px] font-semibold">
              What I look for
            </span>
          </div>

          <div className="flex flex-col">
            {ITEMS.map((item, i) => (
              <button
                key={i}
                onClick={() => toggle(i)}
                className="flex items-center gap-[10px] py-[10px] text-left w-full cursor-pointer select-none"
                style={i < ITEMS.length - 1 ? { borderBottom: "1px dashed #e35342" } : undefined}
              >
                {isChecked(i) ? <CheckboxChecked /> : <CheckboxEmpty />}
                <span
                  className="font-gochi text-[#e35342] text-[22px] leading-tight transition-all duration-200"
                  style={isChecked(i) ? { textDecoration: "line-through" } : undefined}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          <div className="flex justify-center p-[15px]">
            <a
              href="mailto:lapsun.j.zhang@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-gochi text-[#e35342] text-[21px] px-8 py-2 border-2 border-[#e35342] rounded-lg hover:bg-[#e35342] hover:text-[#f2e3cf] transition-colors duration-200"
            >
              let's chat!
            </a>
          </div>
        </div>

        {/* Right: Stacked illustrations */}
        <div
          className="flex-shrink-0 self-center relative"
          style={{ width: "311px", height: "308px" }}
        >
          {/* Illustrations — render in stack order (back to front) */}
          {stack.map((itemIdx, stackPos) => {
            // stackPos 0 = first checked = back, last = front
            const distFromFront = stack.length - 1 - stackPos;
            const offset = STACK_OFFSETS[Math.min(distFromFront, STACK_OFFSETS.length - 1)];
            return (
              <motion.div
                key={itemIdx}
                className="absolute inset-0 rounded-[22px] overflow-hidden"
                initial={{ opacity: 0, scale: 0.85, y: 20 }}
                animate={{
                  opacity: 1,
                  scale: offset.scale,
                  x: offset.x,
                  y: offset.y,
                  rotate: offset.rotate,
                  zIndex: stackPos + 1,
                }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ type: "spring", stiffness: 280, damping: 26 }}
              >
                <img
                  src={ITEMS[itemIdx].image}
                  alt={ITEMS[itemIdx].label}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            );
          })}

          {/* Frame overlay — always on top */}
          <img
            src="https://framerusercontent.com/images/iSwyFpVCzzKTbmhtq2Gakc2k5Xk.png"
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ zIndex: 10 }}
          />
        </div>
      </div>
    </div>
  );
}
