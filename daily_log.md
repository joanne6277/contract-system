# 2026-04-23 業務部合約模組優化：基本資料新增「類型」勾選欄位

## 摘要
在業務部合約的基本資料中新增「類型」欄位，支援勾選「合約」或「報價單」，並同步更新 UI 渲染與模擬資料。

## 詳細變更內容

### 1. 欄位定義與型別更新
- [修改] `src/features/business/types/index.ts`: 
    - `BusinessContract.basicInfo` 新增 `type: string[]`。
    - `BusinessFormFieldConfig` 加入 `checkbox` 類型支援。
- [修改] `src/features/business/constants/fieldConfig.ts`: 在基本資料中配置「類型」欄位，選項為「合約」、「報價單」。
- [修改] `src/features/business/constants/contractFields.ts`: 在欄位名稱對照表 (`fieldKeyToNameMap`) 中新增「類型」。

### 2. UI 實作與表單邏輯
- [修改] `src/pages/BusinessContract.tsx`: 
    - 更新初始狀態，確保 `type` 為陣列。
    - 在 `FormField` 中實作 `checkbox` 分組渲染邏輯，支援複選與狀態同步。
- [修改] `src/features/business/search/BusinessContractDetail.tsx`: 詳目頁基本資料區塊新增「類型」欄位顯示。

### 3. 模擬資料與測試
- [修改] `src/data/mockBusinessContracts.ts`: 為所有模擬合約補上 `type` 欄位資料。

---

# 2026-04-23 業務部合約模組優化：新增維護歷程與修改紀錄功能

## 摘要
為業務部合約模組導入維護歷程（Maintenance History）機制，仿照學發部架構，自動在合約建檔與編輯時記錄變更內容，提升資料維護的可追溯性。

## 詳細變更內容

### 1. 型別定義擴充
- [修改] `src/features/business/types/index.ts`: 
    - 新增 `ChangeDetail` 與 `MaintenanceRecord` 介面。
    - 在 `BusinessContract` 介面中新增 `maintenanceHistory` 選擇性欄位。

### 2. 模擬資料更新
- [修改] `src/data/mockBusinessContracts.ts`: 為現有的 5 筆模擬合約加入初始的「合約建檔」維護紀錄，確保搜尋詳目時有資料可供展示。

### 3. 目錄章節配置調整
- [修改] `src/features/business/constants/tocSections.ts`: 在目錄章節設定中新增「維護歷程」(`maintenance-history`) 項目。

### 4. 詳目頁面顯示優化
- [修改] `src/features/business/search/BusinessContractDetail.tsx`: 
    - 實作「維護歷程」章節的渲染邏輯，以時間軸方式顯示修改人、時間及具體的欄位變更內容。
    - 支援顯示變更前與變更後的值。

### 5. 合約維護邏輯增強
- [修改] `src/pages/BusinessContract.tsx`: 
    - 支援編輯模式：新增 `useEffect` 依 `id` 讀取合約資料。
    - 實作變更追蹤：在 `handleSubmit` 時比較 `originalData` 與 `formData`。
    - 自動產生紀錄：
        - 新增合約時，自動記錄「合約建檔」。
        - 編輯合約時，自動比對並記錄所有異動欄位及其新舊值。
    - 優化訊息回饋：區分新增與更新成功後的提示文字。

---

# 2026-04-08 業務部搜尋功能優化：買斷選項遷移至進階搜尋

## 摘要
將業務部搜尋合約模組中「一般搜尋」的買斷選項移動至「簡目頁」的進階搜尋中，以精簡主搜尋介面並強化進階篩選功能。

## 詳細變更內容

### 1. 搜尋表單簡化
- [修改] `src/features/business/search/BusinessSearchContract.tsx`: 
    - 從主搜尋表單中移除「買斷」選擇欄位。
    - 移除日期區間中受買斷狀態影響的顯示與參數過濾邏輯。

### 2. 進階篩選功能增強
- [修改] `src/features/business/search/BusinessSearchResults.tsx`: 
    - 在 `FilterDrawer` 的「採購內容」區塊中新增「買斷」篩選器。
    - 更新 `filteredContracts` 篩選邏輯，支援「買斷」狀態 (`isBuyout`) 的本地端即時篩選。

---

# 2026-04-08 業務部模擬資料精製：買斷合約規範調整與產品名稱統一

## 摘要
依據業務規範，調整業務部買斷合約的資料結構，並將所有模擬資料中的採購產品項目更新為與系統設定一致的縮寫名稱。

## 詳細變更內容

### 1. 買斷合約結構調整
- [修改] `src/data/mockBusinessContracts.ts`: 將 ID 為 `B005` 的買斷合約 `contractEndDate` 設為空字串，符合買斷合約無履約結束日之業務邏輯。

### 2. 產品項目名稱統一
- [修改] `src/data/mockBusinessContracts.ts`: 將所有模擬資料中的 `productName` 更新為與 `BusinessParameterSettings` 一致的產品縮寫（例：`AL`, `CEPS`, `CETD`, `ABC`, `PRO`, `SYMSKAN`）。

---

# 2026-04-08 業務部模擬資料更新：新增買斷合約與產品項目調整

## 摘要
更新業務部模擬資料，新增一筆永久授權買斷合約，並調整所有模擬資料的採購產品項目為具體的華藝產品名稱，以提升測試資料的擬真度。

## 詳細變更內容

### 1. 模擬資料擴充與優化
- [新增] `src/data/mockBusinessContracts.ts`: 新增 ID 為 `B005` 的合約，設定 `isBuyout: '是'`，代表永久授權買斷專案。
- [修改] `src/data/mockBusinessContracts.ts`: 調整現有合約 `B001` 至 `B004` 的 `productName`：
  - `B001`: `['華藝電子書', 'Airiti Library']`
  - `B002`: `['華藝學術引用資料庫', 'CJTD中文期刊庫']`
  - `B003`: `['ClinicalKey', 'UpToDate']`
  - `B004`: `['TEPS臺灣全文資料庫']`

---

# 2026-04-08 業務部模組維護：修復多項 TypeScript 型別錯誤與編譯警告

...
