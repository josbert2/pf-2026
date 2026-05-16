/**
 * Side Quests — scrapbook section with spiral-bound notebook + scattered stickers.
 * Portado desde seccion.html (Framer export) a Tailwind + estilos inline mínimos.
 */

const FONT_SERIF = "'Awesome Serif Tall', 'Awesome Serif Regular', serif";
const FONT_HAND = "'Gochi Hand', cursive";

const PAPER = "#F5E1CD";
const CREAM = "#F2E3CF";
const INK = "#171717";
const ROLE_RED = "#E35342";

const SPIRAL_BG = "https://framerusercontent.com/images/xyUE8rMT3IDjOHLFbBQu5Ct7AqY.png";

type Quest = {
  name: string;
  href?: string;
  role: string;
  subtitle: string;
  year?: string;
  description: string;
  image: { src: string; alt: string; rotate: string };
};

const QUESTS: Quest[] = [
  {
    name: "Drift",
    role: "creator",
    subtitle: "Design & Code",
    description: "Personal library of images that you found online or created",
    image: {
      src: "https://framerusercontent.com/images/THoPhBwT6urkUDtAjJTcyRfOlw.png",
      alt: "Drift project preview",
      rotate: "2deg",
    },
  },
  {
    name: "TF2048",
    href: "https://tf2048.io/",
    role: "creator",
    subtitle: "Bot design & Site design & Concept art & 3D Modelling and texturing",
    year: "2021",
    description: "Puzzle based NFT",
    image: {
      src: "https://framerusercontent.com/images/GrSk97UziTp1vndEAVDuaVO18k.png",
      alt: "TF2048 preview",
      rotate: "-2deg",
    },
  },
  {
    name: "Who's Speaking",
    href: "https://whosspeaking.framer.website/",
    role: "creator",
    subtitle: "Designer & Framer Developer",
    description: "Follow speakers and see where they are going to be speaking",
    image: {
      src: "https://framerusercontent.com/images/CDi8od3bQ9AxZ99sxvMm2k4.png",
      alt: "Who's Speaking preview",
      rotate: "2deg",
    },
  },
  {
    name: "Triple Time",
    href: "https://tripletime.ai/en-US",
    role: "Founding Product Designer",
    subtitle: "Product Designer & Motion designer",
    year: "2025",
    description: "AI powered medical note taker for doctors",
    image: {
      src: "https://framerusercontent.com/images/fxzETzoSfsr2clZ2wLcBXK9VfEA.png",
      alt: "Triple Time preview",
      rotate: "-1deg",
    },
  },
  {
    name: "ResQued",
    href: "https://www.resqued.org/",
    role: "Founding Product Designer",
    subtitle: "Product Designer",
    description: "Helping ordinary people deliver extraordinary acts of kindness",
    image: {
      src: "https://framerusercontent.com/images/4ztjKgGGxiciWB62obCh0ZZr9iU.png",
      alt: "ResQued preview",
      rotate: "-1deg",
    },
  },
];

type DecoProps = {
  src: string;
  alt: string;
  className: string;
  style?: React.CSSProperties;
};

function DecoSlice({ src, alt, className, style }: DecoProps) {
  return (
    <img
      src={src}
      alt={alt}
      aria-hidden
      loading="lazy"
      className={`pointer-events-none select-none absolute hidden lg:block ${className}`}
      style={style}
    />
  );
}

