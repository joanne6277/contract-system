# 2026-04-23 業務部搜尋功能優化：進階篩選欄位類型調整

## 摘要
調整業務部進階篩選彈窗的控制項類型，將買斷與採購模式改為勾選框，屬性與採購項目改為下拉選單，並優化對應的過濾邏輯以支援複選與精確篩選。

## 詳細變更內容

### 1. 進階篩選彈窗 UI 更新
- [修改] `src/features/business/search/BusinessSearchResults.tsx`:
    - 「買斷」與「採購模式」：由下拉選單改為 **勾選框 (Checkbox Group)**，支援同時勾選多個選項進行「或 (OR)」邏輯篩選。
    - 「屬性」：由文字輸入改為 **下拉選單 (FilterSelect)**，選項固定為「機構、醫院、學校、公圖」。
    - 「採購項目」：由文字輸入改為 **下拉選單 (FilterSelect)**，選項固定為常用產品縮寫（如 AL, CEPS, ABC 等）。

### 2. 過濾邏輯優化
- [修改] `src/features/business/search/BusinessSearchResults.tsx`:
    - 更新 `filteredContracts` 中的過濾條件：
        - `isBuyout` 與 `mode`：改用 `Array.includes` 檢查，支援勾選框複選過濾。
        - `attribute`：改為精確匹配。
        - `productName`：檢查合約內的產品清單是否包含選中的單一產品項目。

---

# 2026-04-23 業務部搜尋功能優化：進階篩選彈窗欄位調整與功能增強

## 摘要
優化業務部進階篩選彈窗（FilterDrawer），依照業務需求移除標題區塊與業務人員欄位，新增採購年份與具備比較運算功能的採購金額篩選，並同步更新篩選邏輯。

## 詳細變更內容

### 1. 進階篩選彈窗 UI 調整
- [修改] `src/features/business/search/BusinessSearchResults.tsx`:
    - 移除 `FilterDrawer` 的標題區塊（Header）與標題文字「進階篩選」。
    - 移除「基本資料」區塊中的「業務」(`salesperson`) 篩選欄位。
    - 在「基本資料」區塊中新增「採購年份」(`purchasingYear`) 文字篩選。
    - 在「採購內容」區塊中新增「採購金額」篩選：
        - 導入下拉選單支援「大於」、「小於」、「介於」運算子。
        - 支援單一金額輸入或「介於」模式下的最小值與最大值區間輸入。

### 2. 篩選邏輯優化
- [修改] `src/features/business/search/BusinessSearchResults.tsx`:
    - 更新 `filteredContracts` 的 `useMemo` 邏輯。
    - 新增對 `purchasingYear` 的字串模糊匹配支援。
    - 實作「採購金額」的數值比較邏輯，包含金額格式化（去除逗號）與運算子分支處理。

---

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
    - 支援編輯模式：新增 `useEffect`依 `id` 讀取合約資料。
    - 實作變更追蹤：在 `handleSubmit` 時比較 `originalData` 與 `formData`。
    - 自動產生紀錄：
        - 新增合約時，自動記錄「合約建檔」。
        - 編輯合約時，自動比對並記錄所有異動欄位及其新舊值。
    - 優化訊息回饋：區分新增與更新成功後的提示文字。

...
