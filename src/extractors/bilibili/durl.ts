import axios from "axios";
import type { SupportFormat, APIResponse, PlayURLDurl } from "./types";

async function getDurl(avid: number, cid: number): Promise<SupportFormat[]>;
async function getDurl(
  avid: number,
  cid: number,
  qn: string
): Promise<string[]>;
async function getDurl(
  avid: number,
  cid: number,
  qn?: string
): Promise<SupportFormat[] | string[]> {
  const {
    data: {
      code,
      data: { durl, support_formats: supportedFormats },
      message,
    },
  } = await axios.get<APIResponse<PlayURLDurl>>(
    `https://api.bilibili.com/x/player/playurl?avid=${avid}&cid=${cid}&qn=${
      qn ?? ""
    }`
  );
  if (code) throw Error(message);
  if (!qn) return supportedFormats;
  return durl.map(({ url }) => url);
}

export default getDurl;
