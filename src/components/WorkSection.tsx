import { motion } from "motion/react";
import FramerHeader from "./FramerHeader";

// ── Image constants ────────────────────────────────────────────────────────────
const BASE = "/work-clone/framer/images/";

// Clothing-tag logos (199×199)
const LOGO_BASH    = BASE + "RyeLyODnC04hmZGWqOu2c4Kf1M.png";
const LOGO_PULSE   = BASE + "PaINrHg1AjV7DmjSCFpfy7tDk8.png";
const LOGO_HEYGO   = BASE + "86frlX41p58Vy0kQhrniKKNoQ.png";
const LOGO_DOTS    = BASE + "IBVHcp0Cij8N20DBPBqOsPxc.png";

// Mockups
const MOCK_BASH    = BASE + "hyGmkiu08yzXtTX4p6U33EaDtg.png";
const MOCK_PULSE   = BASE + "afys4KtZC007XBhmTWURY9KL4.png";
const MOCK_HEYGO   = BASE + "p617kuyXNZjVcoDr6BvATSwAm4Y.png";
const MOCK_DOTS    = BASE + "8gSlDG7U7xsP8pM9Cq7kN7CvPhY.png";

// Side quest mockups
const SQ_DRIFT     = BASE + "THoPhBwT6urkUDtAjJTcyRfOlw.png";
const SQ_TF2048    = BASE + "GrSk97UziTp1vndEAVDuaVO18k.png";
const SQ_WHO       = BASE + "CDi8od3bQ9AxZ99sxvMm2k4.png";
const SQ_TRIPLE    = BASE + "fxzETzoSfsr2clZ2wLcBXK9VfEA.png";
const SQ_RESQUED   = BASE + "4ztjKgGGxiciWB62obCh0ZZr9iU.png";

// Work-experience photos
const WE_PHOTOS = [
  BASE + "FRkj7J6yOqj9bBSMBJF7zdRGrY.png",
  BASE + "OrI0yvuP8iENTvaQ0zYfdI2YySM.png",
  BASE + "dxUPUyUpNCjMQjpL1pejQpnZ8e0.png",
  BASE + "zbVoYsGmG4nEEedbtgkv5193W6I.png",
  BASE + "Y6jrcs7yZkqh9sRA4eMYaPQ96pk.png",
];

// Decorations
const SLICE_52     = BASE + "EYbfG6roNwIxhPystqzDKOK4.png";
const SLICE_38     = BASE + "1bgfRN59yDW2dmlsTzqYiJIdnk.png";

// ── Data ──────────────────────────────────────────────────────────────────────
interface Project {
  id: string;
  name: string;
  description: string;
  lesson: string;
  notableWork: string[];
  impact: string;
  tagColor: string;
  tagBg: string;
  cardBg: string;
  logo: string;
  mockup: string;
}

const PROJECTS: Project[] = [
  {
    id: "bash",
    name: "Bash",
    description: "South Africa's largest omni-channel fashion and lifestyle shopping platform",
    lesson: "Learnt to think beyond what's expected",
    notableWork: ["BashPay", "Internal Packing Tool", "Kiosk", "Point of Sale"],
    impact: "Payment portal that increased payment success rate to 80%",
    tagColor: "#e35342",
    tagBg: "#f5e1cd",
    cardBg: "#f5ece3",
    logo: LOGO_BASH,
    mockup: MOCK_BASH,
  },
  {
    id: "pulse",
    name: "Pulse",
    description: "Watch the race from the athletes' point of view",
    lesson: "Learnt that design is a team's sport that involves people outside of design",
    notableWork: ["Stream uploader", "Home feed", "Race platform", "Event timeline"],
    impact: "Enabled athletes to easily upload their GoPro footages onto the app",
    tagColor: "#171717",
    tagBg: "#f5e1cd",
    cardBg: "#f5ece3",
    logo: LOGO_PULSE,
    mockup: MOCK_PULSE,
  },
  {
    id: "heygo",
    name: "Heygo",
    description: "Visit interesting places around the world through the eyes of a professional tour guide!",
    lesson: "Learnt design is a powerful alignment tool",
    notableWork: ["Streaming UI", "Stream creator"],
    impact: "Better streaming experience also increased tipping by 8%/stream",
    tagColor: "#e35342",
    tagBg: "#f5e1cd",
    cardBg: "#f5ece3",
    logo: LOGO_HEYGO,
    mockup: MOCK_HEYGO,
  },
  {
    id: "dotslash",
    name: "Dotslash",
    description: "Digital transformation agency. Helping businesses thrive in the digital landscape.",
    lesson: "Learnt how to make a good design, great.",
    notableWork: ["Dekra", "Balwin Fibre", "Junk Mail", "+4 other large projects..."],
    impact: "Turned large enterprise briefs into focused, polished design systems",
    tagColor: "#292929",
    tagBg: "#d4c2b2",
    cardBg: "#292929",
    logo: LOGO_DOTS,
    mockup: MOCK_DOTS,
  },
];

