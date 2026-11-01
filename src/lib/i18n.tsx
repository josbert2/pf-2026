import { createContext, useContext } from "react";
import { Head } from "vite-react-ssg";
import { useLocation } from "react-router-dom";
import { SITE_URL } from "./site";

/**
 * Languages. English lives at "/", "/work"…; Spanish under "/es". nginx sends
 * first-time visitors whose browser prefers Spanish to /es, and the `lang`
 * cookie (set by the switcher) always wins over the browser.
 */
export const LANGS = ["en", "es"] as const;
export type Lang = (typeof LANGS)[number];

const LangContext = createContext<Lang>("en");
export const LangProvider = LangContext.Provider;
export const useLang = () => useContext(LangContext);

/** "/work" → "/es/work", "/#connect" → "/es#connect". */
export function localePath(path: string, lang: Lang): string {
  if (lang === "en") return path;
  const [p, hash] = path.split("#");
  return (p === "/" || p === "" ? "/es" : `/es${p}`) + (hash !== undefined ? `#${hash}` : "");
}

/** "/es/work" → "/work". */
export const stripLang = (pathname: string) => pathname.replace(/^\/es(?=\/|$)/, "") || "/";

/** Remember an explicit choice so nginx stops guessing from Accept-Language. */
export function rememberLang(lang: Lang) {
  document.cookie = `lang=${lang}; path=/; max-age=31536000; samesite=lax`;
}

// Interface strings that aren't page content (that lives in the CMS).
const UI = {
  en: {
    nav_about: "about",
    nav_work: "Work",
    nav_connect: "Connect",
    switch_label: "Language",
    nf_title: "this page wandered off the desk",
    nf_body: "the route you followed doesn't exist (or never did).",
    nf_back: "← back home",
  },
  es: {
    nav_about: "sobre mí",
    nav_work: "Trabajo",
    nav_connect: "Contacto",
    switch_label: "Idioma",
    nf_title: "esta página se cayó del escritorio",
    nf_body: "la ruta que seguiste no existe (o nunca existió).",
    nf_back: "← volver al inicio",
  },
} satisfies Record<Lang, Record<string, string>>;

export type UiKey = keyof (typeof UI)["en"];
export function useT() {
  const lang = useLang();
  return (key: UiKey) => UI[lang][key];
}

/**
 * Per-page <head>: title/description, canonical for the current language,
 * hreflang alternates and <html lang>. `path` is the English path.
 */
export function PageHead({
  path,
  title,
  description,
  ogDescription,
}: {
  path: string;
  title: string;
  description: string;
  ogDescription?: string;
}) {
  const lang = useLang();
  const url = (l: Lang) => SITE_URL + (localePath(path, l) === "/" ? "" : localePath(path, l));
  return (
    <Head htmlAttributes={{ lang }}>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url(lang)} />
      {LANGS.map((l) => (
        <link key={l} rel="alternate" hrefLang={l} href={url(l)} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={url("en")} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={ogDescription ?? description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url(lang)} />
      <meta property="og:locale" content={lang === "es" ? "es_CL" : "en_US"} />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
}

/** EN / ES toggle, fixed to the top-right corner of every public page. */
export function LangSwitch() {
  const lang = useLang();
  const { pathname, hash } = useLocation();
  const base = stripLang(pathname);
  const t = useT();
  return (
    <nav
      aria-label={t("switch_label")}
      className="fixed right-4 top-4 z-[100] flex items-center gap-1 rounded-full border border-paper/25 bg-[#212121]/80 px-3 py-1 font-gochi text-[17px] leading-none text-paper backdrop-blur"
    >
      {LANGS.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span className="text-paper/30">/</span>}
          {/* Full page load: the target page prerenders in its own language. */}
          <a
            href={localePath(base, l) + hash}
            hrefLang={l}
            lang={l}
            aria-current={l === lang ? "true" : undefined}
            onClick={() => rememberLang(l)}
            className={l === lang ? "text-accent-red" : "text-paper/60 transition-colors hover:text-paper"}
          >
            {l.toUpperCase()}
          </a>
        </span>
      ))}
    </nav>
  );
}
