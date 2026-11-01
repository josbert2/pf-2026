import { Head } from "vite-react-ssg";
import { localePath, useLang, useT } from "../lib/i18n";

export default function NotFoundPage() {
  const lang = useLang();
  const t = useT();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center font-mono text-paper px-6 text-center">
      <Head>
        <title>404 — page not found</title>
        <meta name="robots" content="noindex" />
      </Head>
      <p className="text-[10rem] leading-none font-departure text-accent-red select-none">
        404
      </p>
      <h1 className="mt-4 text-xl">{t("nf_title")}</h1>
      <p className="mt-2 text-sm opacity-60">
        {t("nf_body")}
      </p>
      <a
        href={localePath("/", lang)}
        className="mt-8 border border-paper/40 px-5 py-2 text-sm hover:bg-paper hover:text-ink transition-colors"
      >
        {t("nf_back")}
      </a>
    </div>
  );
}
