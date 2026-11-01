export interface Project {
  id: string;
  name: string;
  url?: string | null;
  tagline?: string | null;
  tagline_l1?: string | null;
  tagline_l2?: string | null;
  tagline_l3?: string | null;
  lesson?: string | null;
  notable_work?: string[];
  highlight?: string | null;
  year?: string | null;
  image_url?: string | null;
  i18n?: Record<string, Partial<Omit<Project, "i18n">>>;
}

export interface SideQuest {
  id: string;
  name: string;
  tag?: string | null;
  repo_url?: string | null;
  role?: string | null;
  description?: string | null;
  url?: string | null;
  year?: string | null;
  image_url?: string | null;
  i18n?: Record<string, Partial<Omit<SideQuest, "i18n">>>;
}

export interface Content {
  title: string;
  labels: { notable_work: string; side_quests: string };
  projects: Project[];
  side_quests: SideQuest[];
  /** Translated page title/labels, e.g. { es: { title, labels } } */
  i18n?: Record<string, { title?: string; labels?: Partial<Content["labels"]> }>;
}
