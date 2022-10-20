#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { extract, list } from "@media-dl/core";

yargs(hideBin(process.argv))
  .alias("h", "help")
  .alias("v", "version")
  // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
  .version((require("../package.json") as { version: string }).version)
  .command(
    "list <url>",
    "",
    // eslint-disable-next-line @typescript-eslint/no-shadow
    (yargs) => yargs.positional("url", { type: "string" }),
    (argv) => {
      list(new URL(argv.url!)).then(console.table).catch(console.error);
    }
  )
  .command(
    "extract <url>",
    "",
    // eslint-disable-next-line @typescript-eslint/no-shadow
    (yargs) =>
      yargs
        .positional("url", { type: "string" })
        .option("formats", { alias: "f", type: "array" })
        .demandOption("formats"),
    (argv) => {
      extract(new URL(argv.url!), argv.formats!)
        .then(console.log)
        .catch(console.error);
    }
  )
  .parseSync();
