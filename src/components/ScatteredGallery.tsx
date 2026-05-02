import { motion } from "motion/react";
import { projects } from "../data/projects";

export default function ScatteredGallery() {
  return (
    <section className="relative w-full min-h-[250vh] md:min-h-[350vh] bg-transparent py-20 pointer-events-none">
      <div className="absolute inset-0 max-w-[1400px] mx-auto pointer-events-auto">
        {projects.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: (idx % 5) * 0.1 }}
            className={`absolute flex flex-col group cursor-pointer`}
            style={{
              top: project.position.top,
              left: project.position.left,
              rotate: project.rotation,
              maxWidth: `min(90vw, ${project.width / 2}px)`, // Scale down slightly on desktop, constrain on mobile
              width: "100%",
              zIndex: project.zIndex || 1,
            }}
            whileHover={{ scale: 1.05, zIndex: 20 }}
          >
            {project.link ? (
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="block w-full">
                <div className="bg-white p-2 md:p-3 rounded-2xl shadow-xl border border-white/20 transition-shadow group-hover:shadow-2xl">
                  <img
                    src={project.url}
                    alt={project.title}
                    className="w-full h-auto object-cover rounded-xl"
                  />
                </div>
              </a>
            ) : (
              <div className="bg-white p-2 md:p-3 rounded-2xl shadow-xl border border-white/20 transition-shadow group-hover:shadow-2xl">
                <img
                  src={project.url}
                  alt={project.title}
                  className="w-full h-auto object-cover rounded-xl"
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
