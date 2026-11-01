import { useEffect, useRef, useState } from "react";
import { ChevronDown, GripVertical, Plus, Trash2 } from "lucide-react";
import { api, type AdminProject, type AdminSideQuest, type Translations } from "./api";
import { Card, Field, ImageField, SaveBar, StatusNote, StringList, TextInput } from "./fields";
import { PaperHeading } from "./theme";
import type { Content } from "../lib/content";
import type { Lang } from "../lib/i18n";

// How many entries the /work layout actually renders (it's a fixed Framer
// composition bound by position). Extra rows are stored but not shown.
const VISIBLE = { projects: 4, side_quests: 5 };

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// Translation helpers: read/write item.i18n[lang][field].
type Translatable = { i18n: Translations | null };
const trGet = (item: Translatable, lang: Lang, f: string) => item.i18n?.[lang]?.[f];
const trPatch = <T extends Translatable>(item: T, lang: Lang, f: string, v: unknown) =>
  ({ i18n: { ...(item.i18n ?? {}), [lang]: { ...(item.i18n?.[lang] ?? {}), [f]: v } } }) as Partial<T>;

/** Text field for a translation, with the English value as placeholder. */
function TrInput<T extends Translatable>({
  item,
  lang,
  field,
  english,
  set,
  multiline,
}: {
  item: T;
  lang: Lang;
  field: string;
  english: string | null;
  set: (patch: Partial<T>) => void;
  multiline?: boolean;
}) {
  return (
    <TextInput
      multiline={multiline}
      value={(trGet(item, lang, field) as string) ?? ""}
      placeholder={english ?? ""}
      onChange={(v) => set(trPatch(item, lang, field, v))}
    />
  );
}

export default function WorkEditor({ lang }: { lang: Lang }) {
  if (lang !== "en") return <WorkTranslations lang={lang} />;
  return (
    <div className="space-y-10">
      <MetaEditor lang="en" />
      <Collection<AdminProject>
        title="Proyectos"
        endpoint="/admin/projects"
        visible={VISIBLE.projects}
        blank={() => ({
          id: 0, slug: "", name: "", url: null, image_url: null, year: null, tagline: null,
          tagline_l1: null, tagline_l2: null, tagline_l3: null, lesson: null, highlight: null, notable_work: [], i18n: null,
        })}
        renderForm={(p, set) => (
          <>
            <Common item={p} set={set} />
            <Field label="Tagline" hint="Bash/Pulse usan una línea; Heygo y Dotslash la reparten en l1–l3">
              <TextInput multiline value={p.tagline} onChange={(v) => set({ tagline: v })} />
            </Field>
            <div className="grid gap-3 md:grid-cols-3">
              <Field label="Tagline l1"><TextInput value={p.tagline_l1} onChange={(v) => set({ tagline_l1: v })} /></Field>
              <Field label="Tagline l2"><TextInput value={p.tagline_l2} onChange={(v) => set({ tagline_l2: v })} /></Field>
              <Field label="Tagline l3"><TextInput value={p.tagline_l3} onChange={(v) => set({ tagline_l3: v })} /></Field>
            </div>
            <Field label="Lo que aprendí"><TextInput multiline value={p.lesson} onChange={(v) => set({ lesson: v })} /></Field>
            <Field label="Highlight (tarjeta al pasar el mouse)"><TextInput multiline value={p.highlight} onChange={(v) => set({ highlight: v })} /></Field>
            <Field label="Notable work"><StringList value={p.notable_work} onChange={(v) => set({ notable_work: v })} /></Field>
            <Field label="Imagen de la tarjeta hover"><ImageField value={p.image_url} onChange={(v) => set({ image_url: v })} /></Field>
          </>
        )}
      />
      <Collection<AdminSideQuest>
        title="Side quests"
        endpoint="/admin/side-quests"
        visible={VISIBLE.side_quests}
        blank={() => ({ id: 0, slug: "", name: "", tag: null, repo_url: null, role: null, description: null, url: null, image_url: null, year: null, i18n: null })}
        renderForm={(q, set) => (
          <>
            <Common item={q} set={set} />
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Etiqueta (roja, chica)" hint="ej. creator, Founding Product Designer"><TextInput value={q.tag} onChange={(v) => set({ tag: v })} /></Field>
              <Field label="Rol"><TextInput value={q.role} onChange={(v) => set({ role: v })} /></Field>
            </div>
            <Field label="Descripción"><TextInput multiline value={q.description} onChange={(v) => set({ description: v })} /></Field>
            <Field label="GitHub" hint="Solo si el repo es público; si no, los visitantes ven un 404"><TextInput value={q.repo_url} placeholder="https://github.com/…" onChange={(v) => set({ repo_url: v })} /></Field>
            <Field label="Imagen"><ImageField value={q.image_url} onChange={(v) => set({ image_url: v })} /></Field>
          </>
        )}
      />
    </div>
  );
}

