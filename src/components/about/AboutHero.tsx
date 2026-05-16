/**
 * AboutHero — "Top section" de seccion.html (Framer export), reconstruida
 * 1:1 a medidas de pixel exactas.
 *
 *   Nav "About - Active" .......... 327 x 103
 *   Card "Top paper" .............. 1190 x 858
 *     ├─ "BG Surface" (rojo) ...... 1175 x 824  · top:23 left:7.5 · rotate -1° · radius 9 · pad 17
 *     └─ "Paper" (crema) .......... 1109 x 817  · top:0  left:40.5
 *          ├─ "Cut out" .......... borde rasgado, top:-41
 *          ├─ "Grid" ............. grilla cuaderno, opacity 0.08
 *          ├─ "Senior level" ..... top:58  left:157   · Departure Mono 29
 *          ├─ hero text .......... top:279 left:157.7 · Awesome Serif 29/600 · w727
 *          └─ zona inferior ...... top:349 left:89.5  · 929 x 435
 *               ├─ Coder card .... top:44   left:434
 *               ├─ PartsOfMe ..... top:47.5 left:45
 *               └─ strip rojo .... top:36   left:156  · 114 x 31
 */

import { COLOR, FONT, ASSET } from "./tokens";
import TopNav from "../TopNav";
import TornEdge from "./TornEdge";
import PartsOfMe from "./PartsOfMe";
import CoderCard from "./CoderCard";

export default function AboutHero() {
  return (
    <div className="flex flex-col items-center">
      {/* Nav — componente propio del proyecto */}
      <div style={{ width: 1190 }}>
        <TopNav />
      </div>

      {/* Card "Top paper" — margen para que el borde rasgado no pise el nav */}
      <div
        className="relative"
        style={{ width: 1190, height: 858, marginTop: 56 }}
      >
        {/* ── BG Surface (card rojo, detrás) ── */}
        <div
          className="absolute overflow-hidden"
          style={{
            top: 23,
            left: 7.5,
            width: 1175,
            height: 824,
            padding: 17,
            backgroundColor: COLOR.red,
            borderRadius: 9,
            transform: "rotate(-1deg)",
          }}
        >
          {/* textura de grano — framer-yb0qwh */}
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url(${ASSET.redTexture})`,
              backgroundRepeat: "repeat",
              backgroundSize: "87.5px auto",
              mixBlendMode: "soft-light",
              opacity: 0.7,
            }}
          />
        </div>

        {/* ── Paper (hoja crema, encima) ── */}
        <div
          className="absolute"
          style={{
            top: 0,
            left: 40.5,
            width: 1109,
            height: 817,
            backgroundColor: COLOR.creamPaper,
            boxShadow: "rgba(0,0,0,0.25) 0px 1px 2px 0px",
          }}
        >
          {/* Cut out — borde rasgado, sobresale 41px hacia arriba */}
          <TornEdge
            style={{ position: "absolute", top: -41, left: 0, zIndex: 4 }}
          />

          {/* Grid — grilla de cuaderno */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url(${ASSET.paperGrid})`,
              backgroundRepeat: "repeat",
              backgroundPosition: "center top",
              backgroundSize: "46.5px auto",
              opacity: 0.08,
            }}
          />

          {/* Senior level — framer-1yir115 */}
          <p
            className="absolute"
            style={{
              top: 58,
              left: 157,
              margin: 0,
              fontFamily: FONT.mono,
              fontSize: 29,
              lineHeight: 1.2,
              color: COLOR.ink,
              zIndex: 2,
            }}
          >
            Senior level
          </p>

          {/* Hero text — framer-1mxaps5 */}
          <p
            className="absolute"
            style={{
              top: 279,
              left: 157.7,
              width: 727,
              margin: 0,
              fontFamily: FONT.serif,
              fontSize: 29,
              fontWeight: 600,
              lineHeight: 1.2,
              color: COLOR.red,
              zIndex: 2,
            }}
          >
            For the past 10 years, I've been turning complex ideas into
            interactable stuff.
          </p>

          {/* Zona inferior — framer-1pmautr-container (929 x 435) */}
          <div
            className="absolute"
            style={{ top: 349, left: 89.5, width: 929, height: 435, zIndex: 2 }}
          >
            {/* Coder card */}
            <div className="absolute" style={{ top: 44, left: 434 }}>
              <CoderCard />
            </div>

            {/* PartsOfMe ("but I'm also") */}
            <div className="absolute" style={{ top: 47.5, left: 45 }}>
              <PartsOfMe />
            </div>

            {/* Strip rojo decorativo — framer-dcummz (encima de PartsOfMe) */}
            <span
              aria-hidden
              className="absolute"
              style={{
                top: 36,
                left: 156,
                width: 114,
                height: 31,
                backgroundColor: COLOR.red,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
