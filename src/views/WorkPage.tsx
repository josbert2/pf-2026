import { useEffect, useState } from "react";
import { Head } from "vite-react-ssg";
import WorkFull from "../components/work/WorkFull";
import { fallbackContent, fetchContent, type Content } from "../lib/content";
import { SITE_URL } from "../lib/site";

export default function WorkPage() {
  // Prerender/SSG renders with the bundled content; the client then pulls
  // the live version from MySQL (via the API) on mount.
  const [data, setData] = useState<Content>(fallbackContent);

  useEffect(() => {
    const ctrl = new AbortController();
    fetchContent(ctrl.signal).then(setData);
    return () => ctrl.abort();
  }, []);

  return (
    <>
      <Head>
        <title>Work — josbert</title>
        <meta
          name="description"
          content="Selected work and side quests — places I've been and things I've learnt as a frontend engineer."
        />
        <link rel="canonical" href={`${SITE_URL}/work`} />
        <meta property="og:title" content="Work — josbert" />
        <meta
          property="og:description"
          content="Selected work and side quests — places I've been and things I've learnt."
        />
        <meta property="og:url" content={`${SITE_URL}/work`} />
        <meta property="og:type" content="website" />
      </Head>
      <WorkFull data={data} />
    </>
  );
}
