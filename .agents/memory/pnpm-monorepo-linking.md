---
name: pnpm monorepo linking
description: Reliable dependency linking for the imported pnpm workspace
---

The repository uses pnpm workspaces, so the workspace manifest must enumerate `artifacts/*` and `lib/*`, and internal package dependencies should use `workspace:*` rather than a registry-resolvable wildcard.

**Why:** Without the manifest, pnpm treats the artifact packages as isolated projects; without workspace protocol references, internal `@workspace/*` packages can be fetched from the registry and fail during clean Vercel installs.

**How to apply:** Preserve the workspace manifest and workspace protocol when adding or changing internal package dependencies.

The lockfile records pnpm peer-install settings, so `.npmrc` must explicitly keep `auto-install-peers=true` for Vercel's frozen installs.

**Why:** Vercel's default pnpm settings can differ from the settings captured when the lockfile was generated, causing `ERR_PNPM_LOCKFILE_CONFIG_MISMATCH`.

**How to apply:** Keep the peer-install setting in `.npmrc` synchronized with the lockfile whenever dependencies are regenerated.