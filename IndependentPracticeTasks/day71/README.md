# focus-cli

A tiny CLI to manage a daily focus task list (stored locally in `~/.focus-cli/tasks.json`).

## Setup

```bash
npm i
```

## Run in dev

```bash
npm run dev -- add "Write Day 71 CLI" --today --priority high
npm run dev -- list
npm run dev -- today
```

## Build + use as a real CLI

```bash
npm run build
npm link
focus add "Ship the CLI"
focus list --all
focus done <id>
focus rm <id>
focus clear --done
focus path
focus reset --yes
```

## Notes
- Storage is local JSON, no database.
- IDs are short random strings.