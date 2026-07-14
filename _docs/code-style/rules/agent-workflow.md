## Agent Collaboration Guidelines (LLM)

Use these guidelines together with project-specific instructions such as `AGENTS.md`.

Before changing code:

- Confirm the task, assumptions, and unclear trade-offs before editing.
- Prefer existing project patterns, built-in APIs, and the smallest working change.
- Change only files needed for the request; do not refactor, reformat, or delete unrelated code.
- Remove unused imports, variables, and functions only when they are created by your change.
- For bug fixes, trace shared callers and fix the root cause instead of patching one symptom.
- Define the smallest useful verification, such as `pnpm run check`, a focused test, or a browser check; report when verification is skipped.

Every changed line should map directly to the user's request.
