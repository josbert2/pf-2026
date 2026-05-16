/**
 * Tokens compartidos del About — extraídos 1:1 de seccion.html (Framer export).
 */

export const COLOR = {
  /** rgb(227,83,66) — borde rojo, acentos, texto hero */
  red: "#E35342",
  /** rgb(245,225,205) — paper crema (hoja principal + card "but I'm also") */
  creamPaper: "#F5E1CD",
  /** rgb(245,236,227) — card del video (Coder), un punto más clara */
  creamCard: "#F5ECE3",
  /** rgb(242,227,207) — texto crema de los tabs del nav */
  creamText: "#F2E3CF",
  /** rgb(23,23,23) — tinta de "Senior level" */
  ink: "#171717",
} as const;

export const FONT = {
  /** Gochi Hand — tabs, titulo y lista de "but I'm also" */
  hand: "'Gochi Hand', cursive",
  /** Awesome Serif (Semi Bold Extra Tall en el original, no cargada) — texto hero */
  serif: "'Awesome Serif Tall', 'Awesome Serif Regular', serif",
  /** Departure Mono — "Senior level" */
  mono: "'Departure Mono Regular', monospace",
  /** JetBrains Mono — handle @ del Coder card */
  code: "'JetBrains Mono', monospace",
} as const;

/** Assets de framerusercontent referenciados por la sección. */
export const ASSET = {
  /** textura de grano del card rojo (199x199, repeat 87.5px) */
  redTexture:
    "https://framerusercontent.com/images/UonnlSBTR9CcORRKyNNzZiZ7WkY.png",
  /** grilla de cuaderno del paper crema (202x202, repeat 46.5px) */
  paperGrid:
    "https://framerusercontent.com/images/fiStjr6PCyart5FAr44gZdenfA.png",
  /** video loop del Coder card */
  coderVideo:
    "https://framerusercontent.com/assets/aEDCm88BLZ9JITKd7a62DPaw.mp4",
} as const;
