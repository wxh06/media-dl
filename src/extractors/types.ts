export type Extractor = {
  hosts: string[];
  list: (url: URL) => Promise<Record<string, Record<string, unknown>>>;
  extract: (url: URL, formats: Array<string | number>) => Promise<string[][]>;
};