/**
 * Translation view: same items, only the text fields, English as placeholder.
 * Slugs, links, images and order are shared and edited in EN.
 */
function WorkTranslations({ lang }: { lang: Lang }) {
  return (
    <div className="space-y-10">
      <p className="rotate-[-1deg] font-gochi text-[18px] text-[#171717]/55">
        traduciendo · lo que dejes vacío se muestra en inglés; links, imágenes y orden se editan en EN
      </p>
      <MetaEditor lang={lang} />
      <Collection<AdminProject>
        title="Proyectos"
        endpoint="/admin/projects"
        visible={VISIBLE.projects}
        readOnlyList
        renderForm={(p, set) => (
          <>
            <Field label="Tagline">
              <TrInput item={p} lang={lang} field="tagline" english={p.tagline} set={set} multiline />
            </Field>
            <div className="grid gap-3 md:grid-cols-3">
              <Field label="Tagline l1"><TrInput item={p} lang={lang} field="tagline_l1" english={p.tagline_l1} set={set} /></Field>
              <Field label="Tagline l2"><TrInput item={p} lang={lang} field="tagline_l2" english={p.tagline_l2} set={set} /></Field>
              <Field label="Tagline l3"><TrInput item={p} lang={lang} field="tagline_l3" english={p.tagline_l3} set={set} /></Field>
            </div>
            <Field label="Lo que aprendí"><TrInput item={p} lang={lang} field="lesson" english={p.lesson} set={set} multiline /></Field>
            <Field label="Highlight"><TrInput item={p} lang={lang} field="highlight" english={p.highlight} set={set} multiline /></Field>
            <Field label="Notable work" hint={p.notable_work.length ? `EN: ${p.notable_work.join(" · ")}` : undefined}>
              <StringList
                value={(trGet(p, lang, "notable_work") as string[] | undefined) ?? []}
                onChange={(v) => set(trPatch(p, lang, "notable_work", v))}
              />
            </Field>
          </>
        )}
      />
      <Collection<AdminSideQuest>
        title="Side quests"
        endpoint="/admin/side-quests"
        visible={VISIBLE.side_quests}
        readOnlyList
        renderForm={(q, set) => (
          <>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Etiqueta (roja, chica)"><TrInput item={q} lang={lang} field="tag" english={q.tag} set={set} /></Field>
              <Field label="Rol"><TrInput item={q} lang={lang} field="role" english={q.role} set={set} /></Field>
            </div>
            <Field label="Descripción"><TrInput item={q} lang={lang} field="description" english={q.description} set={set} multiline /></Field>
          </>
        )}
      />
    </div>
  );
}

function Common<T extends { name: string; slug: string; url: string | null; year: string | null; id: number }>({
  item,
  set,
}: {
  item: T;
  set: (patch: Partial<T>) => void;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Field label="Nombre">
        <TextInput
          value={item.name}
          onChange={(v) => set({ name: v, ...(item.id === 0 ? { slug: slugify(v) } : {}) } as Partial<T>)}
        />
      </Field>
      <Field label="Slug" hint="minúsculas, números y guiones">
        <TextInput value={item.slug} onChange={(v) => set({ slug: v } as Partial<T>)} />
      </Field>
      <Field label="Web (URL)"><TextInput value={item.url} placeholder="https://…" onChange={(v) => set({ url: v } as Partial<T>)} /></Field>
      <Field label="Año"><TextInput value={item.year} onChange={(v) => set({ year: v } as Partial<T>)} /></Field>
    </div>
  );
}

