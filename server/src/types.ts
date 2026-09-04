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
}

export interface SideQuest {
  id: string;
  name: string;
  role?: string | null;
  description?: string | null;
  url?: string | null;
  year?: string | null;
}

export interface Content {
  title: string;
  labels: { notable_work: string; side_quests: string };
  projects: Project[];
  side_quests: SideQuest[];
}
