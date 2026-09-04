import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

const IMG_1 =
  "/work-clone/framer/images/rhT0iPheLHJdGQAZ04lGqNb0I.png";
const IMG_2 =
  "/work-clone/framer/images/m0nSd9OmKrRp1nvRHVH89tLs0mg.png";
const IMG_3 =
  "/work-clone/framer/images/0aKOwaR29QHg04I7MHlsi9j1g4.png";

export default function ValuesWidget() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Card 1 — "tirelessly pursue clarity."
  const card1X = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const card1Y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const card1Rotate = useTransform(scrollYProgress, [0, 1], [0, -8]);

  // Card 2 — "Software should empower."
  const card2X = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const card2Y = useTransform(scrollYProgress, [0, 1], [0, -10]);
  const card2Rotate = useTransform(scrollYProgress, [0, 1], [0, 10]);

  // Card 3 — "Design for moments"
  const card3X = useTransform(scrollYProgress, [0, 1], [0, 0]);
  const card3Y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const card3Rotate = useTransform(scrollYProgress, [0, 1], [0, 4]);

  return (
    <div ref={containerRef} className="w-full">
      <div className="sticky top-20 w-full flex items-center justify-center overflow-hidden ">
        {/* Canvas: 670 x 497 */}
        <div style={{ width: 670, height: 497, position: "relative" }}>

          {/* Card 1 — tirelessly pursue clarity. */}
          <motion.div
            style={{
              position: "absolute",
              left: 81,
              top: 89,
              width: 207,
              height: 164,
              zIndex: 2,
              x: card1X,
              y: card1Y,
              rotate: card1Rotate,
            }}
          >
            <div
              style={{
                width: 208,
                height: 156,
                borderRadius: 13,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <img
                src={IMG_1}
                alt=""
                loading="lazy"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "50% 50%",
                  display: "block",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 14,
                  top: 44,
                  width: 157,
                  transform: "rotate(-2deg)",
                  pointerEvents: "none",
                }}
              >
                <p
                  style={{
                    fontFamily: '"Gochi Hand", sans-serif',
                    fontSize: 32,
                    fontWeight: 400,
                    color: "#171717",
                    lineHeight: "25.6px",
                    margin: 0,
                  }}
                >
                  tirelessly pursue clarity.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Card 2 — Software should empower. */}
          <motion.div
            style={{
              position: "absolute",
              left: 381,
              top: 75,
              width: 209,
              height: 189,
              zIndex: 1,
              x: card2X,
              y: card2Y,
              rotate: card2Rotate,
            }}
          >
            <div
              style={{
                width: 224,
                height: 183,
                borderRadius: 13,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <img
                src={IMG_3}
                alt=""
                loading="lazy"
                style={{
                  position: "absolute",
                  width: 249,
                  height: 202,
                  left: -13,
                  top: -2,
                  objectFit: "contain",
                  objectPosition: "50% 50%",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 26,
                  top: 48,
                  width: 157,
                  transform: "rotate(-1deg)",
                  pointerEvents: "none",
                }}
              >
                <p
                  style={{
                    fontFamily: '"Geist Mono", monospace',
                    fontSize: 27,
                    fontWeight: 400,
                    color: "#171717",
                    lineHeight: "25px",
                    margin: 0,
                  }}
                >
                  Software should empower.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Card 3 — Design for moments */}
          <motion.div
            style={{
              position: "absolute",
              left: 342,
              top: 277,
              width: 228,
              height: 164,
              x: card3X,
              y: card3Y,
              rotate: card3Rotate,
            }}
          >
            <div
              style={{
                width: 228,
                height: 163,
                borderRadius: 13,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <img
                src={IMG_2}
                alt=""
                loading="lazy"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  objectPosition: "50% 50%",
                  display: "block",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 37,
                  top: 58,
                  width: 158,
                  pointerEvents: "none",
                }}
              >
                <p
                  style={{
                    fontSize: 27,
                    fontWeight: 600,
                    color: "#171717",
                    lineHeight: "29.7px",
                    margin: 0,
                  }}
                >
                  Design for moments
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
