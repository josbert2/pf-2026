import { ViteReactSSG } from "vite-react-ssg";
import type { RouteRecord } from "vite-react-ssg";
import "./index.css";
import App from "./App.tsx";
import WorkPage from "./views/WorkPage.tsx";
import AboutPage from "./views/AboutPage.tsx";
import NotFoundPage from "./views/NotFoundPage.tsx";
import { LANGS, LangProvider, LangSwitch, localePath, type Lang } from "./lib/i18n.tsx";

const PAGES: Array<[path: string, page: () => React.ReactNode]> = [
  ["/", () => <App />],
  ["/work", () => <WorkPage />],
  ["/about", () => <AboutPage />],
];

// Each page once per language: "/work" (en) and "/es/work" (es), each
// prerendered with its own copy.
const localized = (lang: Lang, el: React.ReactNode) => (
  <LangProvider value={lang}>
    <LangSwitch />
    {el}
  </LangProvider>
);

export const routes: RouteRecord[] = [
  ...LANGS.flatMap((lang) =>
    PAGES.map(([path, page]) => ({ path: localePath(path, lang), element: localized(lang, page()) })),
  ),
  // CMS panel: its own chunk so the public pages don't ship the editor code.
  { path: "/admin", lazy: () => import("./admin/AdminApp.tsx").then((m) => ({ Component: m.default })) },
  // "/404" prerenders to dist/404.html (served by nginx via error_page);
  // "*" covers client-side navigation to unknown paths.
  { path: "/404", element: <NotFoundPage /> },
  { path: "/es/*", element: localized("es", <NotFoundPage />) },
  { path: "*", element: <NotFoundPage /> },
];

export const createRoot = ViteReactSSG({ routes });
