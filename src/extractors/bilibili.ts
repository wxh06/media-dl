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
    const { data: playURL } = await axios.get(
      `https://api.bilibili.com/x/player/playurl?avid=${aid}&cid=${cid}&qn=${
        format ?? ""
      }`
    );
    if (playURL.code !== 0) throw Error(playURL.message);
    if (format) return playURL.data.durl;
    return (playURL.data.support_formats as SupportFormat[]).reduce(
      (p, c) =>
        Object.assign(p, {
          [c.quality]: { name: c.format, description: c.new_description },
        }),
      {}
    );
  },
} as Extractor;
