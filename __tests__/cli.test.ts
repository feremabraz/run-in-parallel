import { spawn } from "node:child_process";
import { cliui } from "@poppinss/cliui";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { buildCli } from "../src/cli";

vi.mock("child_process");

describe("CLI Tests", () => {
  beforeAll(() => {
    console.log(
      "🧪 CLI Tests - Note: Any 'Process exit called' errors below are expected and indicate proper validation.",
    );
  });

  it("should parse commands correctly", async () => {
    const ui = cliui({ mode: "raw" });

    const mockSpawn = vi.mocked(spawn);
    const mockProcess = {
      stdout: { on: vi.fn() },
      stderr: { on: vi.fn() },
      on: vi.fn((event: string, callback: (code: number) => void) => {
        if (event === "close") {
          setTimeout(() => callback(0), 10);
        }
      }),
      killed: false,
      kill: vi.fn(),
    };

    mockSpawn.mockReturnValue(
      mockProcess as unknown as ReturnType<typeof spawn>,
    );

    const parser = buildCli(['echo "test"'], ui);
    await parser.parse();

    expect(mockSpawn).toHaveBeenCalledWith("sh", ["-c", 'echo "test"'], {
      stdio: ["inherit", "pipe", "pipe"],
    });
  });

  it("should handle timestamps option", async () => {
    const ui = cliui({ mode: "raw" });

    const mockSpawn = vi.mocked(spawn);
    const mockProcess = {
      stdout: { on: vi.fn() },
      stderr: { on: vi.fn() },
      on: vi.fn((event: string, callback: (code: number) => void) => {
        if (event === "close") {
          setTimeout(() => callback(0), 10);
        }
      }),
      killed: false,
      kill: vi.fn(),
    };

    mockSpawn.mockReturnValue(
      mockProcess as unknown as ReturnType<typeof spawn>,
    );

    const parser = buildCli(["--timestamps", 'echo "test"'], ui);
    await parser.parse();

    const logs = ui.logger.getRenderer().getLogs();
    expect(logs.some((log) => log.message.includes("Starting: echo"))).toBe(
      true,
    );
  });
  it("should exit with error when no commands provided", async () => {
    const ui = cliui({ mode: "raw" });
    const parser = buildCli([], ui);

    const exitSpy = vi.spyOn(process, "exit").mockImplementation((code) => {
      throw new Error(`Process exit called with code ${code}`);
    });

    try {
      await parser.parse();
      expect.fail("Should have called process.exit");
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe("Process exit called with code 1");
    }

    expect(exitSpy).toHaveBeenCalledWith(1);
    exitSpy.mockRestore();
  });

  it("should handle command line options", async () => {
    const ui = cliui({ mode: "raw" });
    const parser = buildCli(["--help"], ui);

    expect(parser).toBeDefined();
  });
});
