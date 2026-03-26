# Plan: Seed disaster-map with anonymized DB data → E2E verify → PR

## Context

Replace mock data in the disaster-map frontend POC with anonymized real data from GuangFuHero UAT DB + fake fire/inspection/rescue tasks. Two PRs to the UI designer's repo — PR #1 seed data only, PR #2 optional pre-existing bug fixes.

## Status: Steps 1-4 DONE, Steps 5-7 TODO

Steps 1-4 (data extraction, seed file creation, zone data, store modification) are complete. All code changes are on `main` (unstaged/untracked). `npm run build` passes. Dev server runs on port 3456.

**Current git state:**
- Modified (unstaged): `src/store/useTaskStore.ts`
- Untracked: `src/data/seedTasks.ts`, `src/data/seedZones.ts`, `PLAN.md`
- Branch: `main` (up to date with remote, commit 85fa90f)

**What was done:**
- 189 tasks: 161 real from DB `places` table + 10 fire + 10 inspection + 8 rescue
- All 127 phone contacts replaced with obviously fake `0987-654-xxx` (alphabetic suffix)
- UUID-safe `hashCode()` replacing broken `parseInt(t.id.replace('task-', ''))` in assignee filter
- mapCenter updated to `[23.67, 121.43]` (Guangfu)
- 3 zone polygons for Guangfu area

---

## Step 5: E2E Browser Verification (playwright-cli)

Dev server already running on port 3456. Test 3 scenarios in sequence.

### 5a. Test main branch baseline

```bash
# Stash our changes so dev server hot-reloads to original mock data
cd /Users/shroom/wanguard/anonymize-old-pg/disaster-map
git stash --include-untracked
```

Open browser and verify original state:
```bash
playwright-cli open http://localhost:3456
playwright-cli snapshot --filename=baseline-map.yaml
```

Checks:
- [ ] Map loads (tile layer visible)
- [ ] Markers render (mock data, ~150 tasks)
- [ ] Map centered on original location (Tainan area ~23.00, 120.21)

```bash
playwright-cli close
```

### 5b. Test PR #1 — seed data

```bash
git stash pop
# Dev server hot-reloads with our seed data
```

```bash
playwright-cli open http://localhost:3456
playwright-cli snapshot --filename=pr1-map.yaml
```

Checks:
- [ ] Map centered on 光復 area (23.67, 121.43) — NOT Tainan
- [ ] ~189 markers visible (with clustering)
- [ ] Click a marker → TaskDetailCard opens with real Chinese address
- [ ] Contact shows fake phone `0987-654-xxx` (not real numbers)
- [ ] Switch to board view → 4 status columns populated
- [ ] Search "醫療" → TaskListPanel appears with filtered results
- [ ] Zone polygons visible when toggled

Board view test:
```bash
# Click user avatar → toggle to board view
playwright-cli click <avatar-ref>
playwright-cli click <board-toggle-ref>
playwright-cli snapshot --filename=pr1-board.yaml
```

Task detail test:
```bash
# Click a map marker
playwright-cli click <marker-ref>
playwright-cli snapshot --filename=pr1-task-detail.yaml
```

```bash
playwright-cli close
```

### 5c. Test PR #2 — pre-existing bug fixes

Apply the 5 bug fixes (see Step 7 below), then test:

```bash
playwright-cli open http://localhost:3456
playwright-cli snapshot --filename=pr2-fixes.yaml
```

Checks:
- [ ] No duplicate modal rendering (DevTools: check DOM for single modal instance)
- [ ] TaskCreateModal: "people" option works (no trailing colon)
- [ ] Geolocation button: click twice, no stacked listeners

```bash
playwright-cli close
```

---

## Step 6: Create PR #1 — Seed Data

