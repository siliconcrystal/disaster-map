# Disaster Relief Map (災情收容地圖系統)

此專案為使用 React + Next.js (App Router) + Tailwind CSS + Aceternity UI 概念 + Leaflet 所建構的地圖型任務管理 UI。
包含主題切換、地圖 Cluster、Zustand 狀態管理，以及各類元件的響應式設計與 z-index 處理。

## 1. 專案結構
- `/src/components/ui/`: 頂部導覽列(TopBar)、使用者下拉選單(UserDropdown)、篩選標籤(FilterChips)、進階過濾(AdvancedFilterModal)、主題切換(ThemeToggle)
- `/src/components/map/`: 地圖容器(MapView)、叢集與標記(MarkerLayer)、多邊形圖層(PolygonLayer)、地圖控制列(MapControls)
- `/src/components/task/`: 任務詳情卡(TaskDetailCard)、建立任務彈窗(TaskCreateModal)、左側搜尋結果(TaskListPanel)
- `/src/store/`: Zustand 狀態管理 (TaskStore, UIStore)
- `/src/types/`: 資料結構型別定義

## 2. 安裝與執行方式

請確保您已安裝 Node.js (建議 v18 以上)。

1. 進入專案目錄
   ```bash
   cd disaster-map
   ```
2. 安裝所需套件（如果您尚未安裝）：
   ```bash
   npm install
   ```
3. 啟動開發伺服器：
   ```bash
   npm run dev
   ```
4. 在瀏覽器中開啟 [http://localhost:3000](http://localhost:3000) 即可檢視並互動。

## 3. 所需套件清單 (npm install)
專案內已安裝下列主要套件：
- `next` / `react` / `react-dom`：核心框架
- `tailwindcss` / `@tailwindcss/postcss`：樣式引擎
- `leaflet` / `react-leaflet`：地圖與 React 綁定
- `use-supercluster`：支援巨量標記 Clustering
- `zustand`：輕量級狀態管理
- `framer-motion`：滑順的過渡動畫 (Aceternity UI 概念風格)
- `lucide-react`：圖示庫
- `next-themes`：處理深色/淺色主題切換
- `clsx` / `tailwind-merge`：樣式類別合併工具

## 4. Theme 切換實作方式
- 使用 `next-themes` 的 `<ThemeProvider attribute="class">` 包覆全站 (`src/app/providers.tsx`)。
- 在 Tailwind 中配置 Dark Mode (基於類別名稱 `dark`)。
- `UserDropdown` 透過呼叫 `useTheme` 的 `setTheme('dark' | 'light')` 切換全域樣式。
- 專案所有玻璃擬真（Glassmorphism）皆設定 `dark:bg-slate-900` 等 `dark:` 前綴來適配深色模式。
- Leaflet 地圖 (`MapView.tsx`) 會監聽主題變數，自動將圖磚層切換為深色或淺色的樣式。
