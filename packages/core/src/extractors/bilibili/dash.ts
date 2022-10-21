import axios from "axios";
import type { APIResponse, PlayURLDash } from "./types";

export default async function getDash(avid: number, cid: number, url = false) {
  const {
    data: {
      code,
      data: { dash, support_formats: supportedFormats },
      message,
    },
  } = await axios.get<APIResponse<PlayURLDash>>(
    `https://api.bilibili.com/x/player/playurl?avid=${avid}&cid=${cid}&fnval=4048`
  );
  if (code) throw Error(message);

  return {
    video: Object.fromEntries(
      dash.video.map((v) => [
        `${v.id}.${v.codecid}`,
        {
          format: v.mime_type,
          codecs: v.codecs,
          description: supportedFormats.find((f) => f.quality === v.id)
            ?.new_description,
          resolution: [v.width, v.height],
          ...(url ? { url: v.base_url } : {}),
        },
      ])
    ),
    audio: Object.fromEntries(
      dash.audio.map((a) => [
        a.id,
        {
          format: a.mime_type,
          codecs: a.codecs,
          description: {
            30216: "64K",
            30232: "132K",
            30280: "192K",
            30250: "杜比全景声",
            30251: "Hi-Res无损",
          }[a.id],
          ...(url ? { url: a.base_url } : {}),
        },
      ])
    ),
  };
}
