import { motion } from "motion/react";
import type { DoodleData } from "../data/doodles";

export default function Doodle({ data }: { data: DoodleData }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
      className="absolute z-10 pointer-events-none drop-shadow-sm select-none"
      style={{
        ...data.position,
        rotate: data.rotation || "0deg",
        width: `${data.width}px`,
      }}
    >
      <img src={data.url} alt={data.name || "Doodle"} className="w-full h-auto" draggable={false} />
    </motion.div>
  );
}
