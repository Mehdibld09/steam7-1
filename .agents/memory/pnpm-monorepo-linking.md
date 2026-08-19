---
name: pnpm monorepo linking
description: Reliable dependency linking for the imported pnpm workspace
---

The repository uses pnpm workspaces, so the workspace manifest must enumerate `artifacts/*` and `lib/*`, and internal package dependencies should use `workspace:*` rather than a registry-resolvable wildcard.

**Why:** Without the manifest, pnpm treats the artifact packages as isolated projects; without workspace protocol references, internal `@workspace/*` packages can be fetched from the registry and fail during clean Vercel installs.

**How to apply:** Preserve the workspace manifest and workspace protocol when adding or changing internal package dependencies.