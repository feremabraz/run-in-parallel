#!/usr/bin/env node

import { cliui } from "@poppinss/cliui";
import prompts from "prompts";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

export function buildCli(argv: string[], ui: ReturnType<typeof cliui>) {
  return yargs(argv)
    .command(
      "hello <name>",
      "Say hello to someone (argument mode)",
      (yargs) => {
        return yargs.positional("name", {
          describe: "The name to say hello to",
          type: "string",
        });
      },
      (argv) => {
        if (argv.name) {
          ui.logger.success(`Hello, ${argv.name}!`);
        }
      },
    )
    .command(
      "interactive-hello",
      "Say hello to someone (interactive mode)",
      {},
      async () => {
        const response = await prompts({
          type: "text",
          name: "name",
          message: "What is your name?",
        });

        if (response.name) {
          ui.logger.success(`Hello, ${response.name}!`);
        }
      },
    )
    .demandCommand(1, "You need to provide a command.")
    .help();
}

// Allow the CLI to be run as a script or to be imported as a module (i.e. for testing)
if (
  import.meta.url.startsWith("file://") &&
  process.argv[1] === new URL(import.meta.url).pathname
) {
  buildCli(hideBin(process.argv), cliui()).parse();
}
