---
name: Legal Chicks free-input/soft-delete record pattern
description: Standard CRUD pattern used for all member-facing record types (poultry, sales, incubation) in the Legal Chicks app — free user input, soft delete, admin sees everything.
---

Legal Chicks Poultry Farm's member portal uses one consistent pattern for every record type (poultry records, sales, incubation, and any future logs):

- Members can freely create, edit, and delete their own records with **no admin approval gate**.
- "Delete" is always a soft delete: the row gets a `deletedAt` timestamp, never physically removed. User-facing queries filter `isNull(deletedAt)`.
- Admin-only endpoints (under `requireAdmin`) return **every** user's rows, active and deleted, joined against the users table for member name/username — this is how the admin dashboard shows full audit visibility.

**Why:** This was an explicit product requirement — admin needs a permanent audit trail even of things members delete, but members should never feel blocked by approval workflows for their own data entry.

**How to apply:** When adding a new record type to this app, replicate this exact shape: user CRUD routes scoped to `userId` + `isNull(deletedAt)`, a soft-delete route that sets `deletedAt`, and a parallel `/admin/<resource>` route with no deleted-filter plus a join to get member identity.
