import { COLOR, FONT, ASSET } from "./tokens";

/**
 * Card "Coder" — `framer-fhDZV` (292x247).
 * Video loop arriba (292x194) + barra de link a GitHub abajo (292x43),
 * separados por gap 10. bg crema más clara, rounded 11, overflow hidden.
 */

type Props = {
  href?: string;
  handle?: string;
};

export default function CoderCard({
  href = "https://github.com/jackielszhang",
  handle = "@jackielszhang",
}: Props) {
  return (
    <div
      className="flex flex-col items-center"
      style={{
        width: 292,
        height: 247,
        gap: 10,
        backgroundColor: COLOR.creamCard,
        borderRadius: 11,
        boxShadow: "rgba(0,0,0,0.25) 1px 1px 2px 0px",
        overflow: "hidden",
      }}
    >
      {/* framer-1eopn8-container */}
      <video
        src={ASSET.coderVideo}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="block object-cover"
        style={{ width: 292, height: 194 }}
      />

      {/* framer-1jztp3i — link a GitHub */}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center transition-opacity duration-200 hover:opacity-75"
        style={{ width: 292, height: 43, gap: 10, color: COLOR.red }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={22}
          height={22}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
        </svg>
        <span style={{ fontFamily: FONT.code, fontSize: 15 }}>{handle}</span>
      </a>
    </div>
  );
}
