// import downloaders from "./downloaders";
import extractors from "./extractors";

// eslint-disable-next-line import/prefer-default-export
export const extract = (identifier: string, no?: string, format?: string) => {
  const { hostname, pathname } = new URL(identifier);
  return extractors
    .find(({ hosts }) => hosts.includes(hostname))
    ?.extract(pathname, no, format);
};
