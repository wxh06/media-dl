export interface APIResponse<T> {
  code: 0 | -400 | -404;
  message: string;
  ttl: 1;
  data: T;
}

export interface View {
  bvid: string;
  aid: number;
  cid: number;
  pages: Page[];
}

interface Page {
  cid: number;
}

interface PlayURL {
  support_formats: SupportFormat[];
}

export interface PlayURLDash extends PlayURL {
  dash: { video: DASH[]; audio: DASH[] };
}

export interface PlayURLDurl extends PlayURL {
  durl: DURL[];
}

export interface SupportFormat {
  quality: number;
  format: string;
  new_description: string;
  display_desc: string;
  superscript: string;
  codecs: null;
}

interface DASH {
  id: number;
  base_url: string;
  backup_url: string[];
  mime_type: string;
  codecs: string;
  width: number;
  height: number;
  codecid: number;
}

interface DURL {
  order: number;
  length: number;
  size: number;
  url: string;
  backup_url: string[];
}
