import { COLOR } from "./tokens";

type Props = {
  className?: string;
  /** color del papel (relleno) */
  fill?: string;
  style?: React.CSSProperties;
};

/**
 * Borde superior rasgado del paper crema. Reemplaza los SVG faltantes
 * `framer-1oq3aph` + `framer-513xkd` ("Cut out", 561+560 x 54, top:-41).
 *
 * En el original es la hoja arrancada de un cuaderno: picos de PAPEL CREMA
 * que sobresalen hacia arriba; entre los picos se ve el fondo. El relleno va
 * por DEBAJO de la línea dentada, la parte de arriba es transparente.
 *
 * viewBox 1109x54 = ancho exacto del paper. Picos irregulares (no triángulos
 * regulares) para que parezca rasgado de verdad.
 */
export default function TornEdge({
  className,
  fill = COLOR.creamPaper,
  style,
}: Props) {
  return (
    <svg
      className={className}
      style={{ display: "block", ...style }}
      width="1109"
      height="54"
      viewBox="0 0 1109 54"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        fill={fill}
        d="M0 54 L0 31
           L26 14 L48 33 L70 9 L101 27 L128 6 L150 30 L181 13
           L206 34 L233 8 L262 28 L289 11 L317 31 L342 7
           L371 26 L398 12 L426 33 L451 6 L482 29 L508 14
           L534 32 L561 9 L589 27 L614 6 L642 30 L668 12
           L695 33 L721 8 L749 28 L774 13 L803 31 L829 7
           L857 26 L883 11 L911 33 L937 9 L965 29 L990 14
           L1018 32 L1044 8 L1071 27 L1090 13 L1109 30
           L1109 54 Z"
      />
    </svg>
  );
}
