```markdown
# Clock

## It's just an ordinary clock.

## Local-only files (do not upload)

- **.gitignore**: already configured to ignore local files such as `.env.local`, `.vscode/`, `node_modules/`, `dist/`, and macOS `.DS_Store`.
- **.env.local.example**: a template provided in the repo. Create a personal `.env.local` by copying this file and filling secrets or machine-specific values. Example:

```sh
cp .env.local.example .env.local
# then edit .env.local
```

Notes:
- Keep `.env.local` private — do not commit or push it.
- Use `VITE_` prefixed variables for values that need to be available in the client bundle.

```