interface SideQuest {
  name: string;
  role: string;
  type: string;
  year?: string;
  description: string;
  image: string;
}

const SIDE_QUESTS: SideQuest[] = [
  {
    name: "Drift",
    role: "creator",
    type: "Design & Code",
    description: "Personal library of images that you found online or created",
    image: SQ_DRIFT,
  },
  {
    name: "TF2048",
    role: "creator",
    type: "Bot design · Site design · Concept art · 3D",
    year: "2021",
    description: "Puzzle based NFT",
    image: SQ_TF2048,
  },
  {
    name: "Who's Speaking",
    role: "creator",
    type: "Designer & Framer Developer",
    description: "Follow speakers and see where they are going to be speaking",
    image: SQ_WHO,
  },
  {
    name: "Triple Time",
    role: "Founding Product Designer",
    type: "Product Designer & Motion designer",
    year: "2025",
    description: "AI powered medical note taker for doctors",
    image: SQ_TRIPLE,
  },
  {
    name: "ResQued",
    role: "Founding Product Designer",
    type: "Product Designer",
    description: "Helping ordinary people deliver extraordinary acts of kindness",
    image: SQ_RESQUED,
  },
];

// ── ClothingTag ───────────────────────────────────────────────────────────────
function ClothingTag({ project }: { project: Project }) {
  const isDark = project.cardBg === "#292929";

  return (
    <div className="flex flex-col items-center shrink-0 w-[110px] select-none">
      {/* String */}
      <div className="w-px h-8 bg-current opacity-40" />

      {/* Tag body */}
      <div
        className="w-full rounded-[11px] overflow-hidden flex flex-col"
        style={{ boxShadow: "0px 1px 4px rgba(0,0,0,0.2)" }}
      >
        {/* Top band (accent color) */}
        <div
          className="w-full h-[14px]"
          style={{ backgroundColor: project.tagColor }}
        />

        {/* Main body */}
        <div
          className="flex flex-col items-center gap-3 px-3 py-3"
          style={{ backgroundColor: project.tagBg }}
        >
          {/* Punch hole */}
          <div className="w-4 h-4 rounded-full border-2 border-black/20 bg-white/60" />

          {/* Logo */}
          <img
            src={project.logo}
            alt={project.name}
            className="w-14 h-14 rounded-lg object-cover"
          />

          {/* Name */}
          <p
            className="text-[10px] font-semibold tracking-widest uppercase text-center"
            style={{ color: project.tagColor }}
          >
            {project.name}
          </p>

          {/* Barcode lines */}
          <div className="flex gap-px w-full justify-center">
            {Array.from({ length: 18 }).map((_, i) => (
              <div
                key={i}
                className="h-[28px] rounded-sm"
                style={{
                  width: i % 3 === 0 ? 3 : 1,
                  backgroundColor: isDark ? "#555" : "#222",
                  opacity: 0.5 + (i % 4) * 0.12,
                }}
              />
            ))}
          </div>

          {/* Barcode number */}
          <p className="font-mono text-[7px] tracking-[0.25em] opacity-40">
            43110
          </p>
        </div>
      </div>
    </div>
  );
}