function QuestRow({ quest }: { quest: Quest }) {
  const NameTag = quest.href ? "a" : "span";
  const nameProps = quest.href
    ? { href: quest.href, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <article className="flex flex-col-reverse md:flex-row items-start md:items-center gap-6 md:gap-5 w-full">
      <div className="flex-1 md:flex-[1.5] flex flex-col gap-2">
        <NameTag
          {...nameProps}
          className="text-[30px] font-semibold leading-tight transition-opacity hover:opacity-70"
          style={{ fontFamily: FONT_SERIF, color: INK }}
        >
          {quest.name}
        </NameTag>

        <div className="flex flex-col gap-0.5">
          <span
            className="text-[14px] leading-none"
            style={{ fontFamily: FONT_HAND, color: ROLE_RED }}
          >
            {quest.role}
          </span>
          <div className="flex items-baseline gap-2">
            <span
              className="text-[18px] leading-tight"
              style={{ fontFamily: FONT_SERIF, color: INK }}
            >
              {quest.subtitle}
            </span>
            {quest.year && (
              <span
                className="text-[14px] leading-tight opacity-70"
                style={{ fontFamily: FONT_SERIF, color: INK }}
              >
                {quest.year}
              </span>
            )}
          </div>
        </div>

        <p
          className="text-[18px] italic leading-snug"
          style={{ fontFamily: FONT_SERIF, color: INK }}
        >
          {quest.description}
        </p>
      </div>

      <div className="w-full md:w-[323px] aspect-[323/191] shrink-0">
        <div
          className="w-full h-full overflow-hidden rounded-md"
          style={{
            transform: `rotate(${quest.image.rotate})`,
            filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.25))",
          }}
        >
          <img
            src={quest.image.src}
            alt={quest.image.alt}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </article>
  );
}

export default function SideQuests() {
  return (
    <section
      aria-labelledby="side-quests-title"
      className="relative w-full overflow-hidden py-16 md:py-24"
      style={{ backgroundColor: "#212121" }}
    >
      <div className="relative mx-auto w-full max-w-[1305px] px-6">
        {/* Title */}
        <h2
          id="side-quests-title"
          className="text-[clamp(56px,9vw,104px)] leading-[1] tracking-tight mb-10 md:mb-16"
          style={{ fontFamily: FONT_SERIF, color: CREAM }}
        >
          Side Quests
        </h2>

        {/* Decorative stickers (desktop only) */}
        <DecoSlice
          src="https://framerusercontent.com/images/EYbfG6roNwIxhPystqzDKOK4.png"
          alt=""
          className="top-[60%] -translate-y-1/2 left-[3%] w-[180px] z-0"
        />
        <DecoSlice
          src="https://framerusercontent.com/images/1bgfRN59yDW2dmlsTzqYiJIdnk.png"
          alt=""
          className="top-[180px] right-[8%] w-[69px] z-0"
        />
        <DecoSlice
          src="https://framerusercontent.com/images/dxUPUyUpNCjMQjpL1pejQpnZ8e0.png"
          alt=""
          className="top-[220px] left-[28%] w-[100px] z-0"
        />
        <DecoSlice
          src="https://framerusercontent.com/images/Y6jrcs7yZkqh9sRA4eMYaPQ96pk.png"
          alt=""
          className="top-[40%] right-[3%] w-[190px] z-0"
        />
        <DecoSlice
          src="https://framerusercontent.com/images/zbVoYsGmG4nEEedbtgkv5193W6I.png"
          alt=""
          className="bottom-[18%] right-[4%] w-[200px] z-0"
        />
        <DecoSlice
          src="https://framerusercontent.com/images/2q6tDvIvgBpR9WPCRBGX1bx81CY.png"
          alt=""
          className="top-[120px] left-[55%] w-[140px] z-0"
        />
        <DecoSlice
          src="https://framerusercontent.com/images/FRkj7J6yOqj9bBSMBJF7zdRGrY.png"
          alt=""
          className="bottom-[5%] left-[6%] w-[180px] z-0"
        />
        <DecoSlice
          src="https://framerusercontent.com/images/OrI0yvuP8iENTvaQ0zYfdI2YySM.png"
          alt=""
          className="bottom-[5%] right-[8%] w-[100px] z-0"
        />

        {/* Spiral notebook */}
        <div className="relative z-10 mx-auto w-full max-w-[791px]">
          {/* Spiral binding */}
          <div
            aria-hidden
            className="h-[41px] w-full"
            style={{
              backgroundImage: `url(${SPIRAL_BG})`,
              backgroundRepeat: "repeat-x",
              backgroundSize: "69.5px 41px",
              backgroundPosition: "left top",
            }}
          />

          {/* Notebook body */}
          <div
            className="rounded-b-xl px-6 py-10 md:px-12 md:py-12 flex flex-col gap-10 md:gap-12"
            style={{ backgroundColor: PAPER }}
          >
            {QUESTS.map((q) => (
              <QuestRow key={q.name} quest={q} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
