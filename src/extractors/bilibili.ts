import axios from "axios";
import { Extractor } from "./types";

interface SupportFormat {
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

export default {
  hosts: ["bilibili.com", "www.bilibili.com"],
  extract: async (pathname, no, format) => {
    const avid = /av(\d+)/i.exec(pathname)?.[1] ?? "";
    const bvid = /BV[a-zA-Z\d]+/i.exec(pathname)?.[0] ?? "";
    if (!avid && !bvid) throw Error(`Could not extract video from ${pathname}`);

    const { data: view } = await axios.get(
      `https://api.bilibili.com/x/web-interface/view?aid=${avid}&bvid=${bvid}`
    );
    if (view.code !== 0) throw Error(view.message);
    const { aid } = view.data;
    let { cid } = view.data;
    if (no) cid = view.data.pages[parseInt(no, 10)].cid;

    const { data: durl } = await axios.get(
      `https://api.bilibili.com/x/player/playurl?avid=${aid}&cid=${cid}&qn=${
        typeof format === "number" && Number.isInteger(format) && format < 1000
          ? format
          : ""
      }`
    );
    if (durl.code !== 0) throw Error(durl.message);
    if (typeof format === "number" && Number.isInteger(format) && format < 1000)
      return (durl.data.durl as DURL[]).map(({ url }) => url);

    const { data: dash } = await axios.get(
      `https://api.bilibili.com/x/player/playurl?avid=${aid}&cid=${cid}&fnval=16`
    );
    if (dash.code !== 0) throw Error(dash.message);
    if (format && Number.isInteger(format))
      return (dash.data.dash.audio as DASH[])
        .filter(({ id }) => id === format)
        .map((audio) => audio.base_url);
    if (format)
      return (dash.data.dash.video as DASH[])
        .filter((video) => `${video.id}.${video.codecid}` === format.toString())
        .map((video) => video.base_url);

    return {
      ...(durl.data.support_formats as SupportFormat[]).reduce(
        (p, c) =>
          Object.assign(p, {
            [c.quality]: { format: c.format, description: c.new_description },
          }),
        {}
      ),
      ...(dash.data.dash.video as DASH[]).reduce(
        (p, c) =>
          Object.assign(p, {
            [`${c.id}.${c.codecid}`]: {
              format: c.mime_type,
              description: [c.width, c.height],
              codecs: c.codecs,
            },
          }),
        {}
      ),
      ...(dash.data.dash.audio as DASH[]).reduce(
        (p, c) =>
          Object.assign(p, {
            [c.id]: {
              format: c.mime_type,
              description: [c.width, c.height],
              codecs: c.codecs,
            },
          }),
        {}
      ),
    };
  },
} as Extractor;
