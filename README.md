# run-in-parallel

Run multiple commands in parallel with clean output.

## Installation

```bash
# Local installation (recommended)
npm install --save-dev run-in-parallel
# or
pnpm add -D run-in-parallel

# Global installation (optional)
npm install -g run-in-parallel
```

## Usage

```bash
# With npm/pnpm (local installation)
npx run-in-parallel 'command1' 'command2' 'command3'
pnpm exec run-in-parallel 'command1' 'command2' 'command3'

# Global installation
run-in-parallel 'command1' 'command2' 'command3'
```

### Examples

```bash
# Basic usage
npx run-in-parallel 'echo "First"' 'echo "Second"' 'sleep 2 && echo "Third"'

# Development workflow
npx run-in-parallel 'npm run watch-js' 'npm run watch-css' 'npm run dev-server'

# Don't kill others on failure
npx run-in-parallel --no-kill-others 'npm test' 'npm run lint'

# With timestamps
npx run-in-parallel --timestamps 'echo "First"' 'echo "Second"'

# With pnpm (same functionality)
pnpm exec run-in-parallel 'npm run build-js' 'npm run build-css'
```

### In package.json

```json
{
  "scripts": {
    "start": "run-in-parallel 'node server.js' 'tailwindcss --watch'",
    "dev": "run-in-parallel 'vite dev' 'tsc --watch --noEmit'"
  },
}
```

Run with `npm run dev` or `pnpm dev`.

## Options

| Option | Alias | Default | Description |
|--------|-------|---------|-------------|
| `--kill-others` | `-k` | `true` | Kill other processes when one fails |
| `--prefix-colors` | `-c` | `["red", "green", "blue", "yellow", "magenta", "cyan"]` | Colors for command prefixes |
| `--timestamps` | `-t` | `false` | Add timestamps to output |
| `--help` | | | Show help |
