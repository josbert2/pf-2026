import { useEffect, useState } from "react";
import { api } from "./api";
import { Card, Field, ImageField, SaveBar, SortableList, StringList, TextInput, inputCls } from "./fields";
import { invalidateSiteContent, localDefaults, siteDefaults, type SiteKey } from "../lib/site-content";
import type { Lang } from "../lib/i18n";

// `shared`: same value in every language (images, email, names…), so the
// translation view hides it.
type FieldDef = { shared?: boolean } & (
  | { key: string; label: string; type: "text" | "textarea" | "image" | "list"; hint?: string }
  | { key: string; label: string; type: "pairs"; a: string; b: string }
  | { key: string; label: string; type: "gallery" }
);

export const SCHEMAS: Record<SiteKey, { title: string; groups: Array<{ title: string; fields: FieldDef[] }> }> = {
  home: {
    title: "Home",
    groups: [
      {
        title: "Hero (página superior del cuaderno)",
        fields: [
          { key: "role", label: "Rol", type: "text" },
          { key: "role_sub", label: "Subtítulo manuscrito", type: "text" },
          { key: "headline", label: "Titular", type: "text", hint: "Primera línea, ej. «Software should»" },
          { key: "headline_lead", label: "Titular · 2ª línea", type: "text", hint: "Ej. «feel»" },
          { key: "headline_accent", label: "Titular · palabra destacada", type: "text", hint: "Ej. «honest» (va en letra manuscrita)" },
          { key: "location", label: "Ubicación", type: "text", shared: true },
        ],
      },
      {
        title: "Notas (página inferior)",
        fields: [
          { key: "values_caption", label: "Encabezado", type: "text" },
          { key: "value_1", label: "Nota 1 (papel rayado)", type: "text" },
          { key: "value_2", label: "Nota 2 (cuadriculada)", type: "text" },
          { key: "value_3", label: "Nota 3 (post-it)", type: "text" },
        ],
      },
      {
        title: "Sección «About me» (collage)",
        fields: [
          { key: "about_title", label: "Etiqueta «About me»", type: "text" },
          { key: "about_question", label: "Etiqueta «What's his deal?»", type: "text" },
          { key: "about_quote", label: "Frase manuscrita", type: "text" },
        ],
      },
    ],
  },
  about: {
    title: "About",
    groups: [
      {
        title: "Hoja principal",
        fields: [
          { key: "level", label: "Etiqueta superior", type: "text" },
          { key: "headline", label: "Titular", type: "textarea" },
          { key: "intro", label: "Intro", type: "text" },
          { key: "intro_also", label: "Intro · continuación", type: "text" },
          { key: "also", label: "Lista «but I'm also…»", type: "list" },
          { key: "photo_url", label: "Foto (polaroid)", type: "image", shared: true },
          { key: "photo_caption", label: "Texto de la polaroid", type: "text", shared: true },
        ],
      },
      {
        title: "Tarjetas",
        fields: [
          { key: "gallery", label: "Galería (4 imágenes)", type: "gallery", shared: true },
          { key: "energy_title", label: "Título tarjeta crema", type: "text" },
          { key: "energy", label: "Lista tarjeta crema", type: "list" },
          { key: "soul_title", label: "Título tarjeta roja", type: "text" },
          { key: "soul", label: "Lista tarjeta roja", type: "list" },
          { key: "nerd_title", label: "Título «nerd out»", type: "text" },
          { key: "nerd_subtitle", label: "Subtítulo «nerd out»", type: "text" },
          { key: "nerd", label: "Temas", type: "pairs", a: "Tema", b: "Comentario" },
        ],
      },
    ],
  },
  footer: {
    title: "Footer",
    groups: [
      {
        title: "Footer (home y about)",
        fields: [
          { key: "checklist_title", label: "Título checklist", type: "text" },
          { key: "checklist", label: "Checklist", type: "list" },
          { key: "cta_label", label: "Texto del botón", type: "text" },
          { key: "contact_email", label: "Email de contacto", type: "text", hint: "El botón abre un mailto: a este correo", shared: true },
          { key: "lyric", label: "Letra del marquee", type: "textarea", shared: true },
        ],
      },
    ],
  },
};

type Doc = Record<string, unknown>;

