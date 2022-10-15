import axios from "axios";
import { Extractor } from "../types";
import type { APIResponse, View, PlayURLDash, PlayURLDurl } from "./types";

async function getVideo(
  pathname: string,
  searchParams: URLSearchParams,
  no?: string
): Promise<[number, number]> {
  // 从 pathname 中提取视频编号
  const avid = /av(\d+)/i.exec(pathname)?.[1] ?? "";
  const bvid = /BV[a-zA-Z\d]+/i.exec(pathname)?.[0] ?? "";
  const p = no ?? searchParams.get("p");
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
  async list(pathname, searchParams, no) {
    const [avid, cid] = await getVideo(pathname, searchParams, no);

    const {
      data: {
        code,
        data: { dash, support_formats: supportedFormats },
        message,
      },
    } = await axios.get<APIResponse<PlayURLDash>>(
      `https://api.bilibili.com/x/player/playurl?avid=${avid}&cid=${cid}&fnval=16`
    );
    if (code !== 0) throw Error(message);

    return {
      ...supportedFormats.reduce(
        (p, c) =>
          Object.assign(p, {
            [c.quality]: { format: c.format, description: c.new_description },
          }),
        {}
      ),
      ...[...dash.video, ...dash.audio].reduce(
        (p, c) =>
          Object.assign(p, {
            [c.codecid ? `${c.id}.${c.codecid}` : c.id]: {
              format: c.mime_type,
              description: [c.width, c.height],
              codecs: c.codecs,
            },
          }),
        {}
      ),
    };
  },

  async extract(pathname, searchParams, no, formats) {
    const [avid, cid] = await getVideo(pathname, searchParams, no);
    return Promise.all(
      formats
        .map((format) => format.toString())
        .map(async (format) => {
          const videoOnly = format.includes(".");
          const dash = videoOnly || format.length > 4;

          if (!dash) {
            const {
              data: {
                code,
                data: { durl },
                message,
              },
            } = await axios.get<APIResponse<PlayURLDurl>>(
              `https://api.bilibili.com/x/player/playurl?avid=${avid}&cid=${cid}&qn=${format}`
            );
            if (code !== 0) throw Error(message);
            return durl.map(({ url }) => url);
          }

          const {
            data: { code, data, message },
          } = await axios.get<APIResponse<PlayURLDash>>(
            `https://api.bilibili.com/x/player/playurl?avid=${avid}&cid=${cid}&fnval=16`
          );
          if (code !== 0) throw Error(message);
          if (videoOnly)
            return data.dash.video
              .filter(
                (video) => `${video.id}.${video.codecid}` === format.toString()
              )
              .map((video) => video.base_url);
          return data.dash.audio
            .filter(({ id }) => id.toString() === format)
            .map((audio) => audio.base_url);
        })
    );
  },
} as Extractor;
