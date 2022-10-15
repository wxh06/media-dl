// import downloaders from "./downloaders";
import extractors from "./extractors";

// eslint-disable-next-line import/prefer-default-export
export const extract = (
  identifier: string,
  no: string | undefined,
  format?: string[]
) => {
  const { hostname, pathname, searchParams } = new URL(identifier);
  const extractor = extractors.find(({ hosts }) => hosts.includes(hostname));
  return (
    (format
      ? extractor?.extract(pathname, searchParams, no, format)
      : extractor?.list(pathname, searchParams, no)) ??
    Promise.reject(new Error("Unknown host"))
  );
};
