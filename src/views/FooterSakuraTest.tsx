import FooterSakura from "../components/FooterSakura";

/**
 * Página de testeo aislada para FooterSakura.
 * Solo el componente, sin nav, sin home, sin nada.
 */
export default function FooterSakuraTest() {
  return (
    <div style={{ minHeight: "100vh", background: "#000" }}>
      <FooterSakura />
    </div>
  );
}
