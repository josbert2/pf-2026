import { Head } from "vite-react-ssg";
import { SITE_URL } from "./lib/site";

import HeroNotebook from "./components/HeroNotebook";
import FooterSection from "./components/FooterSection";
import ClickBurst from "./components/ClickBurst";
import LeftSidebar from "./components/LeftSidebar";
import RightSidebar from "./components/RightSidebar";
import TopNav from "./components/TopNav";
import DecoSticker from "./components/DecoSticker";
import TirelesslyPursueClarity from "./components/TirelesslyPursueClarity";
import AboutSectionFramer from "./components/AboutSectionFramer";
import ValuesSection from "./components/ValuesSection";
import EmpowerSection from "./components/EmpowerSection";

export default function App() {
  return (
    <div className="min-h-screen relative font-mono text-light overflow-hidden flex flex-col">
      <Head>
        <title>josbert — frontend engineer &amp; creative developer</title>
        <meta
          name="description"
          content="Portfolio of josbert — frontend engineer and creative developer. Software should empower; design for the moments that matter."
        />
        <link rel="canonical" href={SITE_URL} />
        <meta property="og:title" content="josbert — frontend engineer & creative developer" />
        <meta
          property="og:description"
          content="Software should empower; design for the moments that matter."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <ClickBurst />
      
      {/* Decorative Scattered Stickers */}
      <DecoSticker
         src="/work-clone/framer/images/cqrOEukUtJ5q6innagqIo1y7ig.png"
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
         src="/work-clone/framer/images/0pNvbqriNrL1D2jxTeMwqGMPVo.png"
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
         src="/work-clone/framer/images/CMfmtNsS4WRTLeJcQt1lujXYM.png"
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
         src="/work-clone/framer/images/DUDVhZzaglA4vXZTKvTA6gePrU.png"
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
         src="/work-clone/framer/images/qe4YBLLmBViMAbL2fiphUNfdxA.png"
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
         src="/work-clone/framer/images/uNzaxXZLk1aHsF3AXi7f4aGR0g.png" 
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

          {/* 2. TIRELESSLY PURSUE CLARITY */}
          <TirelesslyPursueClarity />



        </main>

        {/* RIGHT DESK BORDER / SIDEBAR STAMPS */}
        <RightSidebar />
      </div>

      {/* 3. VALUES SECTION — "Design for moments" (values2, Framer export) */}
      <div className="w-full flex justify-center overflow-hidden">
        <div className="framer-scale-wrap">
          <ValuesSection />
        </div>
      </div>

      {/* 4. EMPOWER SECTION — "Sofware should empower" (values3, Framer export) */}
      <div className="w-full flex justify-center overflow-hidden">
        <div className="framer-scale-wrap">
          <EmpowerSection />
        </div>
      </div>

      {/* 5. ABOUT SECTION — scrapbook collage (Framer export) */}
      <div id="about" className="w-full flex justify-center py-20 overflow-hidden scroll-mt-10">
        <div className="framer-scale-wrap">
          <AboutSectionFramer />
        </div>
      </div>

      {/* 4. FOOTER SECTION */}
      <div id="connect" className="scroll-mt-10">
        <FooterSection />
      </div>

    </div>
  );
}
