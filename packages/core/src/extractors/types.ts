export type Extractor = {
  hosts: string[];
  list: (url: URL) => Promise<{
    media?: Record<string, unknown>;
    audio?: Record<string, unknown>;
    video?: Record<string, unknown>;
  }>;
  extract: (url: URL, formats: Array<string | number>) => Promise<string[][]>;
};
