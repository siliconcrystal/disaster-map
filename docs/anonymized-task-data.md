# Anonymized Task Data — Guangfu Disaster Relief

## Data Source

Task data is extracted from the anonymized GuangFuHero UAT database `human_resources` table (391 rows). This table contains real disaster relief task requests (抽水機, 重機械維修, 載人, 清潔, 人力, etc.) from the Guangfu Township (光復鄉) disaster response operations.

## Seed Data Composition

**`src/data/seedTasks.ts`** — 392 tasks total:

| Source | Count | Types |
|--------|-------|-------|
| UAT `human_resources` table | 364 | cleanup, utility, heavy, support, people, transport, supply, medical |
| AI-generated emergency tasks | 28 | fire (10), inspection (10), rescue (8) |

### Status Distribution (after redistribution for board view)

| Status | Count | Chinese |
|--------|-------|---------|
| reported | ~100 | 已回報 |
| recruiting | ~83 | 招募中 |
| in_progress | ~64 | 進行中 |
| done | ~145 | 已完成 |

### Type Mapping (HR `role_name` → Task `type`)

| HR role_name pattern | Task type | Count |
|---------------------|-----------|-------|
| 鏟子超人, 清潔, 清淤, 整理, 掃水 | cleanup | ~120 |
| 水電, 修繕, 拆除, 鐵捲門, 鋁門窗, 泥作 | utility | ~94 |
| 抽水機, 怪手, 山貓, 重機, 挖土機 | heavy | ~58 |
| 義煮, 搬運, 壯丁, 後勤 | support | ~41 |
| 人力, 志工, 一般超人 | people | ~32 |
| 載人, 接駁, 運送, 卡車, 小蜜蜂 | transport | ~15 |
| 物資, 配送 | supply | ~3 |
| 傷口換藥 | medical | ~1 |

## PII Handling (Anonymization)

All personally identifiable information was replaced using PostgreSQL functions before export:

| Field | Original | Anonymized | Pattern |
|-------|----------|------------|---------|
| Names | Real names (洪宗翰) | 小動物 pattern | `{surname}小{animal}` → 王小虎, 陳小貓, 郭小鯨 |
| Phones | Real numbers (0983-305-593) | Fixed prefix + letters | `0987-654-{abc}` → 0987-654-sdg |
| Addresses | Real house numbers | Fuzzed ±10-50% | 中正路一段154號 (was ~200號) |
| Notes | Free-text with PII | Redacted | `(已匿名化)` |

**Why obviously fake?** Previous anonymization used realistic-looking fake names/phones that could be confused with real PII. The `小動物` and alphabetic phone suffix patterns are immediately recognizable as test data.

## History Enrichment

Every task has exactly 3 history entries matching Crystal's UI mock data pattern:

```typescript
history: [
  { timestamp: createdAt,           message: '案件提交並確認',        type: 'system' },
  { timestamp: createdAt + 3600000, message: '<contextual comment>', type: 'comment' },
  { timestamp: createdAt + 7200000, message: '<status message>',    type: 'status' },
]
```

Comment messages are contextual to task type (e.g. heavy → "重型機具已聯繫廠商，等待進場").

## Other Seed Data

- **`src/data/seedZones.ts`** — 3 MapZone polygons for Guangfu area (避難區域, 禁止通行, NGO 中心)
- **Station/POI data** — 161 entries from `places` table are in a separate Station layer PR

## Anonymization Pipeline

1. Original UAT dump: `gcp_uat_backup_2026-02-08-160635.dump.gz`
2. Anonymization script: `anonymize.sql` (in repo root)
3. Run via disposable Docker PostgreSQL container
4. Output: `gcp_uat_anonymized.sql` (INSERT format) + `.dump` (binary)
5. Extraction script: `extract-hr-tasks.mjs` (throwaway, not committed)
