export type Extractor = {
  hosts: string[];
  list: (
    pathname: string,
    searchParams: URLSearchParams,
    no?: string
  ) => Promise<unknown>;
  extract: (
    pathname: string,
    searchParams: URLSearchParams,
    no: string | undefined,
    formats: Array<string | number>
  ) => Promise<unknown>;
};
