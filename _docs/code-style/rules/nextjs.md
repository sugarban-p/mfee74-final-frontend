## Next.js Version-Specific Rules

Before modifying any Next.js code, inspect the locally installed Next.js documentation or the existing project conventions first.

Do not infer routing, data fetching, caching, server/client component behavior, or file structure from training data.

When uncertain, prefer the existing codebase pattern over generic Next.js examples.

## Server and Client Components

- Prefer Server Components unless the component needs hooks, event handlers, browser APIs, or client-only libraries.
- Add `"use client"` only to the smallest component that needs client behavior.
- Do not import server-only modules into Client Components.
- When writing a Server Component, add one concise top-of-file comment explaining why it does not need `"use client"`.

## Environment Variables

- When adding or using `process.env.*`, update `src/types/env.d.ts` at the same time.
- Client-exposed variables must use the `NEXT_PUBLIC_` prefix.
- Avoid hard-coded service URLs when an environment variable already exists or should exist.
