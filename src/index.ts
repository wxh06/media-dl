// import downloaders from "./downloaders";
import extractors from "./extractors";

const getExtractor = ({ hostname }: URL) =>
  extractors.find(({ hosts }) => hosts.includes(hostname));

export const list = (url: URL) =>
  getExtractor(url)?.list(url) ?? Promise.reject(new Error("Unknown host"));

export const extract = (url: URL, formats: Array<string | number>) =>
  getExtractor(url)?.extract(url, formats) ??
  Promise.reject(new Error("Unknown host"));