type Meta = { title: string; label_notable_work: string; label_side_quests: string };

function MetaEditor({ lang }: { lang: Lang }) {
  const [meta, setMeta] = useState<Meta | null>(null);
  const [english, setEnglish] = useState<Meta | null>(null);
  const [saved, setSaved] = useState("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    api.get<Content>("/content").then((c) => {
      const en = { title: c.title, label_notable_work: c.labels.notable_work, label_side_quests: c.labels.side_quests };
      const t = c.i18n?.[lang];
      const m =
        lang === "en"
          ? en
          : { title: t?.title ?? "", label_notable_work: t?.labels?.notable_work ?? "", label_side_quests: t?.labels?.side_quests ?? "" };
      setEnglish(en);
      setMeta(m);
      setSaved(JSON.stringify(m));
    });
  }, [lang]);
  if (!meta || !english) return null;
  const ph = (k: keyof Meta) => (lang === "en" ? undefined : english[k]);

  const save = async () => {
    setSaving(true);
    try {
      await api.put(`/admin/meta${lang === "en" ? "" : `?lang=${lang}`}`, meta);
      setSaved(JSON.stringify(meta));
      setStatus("Guardado ✓");
    } catch (e) {
      setStatus(`Error: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <h3 className="mb-4 font-gochi text-[23px] leading-none text-[#e35342]">Textos de la página</h3>
      <div className="grid gap-3 md:grid-cols-3">
        <Field label="Título"><TextInput value={meta.title} placeholder={ph("title")} onChange={(v) => setMeta({ ...meta, title: v })} /></Field>
        <Field label="Etiqueta «Notable work»"><TextInput value={meta.label_notable_work} placeholder={ph("label_notable_work")} onChange={(v) => setMeta({ ...meta, label_notable_work: v })} /></Field>
        <Field label="Etiqueta «Side Quests»"><TextInput value={meta.label_side_quests} placeholder={ph("label_side_quests")} onChange={(v) => setMeta({ ...meta, label_side_quests: v })} /></Field>
      </div>
      <div className="mt-4">
        <SaveBar dirty={JSON.stringify(meta) !== saved} saving={saving} onSave={save} status={status} />
      </div>
    </Card>
  );
}

function Collection<T extends { id: number; name: string; slug: string }>({
  title,
  endpoint,
  visible,
  blank,
  readOnlyList,
  renderForm,
}: {
  title: string;
  endpoint: string;
  visible: number;
  /** Translation view: no new/delete/reorder, those are shared with EN. */
  blank?: () => T;
  readOnlyList?: boolean;
  renderForm: (item: T, set: (patch: Partial<T>) => void) => React.ReactNode;
}) {
  const [items, setItems] = useState<T[] | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const [draft, setDraft] = useState<T | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const dragFrom = useRef<number | null>(null);

  const reload = () => api.get<T[]>(endpoint).then(setItems);
  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  const reorder = async (from: number, to: number) => {
    if (!items || from === to) return;
    const next = [...items];
    const [x] = next.splice(from, 1);
    next.splice(to, 0, x);
    setItems(next);
    try {
      await api.put(`${endpoint}/order`, { ids: next.map((i) => i.id) });
      setStatus("Orden guardado ✓");
    } catch (e) {
      setStatus(`Error: ${(e as Error).message}`);
      reload();
    }
  };

  const remove = async (item: T) => {
    if (!confirm(`¿Borrar «${item.name}»? No se puede deshacer.`)) return;
    await api.del(`${endpoint}/${item.id}`);
    setOpen(null);
    reload();
  };

  if (!items) return <p className="font-gochi text-xl text-[#171717]/45">cargando {title.toLowerCase()}…</p>;

  return (
    <section>
      <PaperHeading
        aside={
          <div className="flex items-center gap-3">
            <StatusNote status={status} />
            {blank && !readOnlyList && <button
              type="button"
              onClick={() => {
                setDraft(blank!());
                setOpen(-1);
              }}
              className="inline-flex items-center gap-1 rounded-[6px] border-2 border-[#e35342] px-3 py-0.5 font-gochi text-[18px] text-[#e35342] transition-colors hover:bg-[#e35342] hover:text-[#f2e3cf]"
            >
              <Plus className="h-4 w-4" /> nuevo
            </button>}
          </div>
        }
      >
        {title}
      </PaperHeading>
      <p className="-mt-3 mb-3 font-gochi text-[17px] text-[#171717]/50">
        {readOnlyList ? "abre uno para traducirlo" : "arrastra para reordenar"} · /work muestra los primeros {visible} en este orden
      </p>

      <div>
        {open === -1 && draft && (
          <ItemForm
            item={draft}
            endpoint={endpoint}
            renderForm={renderForm}
            onDone={() => {
              setOpen(null);
              setDraft(null);
              reload();
            }}
          />
        )}
        {items.map((item, i) => (
          <div
            key={item.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => !readOnlyList && dragFrom.current !== null && reorder(dragFrom.current, i)}
          >
            <div
              draggable={!readOnlyList}
              onDragStart={() => (dragFrom.current = i)}
              className={`flex items-center gap-2 border-b border-dashed border-[#e35342]/45 px-1 py-2.5 transition-colors hover:bg-[#e35342]/[0.05] ${i < visible ? "" : "opacity-50"}`}
            >
              {!readOnlyList && <GripVertical className="h-4 w-4 cursor-grab text-[#171717]/30" />}
              <span className="w-7 font-departure text-[11px] tabular-nums text-[#171717]/40">{String(i + 1).padStart(2, "0")}</span>
              <button type="button" className="flex flex-1 items-center gap-2 text-left" onClick={() => setOpen(open === item.id ? null : item.id)}>
                <span className="font-awesome text-[22px] leading-none text-[#171717]">{item.name}</span>
                <span className="font-departure text-[11px] text-[#171717]/40">{item.slug}</span>
                {i >= visible && <span className="rotate-[-3deg] font-gochi text-[16px] text-[#e35342]">no visible</span>}
                <ChevronDown className={`ml-auto h-4 w-4 text-[#171717]/40 transition-transform ${open === item.id ? "rotate-180" : ""}`} />
              </button>
              {!readOnlyList && <button type="button" title="Borrar" onClick={() => remove(item)} className="rounded p-1 text-[#171717]/35 hover:bg-[#e35342]/10 hover:text-[#e35342]">
                <Trash2 className="h-4 w-4" />
              </button>}
            </div>
            {open === item.id && (
              <div className="my-3">
                <ItemForm item={item} endpoint={endpoint} renderForm={renderForm} onDone={reload} />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function ItemForm<T extends { id: number }>({
  item,
  endpoint,
  renderForm,
  onDone,
}: {
  item: T;
  endpoint: string;
  renderForm: (item: T, set: (patch: Partial<T>) => void) => React.ReactNode;
  onDone: () => void;
}) {
  const [form, setForm] = useState<T>(item);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const isNew = item.id === 0;

  const save = async () => {
    setSaving(true);
    setStatus(null);
    try {
      if (isNew) await api.post(endpoint, form);
      else await api.put(`${endpoint}/${item.id}`, form);
      setStatus("Guardado ✓");
      onDone();
    } catch (e) {
      setStatus(`Error: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="space-y-4">
      {renderForm(form, (patch) => setForm({ ...form, ...patch }))}
      <SaveBar dirty={isNew || JSON.stringify(form) !== JSON.stringify(item)} saving={saving} onSave={save} status={status} />
    </Card>
  );
}