export default function DocEditor({ docKey, lang }: { docKey: SiteKey; lang: Lang }) {
  const schema = SCHEMAS[docKey];
  const [doc, setDoc] = useState<Doc | null>(null);
  // English version, shown as placeholder while translating.
  const [base, setBase] = useState<Doc>({});
  const [saved, setSaved] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    setDoc(null);
    setStatus(null);
    const q = lang === "en" ? "" : `?lang=${lang}`;
    Promise.all([
      api.get<Doc>(`/admin/site/${docKey}${q}`),
      lang === "en" ? Promise.resolve({}) : api.get<Doc>(`/admin/site/${docKey}`),
    ]).then(([remote, en]) => {
      // A translation only holds its own fields; the rest falls back to English.
      const start =
        lang === "en"
          ? { ...(siteDefaults[docKey] as Doc), ...remote }
          : { ...pickTranslated(localDefaults(docKey, lang) as Doc, siteDefaults[docKey] as Doc, docKey), ...remote };
      setBase({ ...(siteDefaults[docKey] as Doc), ...en });
      setDoc(start);
      setSaved(JSON.stringify(start));
    });
  }, [docKey, lang]);

  if (!doc) return <p className="font-gochi text-xl text-[#171717]/45">cargando…</p>;

  const set = (key: string, v: unknown) => {
    setDoc({ ...doc, [key]: v });
    setStatus(null);
  };
  const save = async () => {
    setSaving(true);
    try {
      await api.put(`/admin/site/${docKey}${lang === "en" ? "" : `?lang=${lang}`}`, doc);
      invalidateSiteContent(docKey);
      setSaved(JSON.stringify(doc));
      setStatus("Guardado ✓");
    } catch (e) {
      setStatus(`Error: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      {lang !== "en" && (
        <p className="rotate-[-1deg] font-gochi text-[18px] text-[#171717]/55">
          traduciendo · lo que dejes vacío se muestra en inglés; imágenes y datos compartidos se editan en EN
        </p>
      )}
      {schema.groups.map((g) => (
        <Card key={g.title}>
          <h3 className="mb-4 font-gochi text-[23px] leading-none text-[#e35342]">{g.title}</h3>
          <div className="space-y-4">
            {g.fields
              .filter((f) => lang === "en" || !f.shared)
              .map((f) => (
                <Field key={f.key} label={f.label} hint={"hint" in f ? f.hint : undefined}>
                  {renderField(f, doc[f.key], (v) => set(f.key, v), lang === "en" ? undefined : base[f.key])}
                </Field>
              ))}
          </div>
        </Card>
      ))}
      <div className="sticky bottom-0 z-10 -mx-5 border-t border-dashed border-[#e35342]/40 bg-[#f2e3cf]/95 px-5 py-3 backdrop-blur md:-mx-10 md:px-10">
        <SaveBar dirty={JSON.stringify(doc) !== saved} saving={saving} onSave={save} status={status} />
      </div>
    </div>
  );
}

/** Keep only the translatable fields that the bundled translation actually has. */
function pickTranslated(withTranslation: Doc, english: Doc, key: SiteKey): Doc {
  const keys = SCHEMAS[key].groups.flatMap((g) => g.fields.filter((f) => !f.shared).map((f) => f.key));
  return Object.fromEntries(keys.filter((k) => withTranslation[k] !== english[k]).map((k) => [k, withTranslation[k]]));
}

function renderField(f: FieldDef, value: unknown, set: (v: unknown) => void, english?: unknown) {
  const ph = typeof english === "string" ? english : undefined;
  switch (f.type) {
    case "text":
      return <TextInput value={value as string} onChange={set} placeholder={ph} />;
    case "textarea":
      return <TextInput multiline value={value as string} onChange={set} placeholder={ph} />;
    case "image":
      return <ImageField value={value as string} onChange={set} />;
    case "list":
      return <StringList value={(value as string[]) ?? []} onChange={set} />;
    case "pairs": {
      const items = (value as Array<{ k: string; v: string }>) ?? [];
      return (
        <SortableList
          items={items}
          onChange={set}
          keyOf={(_, i) => i}
          newItem={() => ({ k: "", v: "" })}
          render={(it, put) => (
            <div className="grid grid-cols-[1fr_2fr] gap-2">
              <input className={inputCls} placeholder={f.a} value={it.k} onChange={(e) => put({ ...it, k: e.target.value })} />
              <input className={inputCls} placeholder={f.b} value={it.v} onChange={(e) => put({ ...it, v: e.target.value })} />
            </div>
          )}
        />
      );
    }
    case "gallery": {
      const items = (value as Array<{ src: string; alt: string }>) ?? [];
      return (
        <SortableList
          items={items}
          onChange={set}
          keyOf={(_, i) => i}
          newItem={() => ({ src: "", alt: "" })}
          addLabel="Agregar imagen"
          render={(it, put) => (
            <div className="space-y-1.5">
              <ImageField value={it.src} onChange={(src) => put({ ...it, src })} />
              <input className={inputCls} placeholder="Texto alternativo" value={it.alt} onChange={(e) => put({ ...it, alt: e.target.value })} />
            </div>
          )}
        />
      );
    }
  }
}
