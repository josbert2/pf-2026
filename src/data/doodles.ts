export interface DoodleData {
  id: string;
  name: string;
  url: string;
  position: { top?: string; bottom?: string; left?: string; right?: string };
  rotation?: string;
  width: number;
}

// These URLs are placeholders for the actual Framer doodles 
// (gato, pez, flores, pájaro, setas, dados)
export const doodles: DoodleData[] = [
  {
    id: "doodle-cat",
    name: "Cat",
    url: "/work-clone/framer/images/0aKOwaR29QHg04I7MHlsi9j1g4.png", // Example URL from extract
    position: { top: "15%", left: "10%" },
    rotation: "-10deg",
    width: 80,
  },
  {
    id: "doodle-fish",
    name: "Fish",
    url: "/work-clone/framer/images/0Kj6KlVZPILk9uoSPK7tmq8hGJU.png",
    position: { top: "35%", right: "12%" },
    rotation: "15deg",
    width: 70,
  },
  {
    id: "doodle-flowers",
    name: "Flowers",
    url: "/work-clone/framer/images/0pNvbqriNrL1D2jxTeMwqGMPVo.png",
    position: { bottom: "25%", left: "8%" },
    rotation: "-5deg",
    width: 100,
  },
  {
    id: "doodle-bird",
    name: "Bird",
    url: "/work-clone/framer/images/2LGPmWLUdShRmg0q79YvdcxivM.png",
    position: { bottom: "45%", right: "15%" },
    rotation: "25deg",
    width: 65,
  },
  {
    id: "doodle-mushroom",
    name: "Mushrooms",
    url: "/work-clone/framer/images/5kwx3ViaHeW5I6KliMS9bsYa0U.png",
    position: { top: "50%", left: "5%" },
    rotation: "5deg",
    width: 80,
  },
  {
    id: "doodle-dice",
    name: "Dice",
    url: "/work-clone/framer/images/5YyYUryAtcl0ESyOgNb4S9dajw.png",
    position: { bottom: "10%", right: "5%" },
    rotation: "-15deg",
    width: 75,
  }
];
