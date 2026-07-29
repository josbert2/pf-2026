import { motion } from "motion/react";
import { useLenis } from "./lib/useLenis";

import HeroNotebook from "./components/HeroNotebookAI";
import ScatteredGallery from "./components/ScatteredGallery";
import FooterMarquee from "./components/FooterMarquee";
import FooterSection from "./components/FooterSection";
import ClickBurst from "./components/ClickBurst";
import LeftSidebar from "./components/LeftSidebar";
import RightSidebar from "./components/RightSidebar";
import TopNav from "./components/TopNav";
import Doodle from "./components/Doodle";
import ProfilePolaroid from "./components/ProfilePolaroid";
import FooterCTA from "./components/FooterCTA";
import DecoSticker from "./components/DecoSticker";
import ValuesWidget from "./components/ValuesWidget";
import TirelesslyPursueClarity from "./components/TirelesslyPursueClarity";
import AboutSection from "./components/AboutSection";
import AboutSectionFramer from "./components/AboutSectionFramer";
import ValuesSection from "./components/ValuesSection";
import EmpowerSection from "./components/EmpowerSection";
import FooterSakura from "./components/FooterSakura";
import ContactSection from "./components/ContactSection";

import { doodles } from "./data/doodles";

export default function App() {
  useLenis();

  return (
    <div className="min-h-screen relative font-mono text-light overflow-hidden flex flex-col">
      <ClickBurst />
      
      {/* Decorative Scattered Stickers */}
      <DecoSticker
         src="https://framerusercontent.com/images/cqrOEukUtJ5q6innagqIo1y7ig.png"
         alt="Deco - flower 01"
         className="hidden lg:block"
         style={{
           top: "1243px",
           right: "108px",
           width: "163px",
           height: "193.812px",
           aspectRatio: "0.840964 / 1",
         }}
      />
      <DecoSticker
         src="https://framerusercontent.com/images/0pNvbqriNrL1D2jxTeMwqGMPVo.png"
         alt="Decor - flower 02"
         className="hidden lg:block"
         style={{
           top: "882px",
           right: "273px",
           width: "154px",
           height: "314.5px",
           aspectRatio: "0.489666 / 1",
         }}
      />
      <DecoSticker
         src="https://framerusercontent.com/images/CMfmtNsS4WRTLeJcQt1lujXYM.png"
         alt="Deco - fish"
         className="hidden lg:block"
         style={{
           top: "1162px",
           left: "75px",
           width: "219px",
           height: "123.5px",
           aspectRatio: "1.77328 / 1",
         }}
      />
      <DecoSticker
         src="https://framerusercontent.com/images/DUDVhZzaglA4vXZTKvTA6gePrU.png"
         alt="Deco godzilla"
         className="hidden lg:block"
         style={{
           top: "516.891px",
           right: "139px",
           width: "155px",
           height: "109.109px",
           aspectRatio: "1.42053 / 1",
         }}
      />
      <DecoSticker
         src="https://framerusercontent.com/images/qe4YBLLmBViMAbL2fiphUNfdxA.png"
         alt="Deco noodle"
         className="hidden lg:block"
         style={{
           top: "320.609px",
           right: "108px",
           width: "131px",
           height: "87.1875px",
           aspectRatio: "1.50244 / 1",
           transform: "translateY(-43.5938px)",
         }}
      />
      <DecoSticker 
         src="https://framerusercontent.com/images/uNzaxXZLk1aHsF3AXi7f4aGR0g.png" 
         alt="Deco juicebox" 
         className="top-32 left-32 w-[104px] hidden lg:block"
         style={{ aspectRatio: "0.677536", height: "153px" }}
      />
      
      {/* Dynamic Scattered Doodles (currently disabled) */}
      {/* {doodles.map(doodle => (
        <Doodle key={doodle.id} data={doodle} />
      ))} */}

      <div className="flex w-full flex-1 justify-between relative z-10">
        {/* LEFT DESK BORDER / SIDEBAR STAMPS */}
        <LeftSidebar />

        {/* MAIN SCROLLING CONTENT AREA (The "Desk") */}
        <main className="mt-40 flex flex-col items-center z-10 mx-auto">
          
          

          {/* THE NAVIGATION BAR */}
          <div className="mt-8 md:mt-0 w-full max-w-5xl">
            <TopNav />
          </div>

          {/* 1. THE NOTEBOOK SECTION */}
          <HeroNotebook />

     



        </main>

        {/* RIGHT DESK BORDER / SIDEBAR STAMPS */}
        <RightSidebar />
      </div>

     


      {/* 5. ABOUT SECTION — scrapbook collage (Framer export) */}
      <div className="w-full flex justify-center py-20 overflow-hidden">
        <div className="framer-scale-wrap">
          <AboutSectionFramer />
        </div>
      </div>


      {/* 6. Contact Section */}
      <ContactSection />



    </div>
  );
}
