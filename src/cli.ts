#!/usr/bin/env node

import minimist from "minimist";
import { extract } from ".";

const argv = minimist(process.argv.slice(2), {
  boolean: ["help", "version", "debug", "list"],
  alias: { h: "help", v: "version", d: "debug", l: "list", f: "format" },
});

/* eslint-disable no-console */
if (argv.debug) console.log(argv);

if (argv.help) {
  console.log("You are helpless!");
  process.exit(0);
}

if (argv.version) {
  // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
  console.log(require("../package.json").version);
  process.exit(0);
}

if (argv.list) (async () => console.table(await extract(argv._[0], argv.n)))();
if (argv.format)
  (async () => console.log(await extract(argv._[0], argv.n, argv.f)))();
