# E2E Acceptance Test Results

Tested: 2026-03-28
Branch stack: `feat/seed-anonymized-data` -> `feat/station-layer-poc`
Dev server: `http://localhost:3456`

---

## Phase 1: feat/seed-anonymized-data (PR #2)

| ID    | Name                                | Result | Notes |
|-------|-------------------------------------|--------|-------|
| SD-01 | Map loads and centers on Guangfu    | PASS   | Tiles at zoom 13, x=6858/y=3541 (~23.65, 121.33). Tooltips confirm Guangfu area (光復國小避難收容所, 東富村土石流警戒區). |
| SD-02 | Task markers render with clustering | PASS   | 13 cluster/individual task markers visible. Cluster "311" is largest. Individual markers show emoji (🪏, 🔥). Total: 392 tasks. |
| SD-03 | Click task marker opens TaskDetailCard | PASS | Clicked 🪏 marker. Card shows title "佛祖街46巷 4 5 - 鏟子 (需20人)", address coords (23.6421, 121.4166), contact info. |
| SD-04 | Task detail shows obviously fake PII | PASS  | Reporter: 賴小蛙 (surname+小+animal). Phone: 0987-654-ddx (pattern match). Second task: 楊小馬 / 0987-654-kuc. |
| SD-05 | Task detail shows 3 history entries  | PASS  | 3 entries: "案件提交並確認" (system), contextual comment, status update. Timestamps sequential. |
| SD-06 | Board view shows 4 columns with tasks | PASS | Columns: 已回報(100), 招募中(83), 進行中(64), 已完成(145). Total = 392. All non-zero. |
| SD-07 | Search filters tasks                 | PASS  | Searched "水電": 110 matching leaf elements. Results include titles like "中山路二段61號 - 水電" and descriptions with 需求類型：水電. |
| SD-08 | Board view task cards show correct data | PASS | All 4 columns have: type emoji (🛵🪏🚜🔧💪👥), titles with address+role, descriptions with 需求類型, 花蓮縣光復鄉 addresses, urgency badges (緊急/中等/一般). |
| SD-09 | Zone polygons visible when toggled   | PASS  | Toggled 避難區域 ON. 1 SVG path in leaflet-overlay-pane. Tooltip "東富村土石流警戒區" visible. No console errors. |

**Phase 1 result: 9/9 PASS**

---

## Phase 2: feat/station-layer-poc (PR #4)

### Station Layer Tests (SL-01 ~ SL-12)

| ID    | Name                                    | Result | Notes |
|-------|-----------------------------------------|--------|-------|
| SL-01 | Station markers render on map           | PASS   | Two marker types visible: task (rounded-full, white bg) and station (rounded-xl, amber). Station markers: 🔧, 🚻 individual + clusters (26, 22, 13, 9, 5, 3, 4, 2). Task markers unchanged from Phase 1. |
| SL-02 | Station layer toggle in layer menu      | PASS   | "救災據點" is FIRST item in 圖層顯示 section. Toggle switch has bg-blue-500 + translate-x-4 (ON by default). |
| SL-03 | Toggle station layer OFF hides stations | PASS   | After toggling OFF, only task markers remain (311, 6, 13, 8, 7, 4, 5, 11, 11, 5, 9, 🪏, 🔥). All station markers gone. |
| SL-04 | Toggle station layer ON restores stations | PASS | Station markers reappear: 26, 5, 22, 13, 9, 3, 4, 🔧, 4, 2, 🚻, 🚻. Both types visible again. |
| SL-05 | Click station marker opens StationDetailCard | PASS | Clicked 🚻. Card shows: name "東富國小藝術村(舊東富國小)", type "🚻 廁所", status "開放中", address "976花蓮縣光復鄉東富路61號", coords 23.6857/121.4821. |
| SL-06 | StationDetailCard shows station-specific fields | PASS | Card has: address+coords, status "開放中", resources section. NO urgency badge, NO history timeline, NO "我能前往協助" button. |
| SL-07 | Mutual exclusion: clicking task closes station | PASS | Clicked 🪏 task while station card open. Station card gone, TaskDetailCard appears with "佛祖街46巷 4 5 - 鏟子 (需20人)". |
| SL-08 | Mutual exclusion: clicking station closes task | PASS | Clicked 🔧 station while task card open. Task card gone, StationDetailCard appears with "鋐舜汽車修護廠", type "維修站". |
| SL-09 | Close StationDetailCard via X button    | PASS   | Clicked X button. Card dismissed. Map returns to normal state with no detail card. |
| SL-10 | Station clusters expand on click        | PASS   | Clicked station cluster "9" via JS. Map zoomed in, cluster expanded to show individual markers (🚻) + smaller cluster (8). |
| SL-11 | Fit-all button includes stations        | PASS   | After fit-all, 25 markers visible: 13 task + 12 station. Both types within visible bounds. |
| SL-12 | Station resources render in detail card | PASS   | 🚻 station shows: heading "可用資源", item "流動廁所（無障礙1座） — 3 座" (name + quantity + unit). |

**Station layer result: 12/12 PASS**

### Seed Data Re-run on Station Layer Branch (SD-01 ~ SD-09)

| ID    | Name                                    | Result | Notes |
|-------|-----------------------------------------|--------|-------|
| SD-01 | (re-run) Map loads and centers on Guangfu | PASS | Same tile coordinates, Guangfu tooltips present. |
| SD-02 | (re-run) Task markers render with clustering | PASS | Same 13 task cluster/markers. Total 392 tasks in sidebar. |
| SD-03 | (re-run) Click task marker opens TaskDetailCard | PASS | Clicked 🔥 marker. "南富村 - 雜草火災", address 花蓮縣光復鄉南富村, phone 0987-654-kuc. |
| SD-04 | (re-run) Task detail shows obviously fake PII | PASS | Reporter: 楊小馬 (surname+小+animal). Phone: 0987-654-kuc. |
| SD-05 | (re-run) Task detail shows 3 history entries | PASS | 3 entries: "案件提交並確認", "已進行初步滅火", "招募進行中". |
| SD-06 | (re-run) Board view shows 4 columns    | PASS   | Same counts: 已回報(100), 招募中(83), 進行中(64), 已完成(145) = 392. |
| SD-07 | (re-run) Search filters tasks          | PASS   | "水電" search: 110 matching elements, identical to Phase 1. |
| SD-08 | (re-run) Board view cards correct data | PASS   | All 4 columns have emojis + urgency badges. |
| SD-09 | (re-run) Zone polygons visible         | PASS   | 1 SVG path in overlay pane after toggling 避難區域. |

**Seed data re-run result: 9/9 PASS**

---

## Summary

| Phase | Tests | Passed | Failed |
|-------|-------|--------|--------|
| Phase 1: Seed Data (PR #2) | 9 | 9 | 0 |
| Phase 2: Station Layer (PR #4) | 12 | 12 | 0 |
| Phase 2: Seed Data re-run | 9 | 9 | 0 |
| **Total** | **30** | **30** | **0** |

Both PRs are ready for teammate review.
