# TypeScript CLI Template

A modern, reusable template for creating powerful TypeScript command-line interfaces. This project is designed to be run directly with Node.js (>=23.6.0) without a separate compilation step.

It comes pre-configured with a suite of best-in-class tools to get you started quickly:

- **Runtime**: [Node.js](https://nodejs.org/) with native TypeScript execution.
- **UI**: [@poppinss/cliui](https://github.com/poppinss/cliui) for clean and interactive terminal output (logs, tables, spinners).
- **Argument Parsing**: [yargs](https://yargs.js.org/) for robust command and argument management.
- **Interactive Prompts**: [prompts](https://github.com/terkelg/prompts) for creating interactive CLI experiences.
- **Testing**: [Vitest](https://vitest.dev/) for fast and modern unit testing.
- **Linting & Formatting**: [Biome](https://biomejs.dev/) for unified and fast code quality checks.
- **Package Manager**: [pnpm](https://pnpm.io/) for efficient dependency management.

## Prerequisites

- Node.js >= 23.6.0
- pnpm >= 10.0.0

## Getting Started

1.  **Use this template**: Click the "Use this template" button on GitHub to create your own repository.
2.  **Clone your new repository**:
    ```sh
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```
3.  **Install dependencies**:
    ```sh
    pnpm install
    ```

## Project Configuration

Before you start coding, it's important to update the `package.json` file with your project's specific details:

-   **`name`**: The name of your package on npm.
-   **`author`**: Your name and contact information.
-   **`description`**: A brief description of what your CLI does.
-   **`bin`**: This is very important. It maps your CLI command name to the entry point file. Change `"cli-executable-publishable"` to the command you want users to run.

Example `package.json` update:
```json
{
  "name": "my-awesome-cli",
  "version": "1.0.0",
  "description": "An awesome CLI that does awesome things.",
  "author": "Your Name <your@email.com>",
  "bin": {
    "my-awesome-cli": "src/cli.ts"
  },
  // ... other fields
}
```

## Development

This template provides several scripts to help with development:

-   **Run the CLI locally**:
    ```sh
    # Execute the CLI directly
    node src/cli.ts <command>

    # Or use the start script
    pnpm start -- <command>
    ```
-   **Run tests**:
    ```sh
    pnpm test
    ```
-   **Lint and format code**:
    ```sh
    # Check for issues
    pnpm lint
    pnpm format

    # Automatically fix issues
    pnpm lint --write
    pnpm format --write
    ```
-   **Type-check the code**:
    ```sh
    pnpm typecheck
    ```

## Git Hooks with Husky

This template uses [Husky](https://typicode.github.io/husky/) to automate quality checks using git hooks. These hooks run automatically during the commit and push processes to ensure code consistency and quality.

-   **`prepare-commit-msg`**: Automatically adds a template to your commit message to guide you in writing conventional commits.
-   **`commit-msg`**: Validates your commit message to ensure it meets a minimum length and encourages the conventional commit format.
-   **`pre-commit`**: Before a commit is created, this hook runs Biome (linter and formatter) and the TypeScript compiler (`tsc`) on all staged files. This prevents committing code with errors or style issues.
-   **`pre-push`**: Prevents you from pushing directly to the `main` or `master` branches. This encourages a feature-branch workflow. If you prefer to commit directly to `main`, you can bypass this hook (`BYPASS_PUSH_PROTECTION=1 git push`) or simply delete the `.husky/pre-push` file.

## Publishing to npm

Follow these steps to publish your CLI to the public npm registry.

### 1. Log in to npm

You only need to do this once per machine.

```sh
pnpm login
```

Enter your npm username, password, and email address when prompted.

### 2. Test Locally (Recommended)

Before publishing, it's a good idea to test the package as if it were installed globally. The `pnpm link` command is perfect for this.

```sh
# Create a global symlink to your project
pnpm link --global
```

Now you can run your command from anywhere in your terminal:

```sh
# Replace with the command name from your package.json "bin" field
cli-executable-publishable interactive-hello
```

### 3. Publish the Package

When you are ready, run the `pnpm publish` command. The `--access public` flag is required for the first publish of a non-scoped package.

```sh
pnpm publish --access public
```

Congratulations! Your CLI is now live on the npm registry.
