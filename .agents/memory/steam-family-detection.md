---
name: Steam Family detection
description: The account verifier intentionally mirrors the legacy steam3 Family Share detector.
---

The Steam Family Share detector should remain behaviorally identical to the legacy `steam3` repository unless the user explicitly asks for a new detection rule.

**Why:** The user intentionally added this behavior in the old repository and asked for the new repo to use the same implementation.

**How to apply:** Preserve the family-group lookup, empty-library heuristic for 2FA accounts, and `isFamilyShare` response flow when synchronizing verifier changes.

## Known bugs fixed

**Steam Families (2024) over-detection** — two fixes were applied to `artifacts/api-server/src/lib/steamChecker.ts`:

1. `isSteamFamilyShareAccount`: Changed `r.is_not_member_of_any_group === true` to a truthy check (`if (r.is_not_member_of_any_group)`) because Steam's protobuf-over-HTTP API may return the boolean as a number `1` instead of `true`.

2. Non-2FA path: Steam Families (2024) gives every family group member (including the owner) a non-zero `family_groupid`. Changed `isFamilyShare = inFamilyGroup` to `isFamilyShare = inFamilyGroup && games.length === 0` — only accounts that are in a family group AND have zero owned games are considered borrowers (family share). Accounts with their own games are group owners/members, not borrowers.