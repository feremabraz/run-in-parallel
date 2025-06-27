#!/usr/bin/env node

import { spawn } from "node:child_process";
import { cliui } from "@poppinss/cliui";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const version = "1.0.3";

interface RunCommandsOptions {
  killOthers: boolean;
  prefixColors: string[];
  timestamps: boolean;
  ui: ReturnType<typeof cliui>;
}

interface ProcessInfo {
  process: ReturnType<typeof spawn>;
  name: string;
  index: number;
}

function parseCommand(commandString: string): {
  command: string;
  args: string[];
} {
  const trimmed = commandString.trim();

  if (process.platform === "win32") {
    return { command: "cmd", args: ["/c", trimmed] };
  }
  return { command: "sh", args: ["-c", trimmed] };
}

function formatTimestamp(): string {
  return new Date().toLocaleTimeString("en-US", { hour12: false });
}

async function runCommands(
  commands: string[],
  options: RunCommandsOptions,
): Promise<void> {
  const { killOthers, prefixColors, timestamps, ui } = options;
  const processes: ProcessInfo[] = [];
  let _completedCount = 0;
  let hasError = false;

  const cleanup = () => {
    processes.forEach(({ process: proc }) => {
      if (!proc.killed) {
        proc.kill();
      }
    });
  };

  const logWithTimestamp = (
    logFn: (
      message: string,
      options?: { prefix?: string; suffix?: string },
    ) => void,
    message: string,
    color: string,
    cmdPrefix: string,
  ) => {
    const timestampPrefix = timestamps ? `${formatTimestamp()} ` : "";
    logFn(`${timestampPrefix}${message}`, {
      prefix: ui.colors[color as keyof typeof ui.colors](cmdPrefix),
    });
  };

  process.on("SIGINT", () => {
    if (timestamps) {
      ui.logger.info(`${formatTimestamp()} Terminating all processes...`);
    } else {
      ui.logger.info("Terminating all processes...");
    }
    cleanup();
    process.exit(0);
  });

  const promises = commands.map((commandString, index) => {
    return new Promise<void>((resolve, reject) => {
      const { command, args } = parseCommand(commandString);
      const colorIndex = index % prefixColors.length;
      const color = prefixColors[colorIndex];
      const prefix = `CMD${index + 1}`;

      logWithTimestamp(
        ui.logger.info.bind(ui.logger),
        `Starting: ${commandString}`,
        color,
        prefix,
      );

      const proc = spawn(command, args, {
        stdio: ["inherit", "pipe", "pipe"],
      });

      const processInfo: ProcessInfo = {
        process: proc,
        name: commandString,
        index,
      };
      processes.push(processInfo);

      proc.stdout?.on("data", (data) => {
        const lines = data
          .toString()
          .split("\n")
          .filter((line: string) => line.trim());
        lines.forEach((line: string) => {
          logWithTimestamp(ui.logger.info.bind(ui.logger), line, color, prefix);
        });
      });

      proc.stderr?.on("data", (data) => {
        const lines = data
          .toString()
          .split("\n")
          .filter((line: string) => line.trim());
        lines.forEach((line: string) => {
          logWithTimestamp(
            ui.logger.error.bind(ui.logger),
            line,
            color,
            prefix,
          );
        });
      });

      proc.on("close", (code) => {
        _completedCount++;

        if (code === 0) {
          logWithTimestamp(
            ui.logger.success.bind(ui.logger),
            `Completed: ${commandString}`,
            color,
            prefix,
          );
          resolve();
        } else {
          hasError = true;
          logWithTimestamp(
            ui.logger.error.bind(ui.logger),
            `Failed (${code}): ${commandString}`,
            color,
            prefix,
          );

          if (killOthers) {
            if (timestamps) {
              ui.logger.warning(
                `${formatTimestamp()} A process failed, terminating others...`,
              );
            } else {
              ui.logger.warning("A process failed, terminating others...");
            }
            cleanup();
          }

          reject(new Error(`Command failed with code ${code}`));
        }
      });

      proc.on("error", (error) => {
        hasError = true;
        logWithTimestamp(
          ui.logger.error.bind(ui.logger),
          `Error starting command: ${error.message}`,
          color,
          prefix,
        );

        if (killOthers) {
          cleanup();
        }

        reject(error);
      });
    });
  });

  try {
    await Promise.all(promises);
    if (timestamps) {
      ui.logger.success(
        `${formatTimestamp()} All commands completed successfully`,
      );
    } else {
      ui.logger.success("All commands completed successfully");
    }
  } catch (_error) {
    if (hasError) {
      process.exit(1);
    }
  }
}

export function buildCli(argv: string[], ui: ReturnType<typeof cliui>) {
  return yargs(argv)
    .version(version)
    .alias("version", "V")
    .command(
      "$0 [commands..]",
      "Run multiple commands concurrently",
      (yargs) => {
        return yargs
          .positional("commands", {
            describe: "Commands to run concurrently",
            type: "string",
            array: true,
          })
          .option("kill-others", {
            alias: "k",
            type: "boolean",
            default: true,
            describe: "Kill other processes when one fails",
          })
          .option("prefix-colors", {
            alias: "c",
            type: "array",
            default: ["red", "green", "blue", "yellow", "magenta", "cyan"],
            describe: "Colors for command prefixes",
          })
          .option("timestamps", {
            alias: "t",
            type: "boolean",
            default: false,
            describe: "Add timestamps to output",
          });
      },
      async (argv) => {
        if (!argv.commands || argv.commands.length === 0) {
          ui.logger.error("No commands provided");
          process.exit(1);
        }

        await runCommands(argv.commands, {
          killOthers: argv.killOthers,
          prefixColors: argv.prefixColors as string[],
          timestamps: argv.timestamps,
          ui,
        });
      },
    )
    .help();
}

if (
  import.meta.url.startsWith("file://") &&
  process.argv[1] === new URL(import.meta.url).pathname
) {
  buildCli(hideBin(process.argv), cliui()).parse();
}
