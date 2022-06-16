export type Extractor = {
  hosts: string[];
  extract: (pathname: string, no?: string, format?: string) => Promise<unknown>;
};
