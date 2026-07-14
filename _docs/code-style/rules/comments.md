## File Header Comment Guidelines

- Do not add file header comments by default.
- Add one concise top-of-file comment only when the file's role is not obvious, the file contains complex shared logic, or a Next.js Server Component intentionally does not use `"use client"`.
- For Server Components, explain why it can stay server-side, for example: `// Server Component: no hooks, event handlers, or browser APIs are used.`

## Inline Comment Guidelines

- Write inline comments only when the **why is not obvious**, such as hidden constraints, specific bug workarounds, or surprising behavior.
- Do not explain what the code does; good naming should already communicate that.
- Do not record task IDs, PR numbers, or caller information in code comments; those belong in commit messages.
- Use at most one line per comment; multi-line comment blocks are prohibited.
- Do not casually delete existing comments, especially comments such as `// TODO`, `// FIXME`, and `// NOTE`.
