import { useEffect, useState, type FormEvent } from "react";
import { Head } from "vite-react-ssg";
import { motion } from "motion/react";
import { ArrowUpRight, LogOut } from "lucide-react";
import { api, ApiError } from "./api";
import { inputCls } from "./fields";
import { Desk, Notebook, Scribble } from "./theme";
import DocEditor from "./DocEditor";
import WorkEditor from "./WorkEditor";
import Signature from "../components/Signature";
import { LANGS, localePath, type Lang } from "../lib/i18n";
import DecoSticker from "../components/DecoSticker";

const IMG = "/work-clone/framer/images/";

const TABS = [
  { id: "work", label: "Work", preview: "/work", note: "proyectos & side quests" },
  { id: "home", label: "Home", preview: "/", note: "el cuaderno del inicio" },
  { id: "about", label: "About", preview: "/about", note: "quién es josbert" },
  { id: "footer", label: "Footer", preview: "/#connect", note: "checklist & contacto" },
] as const;
type TabId = (typeof TABS)[number]["id"];

export default function AdminApp() {
  // undefined = checking session, null = logged out
  const [user, setUser] = useState<{ email: string } | null | undefined>(undefined);

  useEffect(() => {
    api.get<{ email: string }>("/auth/me").then(setUser, () => setUser(null));
  }, []);

  return (
    <Desk>
      <Head>
        <title>CMS — josbert</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      {user === undefined ? (
        <p className="p-10 font-gochi text-xl text-[#f2e3cf]/50">abriendo el cuaderno…</p>
      ) : user === null ? (
        <Login onLogin={setUser} />
      ) : (
        <Dashboard email={user.email} onLogout={() => setUser(null)} />
      )}
    </Desk>
  );
}

