import HeaderTop from "../components/work/HeaderTop";
import BashCard from "../components/work/BashCard";
import PulseCard from "../components/work/PulseCard";
import HeygoCard from "../components/work/HeygoCard";

export default function WorkPage() {
  return (
    <div className="min-h-screen bg-[#212121] flex flex-col items-center gap-12 py-12">
      <HeaderTop />
      <BashCard />
      <PulseCard />
      <HeygoCard />
    </div>
  );
}