```bash
git checkout -b feat/seed-anonymized-data
mkdir -p docs && mv PLAN.md docs/ANONYMIZED-SEED-DATA.md
git add src/data/seedTasks.ts src/data/seedZones.ts src/store/useTaskStore.ts docs/
git commit  # message: "feat: replace mock data with anonymized Guangfu disaster relief data"
git push -u origin feat/seed-anonymized-data
gh pr create --title "feat: seed anonymized Guangfu disaster data" --body "..."
```

**PR #1 files:**
| File | Action |
|------|--------|
| `src/data/seedTasks.ts` | CREATE — 189 Task[] (161 real + 28 fake) |
| `src/data/seedZones.ts` | CREATE — 3 MapZone[] for Guangfu area |
| `src/store/useTaskStore.ts` | MODIFY — import seeds, update mapCenter, fix assignee filter |
| `docs/ANONYMIZED-SEED-DATA.md` | CREATE — documentation of data pipeline, type/status mapping, PII notes |

**PR description should note:**
- Data comes from anonymized UAT DB — no real PII
- All phone numbers are obviously fake (`0987-654-aab` through `0987-654-xxx`)
- reporterName hardcoded as "光復災防中心"
- Assignee filter fixed for UUID IDs (was broken with `task-N` assumption)
- 6 pre-existing bugs identified but NOT included in this PR (see PR #2)

---

## Step 7: Create PR #2 — Pre-existing Bug Fixes (Optional)

Branch from `feat/seed-anonymized-data` so it stacks cleanly.

```bash
git checkout -b fix/pre-existing-ui-bugs
```

### Bug fixes to apply:

**Bug 1: Duplicate modal mounts**
- `src/app/providers.tsx` lines 23-24 — remove `<TaskFullDetailModal />` and `<TaskCreateModal />`
- These are already mounted in `src/app/page.tsx` (lines 32-33)

**Bug 2: "people:" typo**
- `src/components/task/TaskCreateModal.tsx` line 89
- Change `<option value="people:">` → `<option value="people">`

**Bug 3: Geolocation listener leak**
- `src/components/map/MapControls.tsx` lines 31-34
- Change `map.locate().on("locationfound", ...)` → `map.off("locationfound"); map.locate().once("locationfound", ...)`

**Bug 4: Advanced filter auth desync**
- `src/components/ui/FilterChips.tsx` — the `requiresAuthValues` check uses `currentUserRole` but login state is separate (`isLoggedIn`)
- Fix: check `isLoggedIn` from useUIStore instead of `currentUserRole`

**Bug 5: Incomplete role mapping**
- `src/store/useTaskStore.ts` lines 107-110 — only 5 of 9 roles mapped
- Add missing roles or make filter pass-through for unmapped roles (less breaking)

```bash
git add -A
git commit  # message: "fix: address 5 pre-existing UI bugs (modals, typo, listener leak, auth, roles)"
git push -u origin fix/pre-existing-ui-bugs
gh pr create --base feat/seed-anonymized-data --title "fix: pre-existing UI bugs" --body "..."
```

**PR #2 files:**
| File | Action |
|------|--------|
| `src/app/providers.tsx` | MODIFY — remove duplicate modal mounts |
| `src/components/task/TaskCreateModal.tsx` | MODIFY — fix "people:" typo |
| `src/components/map/MapControls.tsx` | MODIFY — fix geolocation listener leak |
| `src/components/ui/FilterChips.tsx` | MODIFY — fix auth check for assignee filter |
| `src/store/useTaskStore.ts` | MODIFY — add missing role mappings |

**PR description should note:**
- These are all pre-existing bugs, NOT introduced by PR #1
- Designer can choose to merge or not
- Each fix is small and isolated

---

## Verification Summary

| Scenario | What to verify | Pass criteria |
|----------|---------------|---------------|
| Main baseline | Map loads, markers visible | Tainan-centered, ~150 mock tasks |
| PR #1 seed data | Map + markers + detail + board + search + zones | Guangfu-centered, 189 tasks, fake phones, 4 board columns |
| PR #2 bug fixes | No dup modals, people option works, geo click safe | DOM has single modal, option value="people", `.once()` used |
