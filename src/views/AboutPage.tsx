import AboutHero from "../components/about/AboutHero";

export default function AboutPage() {
  return (
    <main className="min-h-screen w-full bg-[#212121] flex justify-center overflow-x-hidden py-20">
      <div className="about-scale-wrap">
        <AboutHero />
      </div>
    </main>
  );
}
