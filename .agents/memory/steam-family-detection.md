---
name: Steam Family detection
description: The account verifier intentionally mirrors the legacy steam3 Family Share detector.
---

The Steam Family Share detector should remain behaviorally identical to the legacy `steam3` repository unless the user explicitly asks for a new detection rule.

**Why:** The user intentionally added this behavior in the old repository and asked for the new repo to use the same implementation.

**How to apply:** Preserve the family-group lookup, empty-library heuristic for 2FA accounts, and `isFamilyShare` response flow when synchronizing verifier changes.