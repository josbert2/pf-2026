import { useRef, useState, type ReactNode } from "react";
import { GripVertical, ImagePlus, Plus, Trash2, X } from "lucide-react";
import { api } from "./api";

// Shared form controls for the admin panel.

export const inputCls =
  "w-full rounded-[6px] border border-[#171717]/15 bg-[#fffaf2]/80 px-3 py-2 font-mono text-[13px] text-[#171717] placeholder:text-[#171717]/30 focus:border-[#e35342] focus:bg-[#fffaf2] focus:outline-none focus:ring-2 focus:ring-[#e35342]/15";

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-departure text-[11px] uppercase tracking-[0.12em] text-[#171717]/55">{label}</span>
      {children}
      {hint && <span className="mt-1 block font-gochi text-[15px] leading-tight text-[#e35342]/80">{hint}</span>}
    </label>
  );
}

export function TextInput({
  value,
  onChange,
  multiline,
  placeholder,
}: {
  value: string | null | undefined;
  onChange: (v: string) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  return multiline ? (
    <textarea
      className={`${inputCls} min-h-[84px] resize-y`}
      value={value ?? ""}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  ) : (
    <input className={inputCls} value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
  );
}

/** Ordered list of strings with add / remove / drag-to-reorder. */
export function StringList({ value, onChange, placeholder }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  return (
    <SortableList
      items={value}
      onChange={onChange}
      keyOf={(_, i) => i}
      newItem={() => ""}
      render={(item, set) => <TextInput value={item} onChange={set} placeholder={placeholder} />}
    />
  );
}

/** Generic sortable list used by StringList and the object lists (gallery, nerd…). */
export function SortableList<T>({
  items,
  onChange,
  render,
  newItem,
  keyOf,
  addLabel = "Agregar",
}: {
  items: T[];
  onChange: (v: T[]) => void;
  render: (item: T, set: (v: T) => void) => ReactNode;
  newItem: () => T;
  keyOf: (item: T, i: number) => string | number;
  addLabel?: string;
}) {
  const dragFrom = useRef<number | null>(null);
  const move = (from: number, to: number) => {
    if (from === to) return;
    const next = [...items];
    const [x] = next.splice(from, 1);
    next.splice(to, 0, x);
    onChange(next);
  };
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div
          key={keyOf(item, i)}
          className="flex items-start gap-2"
          draggable
          onDragStart={() => (dragFrom.current = i)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => dragFrom.current !== null && move(dragFrom.current, i)}
        >
          <GripVertical className="mt-2.5 h-4 w-4 shrink-0 cursor-grab text-[#171717]/30" />
          <div className="flex-1">{render(item, (v) => onChange(items.map((x, j) => (j === i ? v : x))))}</div>
          <button
            type="button"
            title="Quitar"
            className="mt-1.5 rounded p-1 text-[#171717]/35 hover:bg-[#e35342]/10 hover:text-[#e35342]"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded-md px-2 py-1 font-gochi text-[17px] text-[#e35342] hover:bg-[#e35342]/10"
        onClick={() => onChange([...items, newItem()])}
      >
        <Plus className="h-3.5 w-3.5" /> {addLabel}
      </button>
    </div>
  );
}

/** URL field with preview and an upload button (stores to /api/admin/uploads). */
export function ImageField({ value, onChange }: { value: string | null | undefined; onChange: (v: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const file = useRef<HTMLInputElement>(null);

  const upload = async (f: File) => {
    setBusy(true);
    setError(null);
    try {
      onChange(await api.upload(f));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
      if (file.current) file.current.value = "";
    }
  };

  return (
    <div className="flex items-start gap-3">
      <div className="flex h-16 w-24 shrink-0 rotate-[-2deg] items-center justify-center overflow-hidden rounded-[6px] border-[3px] border-white bg-[#fffaf2] shadow-[0_2px_6px_rgba(0,0,0,0.2)]">
        {value ? <img src={value} alt="" className="h-full w-full object-cover" /> : <ImagePlus className="h-5 w-5 text-[#171717]/25" />}
      </div>
      <div className="flex-1 space-y-1.5">
        <input className={inputCls} value={value ?? ""} placeholder="/ruta/imagen.png o https://…" onChange={(e) => onChange(e.target.value)} />
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => file.current?.click()}
            className="rounded-[6px] border-2 border-[#e35342] px-3 py-0.5 font-gochi text-[17px] text-[#e35342] transition-colors hover:bg-[#e35342] hover:text-[#f2e3cf] disabled:opacity-50"
          >
            {busy ? "Subiendo…" : "Subir imagen"}
          </button>
          {value && (
            <button type="button" className="font-gochi text-[16px] text-[#171717]/45 hover:text-[#e35342]" onClick={() => onChange("")}>
              <Trash2 className="inline h-3.5 w-3.5" /> quitar
            </button>
          )}
          {error && <span className="font-gochi text-[16px] text-[#c0392b]">{error}</span>}
        </div>
        <input
          ref={file}
          type="file"
          accept="image/png,image/jpeg,image/gif,image/webp,image/avif"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
        />
      </div>
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-[14px] border border-dashed border-[#e35342]/40 bg-[#fffaf2]/55 p-5 ${className}`}>{children}</div>;
}

export function SaveBar({ dirty, saving, onSave, status }: { dirty: boolean; saving: boolean; onSave: () => void; status?: string | null }) {
  return (
    <div className="flex items-center justify-end gap-3">
      <StatusNote status={status} />
      <button
        type="button"
        disabled={!dirty || saving}
        onClick={onSave}
        className="rounded-[6px] border-2 border-[#e35342] bg-[#e35342] px-6 py-1 font-gochi text-[20px] text-[#f2e3cf] shadow-[0_2px_0_#a8382b] transition-transform hover:-translate-y-px active:translate-y-px disabled:cursor-not-allowed disabled:border-[#171717]/20 disabled:bg-transparent disabled:text-[#171717]/35 disabled:shadow-none"
      >
        {saving ? "guardando…" : dirty ? "Guardar" : "Guardado"}
      </button>
    </div>
  );
}

/** Handwritten save feedback: green tick for ok, red for errors. */
export function StatusNote({ status }: { status?: string | null }) {
  if (!status) return null;
  const error = status.startsWith("Error");
  return (
    <span className={`font-gochi text-[18px] ${error ? "text-[#c0392b]" : "text-[#2f7d4f]"} rotate-[-2deg]`}>{status}</span>
  );
}
