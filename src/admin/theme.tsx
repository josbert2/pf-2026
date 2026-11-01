import type { CSSProperties, ReactNode } from "react";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";

// Visual pieces borrowed from the site so the CMS feels like the portfolio:
// dark desk + stamp columns, red leather binder, cream grid paper.

const IMG = "/work-clone/framer/images/";
export const LEATHER = `${IMG}FqqwJe3cXajmh3c17ziisS6QOJU.jpg`;
const GRID = `${IMG}fiStjr6PCyart5FAr44gZdenfA.png`;

export const RED = "#e35342";
export const PAPER = "#f2e3cf";

/** Dark desk with the stamp columns on both edges (desktop). */
export function Desk({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#212121] text-[#f2e3cf]">
      <LeftSidebar />
      <RightSidebar />
      <div className="relative z-10 lg:px-24">{children}</div>
    </div>
  );
}

/** Red leather binder holding a sheet of cream grid paper. */
export function Notebook({
  children,
  className = "",
  paperClassName = "",
  grid = true,
}: {
  children: ReactNode;
  className?: string;
  paperClassName?: string;
  grid?: boolean;
}) {
  return (
    <div className={`relative rounded-[26px] border-2 border-[#D25E4D] bg-[#e35342] p-3 shadow-[0_30px_60px_rgba(0,0,0,0.55)] md:p-4 ${className}`}>
      <div
        className="pointer-events-none absolute inset-0 rounded-[24px] opacity-[0.54] mix-blend-multiply"
        style={{ backgroundImage: `url('${LEATHER}')`, backgroundSize: "1448px auto" }}
      />
      <div className={`relative overflow-hidden rounded-[16px] bg-[#f2e3cf] text-[#171717] shadow-[0_4px_5px_2px_rgba(0,0,0,0.35)] ${paperClassName}`}>
        {grid && <GridPaper />}
        <div className="relative">{children}</div>
      </div>
    </div>
  );
}

export function GridPaper({ style }: { style?: CSSProperties }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-[0.22]"
      style={{
        backgroundImage: `url('${GRID}')`,
        backgroundSize: "41.5px auto",
        maskImage: "linear-gradient(rgb(0,0,0) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0) 100%)",
        ...style,
      }}
    />
  );
}

/** Section heading in the footer-checklist style: red serif between red rules. */
export function PaperHeading({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4 border-y border-b-2 border-[#e35342] py-3">
      <h2 className="font-awesome text-[28px] leading-none text-[#e35342]" style={{ fontFamily: '"Awesome Serif Semi Bold Extra Tall", serif' }}>
        {children}
      </h2>
      {aside}
    </div>
  );
}

/** Hand-drawn scribble under the active tab (same path as the site nav). */
export function Scribble({ className = "" }: { className?: string }) {
  return (
    <svg className={`pointer-events-none absolute ${className}`} viewBox="0 0 95 43" style={{ width: "calc(100% + 36px)", height: 40, top: -6, left: -18 }}>
      <path
        d="M 86.759 4.519 C 80.965 -2.317 -5.485 -4.757 0.275 22.178 C 3.425 36.908 42.214 39.876 66.46 31.45 C 101.924 19.124 86.56 3.488 67.822 1.483"
        fill="transparent"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        transform="translate(3.837 4.568)"
      />
    </svg>
  );
}
