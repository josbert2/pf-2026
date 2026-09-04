import { ViteReactSSG } from "vite-react-ssg";
import type { RouteRecord } from "vite-react-ssg";
import "./index.css";
import App from "./App.tsx";
import WorkPage from "./views/WorkPage.tsx";
import AboutPage from "./views/AboutPage.tsx";
import NotFoundPage from "./views/NotFoundPage.tsx";

export const routes: RouteRecord[] = [
  { path: "/", element: <App /> },
  { path: "/work", element: <WorkPage /> },
  { path: "/about", element: <AboutPage /> },
  // "/404" prerenders to dist/404.html (served by nginx via error_page);
  // "*" covers client-side navigation to unknown paths.
  { path: "/404", element: <NotFoundPage /> },
  { path: "*", element: <NotFoundPage /> },
];

export const createRoot = ViteReactSSG({ routes });
