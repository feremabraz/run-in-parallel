import { cliui } from "@poppinss/cliui";
import prompts from "prompts";
import { describe, expect, it, vi } from "vitest";
import { buildCli } from "../src/cli";

// Mock the entire prompts module
vi.mock("prompts");

describe("CLI Tests", () => {
  it("should test the non-interactive hello command", async () => {
    const ui = cliui({ mode: "raw" });
    // Pass the arguments as an array to our builder
    const parser = buildCli(["hello", "Tester"], ui);

    // Run the command
    await parser.parse();

    // Get the captured logs
    const logs = ui.logger.getRenderer().getLogs();

    // Assert the output
    expect(logs).toEqual([
      {
        message: "[ green(success) ] Hello, Tester!",
        stream: "stdout",
      },
    ]);
  });

  it("should test the interactive-hello command", async () => {
    // Configure the mock to return a specific value for this test
    vi.mocked(prompts).mockResolvedValue({ name: "InteractiveTester" });

    const ui = cliui({ mode: "raw" });
    const parser = buildCli(["interactive-hello"], ui);

    await parser.parse();

    const logs = ui.logger.getRenderer().getLogs();
    expect(logs).toEqual([
      {
        message: "[ green(success) ] Hello, InteractiveTester!",
        stream: "stdout",
      },
    ]);
  });
});