function Login({ onLogin }: { onLogin: (u: { email: string }) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      onLogin(await api.post<{ email: string }>("/auth/login", { email, password }));
    } catch (err) {
      const status = err instanceof ApiError ? err.status : 0;
      setError(
        status === 401 ? "mmm… email o contraseña incorrectos" : status === 429 ? "demasiados intentos, vuelve en 15 min" : (err as Error).message,
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-5 py-16">
      <DecoSticker src={`${IMG}uNzaxXZLk1aHsF3AXi7f4aGR0g.png`} alt="" className="hidden md:block" style={{ top: "14%", left: "12%", width: 96 }} />
      <DecoSticker src={`${IMG}CMfmtNsS4WRTLeJcQt1lujXYM.png`} alt="" className="hidden md:block" style={{ bottom: "14%", left: "9%", width: 190 }} />
      <DecoSticker src={`${IMG}qe4YBLLmBViMAbL2fiphUNfdxA.png`} alt="" className="hidden md:block" style={{ top: "18%", right: "12%", width: 120 }} />
      <DecoSticker src={`${IMG}cqrOEukUtJ5q6innagqIo1y7ig.png`} alt="" className="hidden md:block" style={{ bottom: "10%", right: "11%", width: 140 }} />

      <motion.div
        initial={{ opacity: 0, y: 24, rotate: -2 }}
        animate={{ opacity: 1, y: 0, rotate: -1 }}
        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
        className="w-full max-w-[440px]"
      >
        <Notebook paperClassName="px-8 pb-9 pt-8 md:px-10">
          <Signature width={132} className="-ml-1" />
          <p className="mt-1 font-departure text-[11px] uppercase tracking-[0.14em] text-[#171717]/50">back office · cms</p>
          <h1 className="mt-5 font-awesome text-[40px] leading-[1.02] text-[#e35342]">
            Edita tu <span className="font-gochi text-[1.12em]">cuaderno</span>
          </h1>

          <form onSubmit={submit} className="mt-7 space-y-4">
            <label className="block">
              <span className="mb-1.5 block font-departure text-[11px] uppercase tracking-[0.12em] text-[#171717]/55">Email</span>
              <input className={inputCls} type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <label className="block">
              <span className="mb-1.5 block font-departure text-[11px] uppercase tracking-[0.12em] text-[#171717]/55">Contraseña</span>
              <input
                className={inputCls}
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            {error && <p className="rotate-[-1deg] font-gochi text-[18px] text-[#c0392b]">{error}</p>}
            <div className="flex items-center justify-between pt-2">
              <a href="/" className="font-gochi text-[17px] text-[#171717]/45 hover:text-[#e35342]">
                ← volver al sitio
              </a>
              <button
                disabled={busy}
                className="rounded-[6px] border-2 border-[#e35342] bg-[#e35342] px-7 py-1 font-gochi text-[21px] text-[#f2e3cf] shadow-[0_2px_0_#a8382b] transition-transform hover:-translate-y-px active:translate-y-px disabled:opacity-60"
              >
                {busy ? "entrando…" : "entrar"}
              </button>
            </div>
          </form>
        </Notebook>
      </motion.div>
    </div>
  );
}

function Dashboard({ email, onLogout }: { email: string; onLogout: () => void }) {
  const [tab, setTab] = useState<TabId>(() => {
    const h = typeof window !== "undefined" ? window.location.hash.slice(1) : "";
    return (TABS.find((t) => t.id === h)?.id ?? "work") as TabId;
  });
  const current = TABS.find((t) => t.id === tab)!;
  const [lang, setLang] = useState<Lang>("en");

  const go = (id: TabId) => {
    setTab(id);
    history.replaceState(null, "", `#${id}`);
  };
  const logout = async () => {
    await api.post("/auth/logout").catch(() => {});
    onLogout();
  };

  return (
    <div className="mx-auto max-w-[980px] px-5 pb-24">
      <header className="flex flex-wrap items-center gap-x-10 gap-y-4 pb-10 pt-10">
        <a href="/" title="Ir al sitio" className="flex items-end gap-2">
          <Signature width={118} />
          <span className="mb-1 font-departure text-[11px] uppercase tracking-[0.14em] text-[#f2e3cf]/45">cms</span>
        </a>
        <nav className="flex gap-9">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => go(t.id)}
              className={`relative font-gochi text-[21px] transition-colors ${tab === t.id ? "text-[#f2e3cf]" : "text-[#f2e3cf]/55 hover:text-[#e35342]"}`}
            >
              {tab === t.id && <Scribble className="text-[#e35342]" />}
              <span className="relative">{t.label}</span>
            </button>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <a href={localePath(current.preview, lang)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-gochi text-[18px] text-[#f2e3cf]/70 hover:text-[#e35342]">
            ver página <ArrowUpRight className="h-4 w-4" />
          </a>
          <span className="hidden font-departure text-[11px] text-[#f2e3cf]/40 md:inline">{email}</span>
          <button type="button" onClick={logout} title="Cerrar sesión" className="rounded p-1.5 text-[#f2e3cf]/55 hover:bg-[#f2e3cf]/10 hover:text-[#e35342]">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Notebook paperClassName="px-5 pb-6 pt-7 md:px-10">
          <div className="mb-7 flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <h1 className="font-awesome text-[44px] leading-none text-[#e35342]">{current.label}</h1>
            <span className="rotate-[-2deg] font-gochi text-[19px] text-[#171717]/50">{current.note}</span>
            <div role="group" aria-label="Idioma que editas" className="ml-auto flex items-center gap-1 font-gochi text-[20px]">
              {LANGS.map((l, i) => (
                <span key={l} className="flex items-center gap-1">
                  {i > 0 && <span className="text-[#171717]/25">/</span>}
                  <button
                    type="button"
                    onClick={() => setLang(l)}
                    aria-pressed={lang === l}
                    className={`relative px-0.5 ${lang === l ? "text-[#e35342]" : "text-[#171717]/40 hover:text-[#171717]/70"}`}
                  >
                    {lang === l && <Scribble className="text-[#e35342]/60" />}
                    <span className="relative">{l.toUpperCase()}</span>
                  </button>
                </span>
              ))}
            </div>
          </div>
          {tab === "work" ? <WorkEditor key={lang} lang={lang} /> : <DocEditor key={`${tab}-${lang}`} docKey={tab} lang={lang} />}
        </Notebook>
      </motion.div>
    </div>
  );
}
