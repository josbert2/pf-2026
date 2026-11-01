import { useEffect, useState } from "react";
import WorkFull from "../components/work/WorkFull";
import { fallbackContent, fetchContent, localizeContent, type Content } from "../lib/content";
import { PageHead, useLang } from "../lib/i18n";

export default function WorkPage() {
  // Prerender/SSG renders with the bundled content; the client then pulls
  // the live version from MySQL (via the API) on mount.
  const lang = useLang();
  const [data, setData] = useState<Content>(() => localizeContent(fallbackContent, lang));

  useEffect(() => {
    const ctrl = new AbortController();
    fetchContent(ctrl.signal).then((c) => setData(localizeContent(c, lang)));
    return () => ctrl.abort();
  }, [lang]);

  return (
    <>
      <PageHead
        path="/work"
        title={lang === "es" ? "Trabajo — josbert" : "Work — josbert"}
        description={
          lang === "es"
            ? "Trabajo seleccionado y proyectos paralelos — lugares donde he estado y cosas que he aprendido como ingeniero frontend."
            : "Selected work and side quests — places I've been and things I've learnt as a frontend engineer."
        }
      />
      <WorkFull data={data} />
    </>
  );
}
