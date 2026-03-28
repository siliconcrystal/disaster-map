# Station Layer POC

> **This is a vibe-coded proof of concept.** We built and tested it thoroughly, but it hasn't gone through formal code review. The team should discuss architecture decisions before building on top of this.

## What This PR Does

Separates the 162 station/POI entries (shelters, medical stations, restrooms, etc.) from `Task[]` into a dedicated `Station` entity with its own type system, Zustand store, map markers, and detail card.

This directly addresses Carol's feedback about entity flattening — stations are static POIs that don't have task lifecycles (reported → recruiting → done).

## Architecture Decisions

### Entity Separation
- `Station` is a flat type — no urgency, status lifecycle, history, or feedback
- `StationStatus` is simple: `open | closed | full | limited`
- 8 station types matching the UAT `places` table: shower, restroom, medical, supply, shelter, accommodation, water, repair

### Visual Distinction on Map
- **Task markers**: round (`rounded-full`), 40px, white background
- **Station markers**: rounded square (`rounded-xl`, iOS icon style), 36px, amber-tinted background
- Independent Supercluster instances — clustering doesn't mix tasks and stations
- Station clusters use amber color theme vs white for task clusters

### Mutual Exclusion
- Clicking a station clears the selected task (and vice versa)
- Only one detail card shows at a time
- Pattern follows existing `PolygonLayer.tsx` → `setSelectedTaskId(null)` behavior

### Layer Toggle
- "救災據點" toggle in the layer menu (default: ON)
- "全部顯示" (fit all) button includes station bounds when station layer is active

## Type Mapping

| `places.type` (Chinese) | `StationType` | Emoji |
|-------------------------|---------------|-------|
| 洗澡 | shower | 🚿 |
| 廁所 | restroom | 🚻 |
| 醫療, 心理援助 | medical | 🏥 |
| 物資, 加油 | supply | 📦 |
| 避難 | shelter | 🏠 |
| 住宿 | accommodation | 🏨 |
| 飲水, 加水 | water | 💧 |
| 維修 | repair | 🔧 |

## Files

| File | Action |
|------|--------|
| `src/types/station.ts` | NEW — Station type definitions |
| `src/data/seedStations.ts` | NEW — 162 Station entries from places table |
| `src/store/useStationStore.ts` | NEW — Zustand store for stations |
| `src/components/map/StationMarkerLayer.tsx` | NEW — Map markers with Supercluster |
| `src/components/station/StationDetailCard.tsx` | NEW — Detail card for selected station |
| `src/store/useUIStore.ts` | MODIFIED — added `station` to MapLayers |
| `src/components/map/MapView.tsx` | MODIFIED — mount station components |
| `src/components/map/MapControls.tsx` | MODIFIED — layer toggle + fitAll |
| `src/components/map/MarkerLayer.tsx` | MODIFIED — mutual exclusion on click |

## Known Limitations

- No station filtering UI (only type filter in store, no UI chips yet)
- No station search (search bar only queries tasks)
- Station detail card doesn't have "navigate" or "share" actions
- No station editing/creation flow
- `resources` field rendering is basic (list only)
- 14 places entries skipped due to missing coordinates
