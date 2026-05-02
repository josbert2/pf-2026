import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

const PROJECTS = [
  {
    id: 1,
    title: "OpenSys ERP",
    category: "Business Management",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
    rotate: "-rotate-3",
    margin: "mt-0 md:mt-12",
  },
  {
    id: 2,
    title: "Entrekids",
    category: "Marketplace & Tickets",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop",
    rotate: "rotate-2",
  },
  {
    id: 3,
    title: "Vaultec API",
    category: "Developer Tools",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
    rotate: "-rotate-1",
    margin: "mt-12 md:mt-24",
  },
  {
    id: 4,
    title: "ExpenseTrackr",
    category: "Financial App",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop",
    rotate: "rotate-3",
  }
];

export default function PolaroidGallery() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-x-16 lg:gap-x-24 pb-32">
      {PROJECTS.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className={`polaroid cursor-pointer relative ${project.rotate} ${project.margin || ""}`}
        >
          {/* Masking tape artifact */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#E8E4D9]/80 backdrop-blur-sm transform -rotate-2 border border-black/5 opacity-80" />

          {/* The Photo */}
          <div className="w-full aspect-square bg-[#1a1a1a] overflow-hidden rounded-[2px] mb-4 group group-hover:shadow-inner relative">
            <img 
              src={project.image} 
              alt={project.title} 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-105"
            />
            {/* View Layer */}
            <div className="absolute inset-0 bg-ink/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <div className="w-12 h-12 bg-paper rounded-full flex items-center justify-center text-ink transform translate-y-4 group-hover:translate-y-0 transition-transform">
                  <ArrowUpRight size={20} />
               </div>
            </div>
          </div>

          {/* The Handwriting Caption */}
          <div className="flex flex-col items-center">
            <h3 className="font-handwriting text-ink text-3xl font-bold">{project.title}</h3>
            <p className="font-times text-ink/50 text-sm uppercase tracking-widest mt-1 italic">{project.category}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