// ── ProjectCard ───────────────────────────────────────────────────────────────
function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
      className="w-full flex flex-col gap-6"
    >
      {/* Top row: tag + mockup */}
      <div className="flex items-start gap-6">
        <ClothingTag project={project} />

        {/* Mockup card */}
        <div
          className="flex-1 rounded-[11px] overflow-hidden min-h-[248px]"
          style={{
            backgroundColor: project.cardBg,
            boxShadow: "0px 1px 2px rgba(0,0,0,0.15)",
          }}
        >
          <img
            src={project.mockup}
            alt={`${project.name} mockup`}
            className="w-full h-auto object-cover"
          />
        </div>
      </div>

      {/* Text content */}
      <div className="flex flex-col gap-4 pl-2">
        {/* Project name */}
        <h3
          className="text-[37px] leading-none"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          {project.name}
        </h3>

        {/* Description + lesson */}
        <div className="flex flex-col gap-1">
          <p className="text-[15px] text-black/70 leading-snug max-w-lg">
            {project.description}
          </p>
          <p
            className="text-[13px] italic"
            style={{ fontFamily: "'Caveat', cursive", color: project.tagColor, fontSize: 17 }}
          >
            {project.lesson}
          </p>
        </div>

        {/* Notable work */}
        <div className="flex flex-col gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-black/40">
            Notable work
          </p>
          <div className="flex flex-wrap gap-2">
            {project.notableWork.map((item) => (
              <span
                key={item}
                className="px-3 py-1 rounded-full text-[12px] font-medium"
                style={{
                  backgroundColor: project.tagBg,
                  color: project.tagColor,
                  border: `1px solid ${project.tagColor}30`,
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Impact quote */}
        <p
          className="text-[13px] leading-snug max-w-md pl-3 border-l-2"
          style={{ borderColor: project.tagColor, color: "rgba(0,0,0,0.55)" }}
        >
          {project.impact}
        </p>
      </div>
    </motion.div>
  );
}

// ── SideQuestCard ─────────────────────────────────────────────────────────────
function SideQuestCard({ sq, index }: { sq: SideQuest; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="flex flex-col rounded-[11px] overflow-hidden"
      style={{ boxShadow: "0px 1px 2px rgba(0,0,0,0.15)", backgroundColor: "#f5ece3" }}
    >
      {/* Image */}
      <div className="w-full aspect-video overflow-hidden">
        <img
          src={sq.image}
          alt={sq.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 p-4">
        <div className="flex items-center justify-between">
          <p className="text-[14px] font-semibold">{sq.name}</p>
          {sq.year && (
            <span className="text-[11px] font-mono opacity-40">{sq.year}</span>
          )}
        </div>
        <p className="text-[11px] uppercase tracking-wider text-black/40">{sq.role}</p>
        <p className="text-[12px] text-black/60 leading-snug mt-1">{sq.description}</p>
      </div>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function WorkSection() {
  return (
    <section className="w-full flex justify-center py-24 px-4 md:px-8">
      <div className="w-full max-w-3xl flex flex-col gap-20">

        {/* ── Section header ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <FramerHeader />
        </motion.div>

        {/* ── Project cards ──────────────────────────────────────── */}
        <div className="flex flex-col gap-16">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        {/* ── Side Quests ────────────────────────────────────────── */}
        <div className="flex flex-col gap-8 relative">
          {/* Decorative slices */}
          <img
            src={SLICE_52}
            alt=""
            className="absolute -right-8 -top-12 w-20 object-contain pointer-events-none hidden md:block opacity-80"
          />
          <img
            src={SLICE_38}
            alt=""
            className="absolute -left-6 bottom-8 w-12 object-contain pointer-events-none hidden md:block opacity-60"
          />

          <div className="flex flex-col gap-1">
            <p className="text-[11px] font-mono uppercase tracking-widest text-black/40">
              Side Quests
            </p>
            <h2
              className="text-[24px]"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Projects on the side
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SIDE_QUESTS.map((sq, i) => (
              <SideQuestCard key={sq.name} sq={sq} index={i} />
            ))}
          </div>
        </div>

        {/* ── Work Experience ────────────────────────────────────── */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-1">
            <p className="text-[11px] font-mono uppercase tracking-widest text-black/40">
              Experience
            </p>
            <h2
              className="text-[24px]"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Where I've worked
            </h2>
          </div>

          <div className="flex flex-row flex-wrap gap-3">
            {WE_PHOTOS.map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="rounded-[11px] overflow-hidden"
                style={{ boxShadow: "0px 1px 2px rgba(0,0,0,0.15)" }}
              >
                <img
                  src={src}
                  alt={`Work experience ${i + 1}`}
                  className="w-28 h-28 object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
