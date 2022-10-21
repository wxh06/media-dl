import axios from "axios";
import type { Extractor } from "../types";
import getDash from "./dash";
import getDurl from "./durl";
import type { APIResponse, View } from "./types";

async function getVideo({
  pathname,
  searchParams,
}: URL): Promise<[number, number]> {
  // 从 pathname 中提取视频编号
  const avid = /av(\d+)/i.exec(pathname)?.[1] ?? "";
  const bvid = /BV[a-zA-Z\d]+/i.exec(pathname)?.[0] ?? "";
  const p = searchParams.get("p");
  if (!avid && !bvid) throw Error(`Could not extract video from ${pathname}`);

  // 获取视频 cid
  const { data: view } = await axios.get<APIResponse<View>>(
    `https://api.bilibili.com/x/web-interface/view?aid=${avid}&bvid=${bvid}`
  );
  if (view.code !== 0) throw Error(view.message);
  const { aid } = view.data;
  let { cid } = view.data;
  if (p) cid = view.data.pages[parseInt(p, 10)].cid;

  return [aid, cid];
}

export default {
  hosts: ["bilibili.com", "www.bilibili.com"],
  async list(url) {
    const [avid, cid] = await getVideo(url);

    const supportedFormats = await getDurl(avid, cid);
    const dash = await getDash(avid, cid);

    return {
      media: supportedFormats.reduce(
        (p, c) =>
          Object.assign(p, {
            [c.quality]: { format: c.format, description: c.new_description },
          }),
        {}
      ),
      ...dash,
    };
  },

  async extract(videoUrl, formats) {
    const [avid, cid] = await getVideo(videoUrl);
    const dash = await getDash(avid, cid, true);

    return Promise.all(
      formats
        .map((format) => format.toString())
        .map(async (format) => {
          if (format.includes(".")) return [dash.video[format].url];
          if (format.length > 4) return [dash.audio[format].url];
          return getDurl(avid, cid, format);
        })
    );
  },
} as Extractor;
