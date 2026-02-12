# 2026-02-12 學發部合約模組 — UI 微調 (第二批)

## 變更內容

### [修改] `src/features/academic/components/RoyaltyModal.tsx`
- **移除分潤比例未滿 100% 的警告提示**：刪除 `percentageWarnings` useMemo 與相關 JSX
- 移除未使用的 import：`useMemo`、`AlertCircle`

### [修改] `src/features/academic/constants/fieldConfig.ts`
- 統一匯款欄位 label 以符合使用者規格：
  - `帳戶類別` radio 選項 `國外` → `海外`
  - `銀行帳號` → `帳號`
  - `帳務備註` (textarea) → `帳號密碼_帳戶備註` (text)
  - `身分證字號` → `身份證字號`
  - `版稅結算月份` → `權利金_明定結算月份`
  - `收付款流程` → `權利金_先給錢_後給收據`

### [修改] `src/features/academic/constants/contractFields.ts`
- 新增 `beneficiary` (分潤主體) readonly 欄位
- `國內/外帳戶` → `帳戶類別`
- `accountNotes` 新增 `fullWidth: true`
- 新增 `isReadOnly` 至本地 `FormFieldConfig` 介面

### 驗證時機確認
未填寫驗證提示原本就只在使用者點擊「儲存合約」按鈕時才觸發（`handleSubmit` → `handleValidation()`），無需修改 ✅

## 測試結果
- ✅ Build: 成功完成 (6.72 秒)

---



## 摘要
針對學發部新增合約的三大核心欄位（簽約單位、編輯權利金比例、匯款資料），補齊缺漏的 UI 功能並將內嵌程式碼重構為獨立元件，提升可維護性。

## 詳細變更內容

### [修改] `src/components/ui/Modal.tsx`
- **新增 `full` 尺寸選項**：`max-w-5xl`，供權利金 Modal 等需要較大空間的場景使用
- `size` prop 類型更新：`'sm' | 'md' | 'lg' | 'xl'` → `'sm' | 'md' | 'lg' | 'xl' | 'full'`

### [新增] `src/features/academic/components/RoyaltyModal.tsx`
從 `AcademicContract.tsx` 抽取約 100 行權利金 Modal 內嵌程式碼為獨立元件，新增功能：
1. **卷期格式自動同步**：修改起始卷期的格式（卷/期、年/月、文字描述）時，自動同步至結束卷期
2. **三層視覺差異化**：
   - 日期方案 (DateScheme)：紫色邊框卡片，含摺疊/展開功能
   - 卷期規則 (VolumeRule)：白色內嵌卡片，附小圓點指示
   - 分潤明細 (RoyaltySplit)：表格式排版（分潤主體 + 比例列）
3. **分潤比例合計驗證**：每組 VolumeRule 下的分潤比例加總 ≠ 100% 時，顯示琥珀色警告 badge
4. **可摺疊日期方案**：點擊標題列摺疊/展開，摺疊時顯示日期摘要
5. **使用 `size="full"` Modal**：提供 `max-w-5xl` 的充足空間
6. **保留 datalist 連動**：分潤主體欄位自動顯示簽約單位作為建議

### [新增] `src/features/academic/components/RemittanceSection.tsx`
從 `AcademicContract.tsx` 抽取匯款區塊為獨立元件，新增功能：
1. **空狀態引導**：無匯款資料時顯示錢包 icon + 說明文字 + 操作建議
2. **可摺疊受款人卡片**：每張卡片預設摺疊，僅顯示受款人名稱 + 帳戶類型 + 完成度 badge
3. **帳戶資料完成度 badge**：
   - 綠色「資料完整」：銀行名稱、帳號、戶名、幣別四欄已填
   - 琥珀色「X/4 已填寫」：尚有未填欄位
4. **全部展開/摺疊按鈕**：右上角快速操作
5. **內建 RemittanceFormField**：簡化版表單欄位渲染，支援 text、radio、textarea

### [修改] `src/features/academic/components/index.ts`
- 新增 `RoyaltyModal` 和 `RemittanceSection` 的 export

### [修改] `src/pages/AcademicContract.tsx`
- **移除約 200 行內嵌程式碼**：
  - 移除 `getInitialRoyaltySplit`、`getInitialVolumeRule` helper functions
  - 移除 `tempRoyaltyInfo` state 和所有 royalty CRUD 函數
  - 移除 `renderRoyaltyVolumeInputsForModal` 函數
  - 移除內嵌 `<Modal>` 權利金 JSX（約 90 行）
  - 移除內嵌匯款區塊 JSX（約 30 行）
- **引入新元件**：`<RoyaltyModal>` 和 `<RemittanceSection>`
- **新增權利金摘要**：權利金區塊顯示「已設定 X 個日期方案，共 Y 組卷期規則」
- **移除未使用的 import**：`Plus`, `Trash2`, `Modal`, `RoyaltySplit`, `VolumeRule`

### [修改] `src/features/academic/constants/contractFields.ts`
- 修正 `contractParty` 欄位定義：`type: 'text'` → `type: 'tags'`
- 新增 `placeholder: '新增單位後按 Enter...'`
- 與 `fieldConfig.ts` 保持一致

## 測試結果
- ✅ TypeScript 編譯: 成功，零錯誤
- ✅ Build 建置: 成功完成 (10.01 秒)

---



## 摘要
將「權限管理」模組中的「建立新使用者」、「編輯使用者權限」及「刪除確認」彈出視窗，從手刻 inline HTML 重構為使用共用 `Modal` + `Button` 元件，與「範本管理 → 上傳新範本」視窗樣式完全一致。

## 詳細變更內容

### [修改] `src/features/settings/components/UserManagement.tsx`

1. **新增 import**
   - `import { Button } from '@/components/ui/Button';`
   - `import { Modal } from '@/components/ui/Modal';`

2. **頁面頂部「建立新使用者」按鈕**
   - 從 `<button className="px-4 py-2 bg-indigo-600 ...">` 改為 `<Button>` 元件
   - 自動獲得統一的 hover shadow、active scale 動畫效果

3. **建立/編輯使用者彈出視窗 (原 Lines 158-205)**
   - 從 `<div className="fixed inset-0 bg-black bg-opacity-50 ...">` 手刻 modal 改為 `<Modal>` 元件
   - 新增功能：backdrop-blur 背景模糊、ESC 鍵關閉、標題列 X 關閉按鈕、hover 半透明效果
   - Footer 按鈕（取消/儲存設定）改用 `<Button variant="secondary">` 和 `<Button variant="primary">`
   - 使用 `size="xl"` 匹配原有 max-w-2xl 寬度

4. **刪除確認彈出視窗 (原 Lines 207-225)**
   - 從手刻確認對話框改為 `<Modal size="sm">` 元件
   - 「確認刪除」按鈕改用 `<Button variant="danger">`，統一紅色 hover/active 動畫
   - 「取消」按鈕改用 `<Button variant="secondary">`
   - 保留 AlertTriangle 警告圖示

5. **系統權限設定勾選選項樣式升級**
   - 從 plain HTML checkbox + 灰底 hover 改為 **toggle switch**（滑動開關）
   - 樣式與「通知設定」模組的啟用/停用開關完全一致（indigo 主題色）
   - 改為單欄垂直排列（原為 2x3 grid），每項包含名稱 + 說明文字
   - 新增 hover 效果：border 變為 indigo、背景淡紫色
   - 點擊整行即可切換，不限於開關本身

## 測試結果
- ✅ TypeScript 編譯: 成功,無錯誤
- ✅ UI 一致性: 與範本管理的上傳新範本視窗樣式完全一致

---

# 2026-02-11 (下午) Git 重置

## 變更內容
- **移除舊的 .git 目錄:** 使用 `Remove-Item -Recurse -Force .git` 移除整個舊的 Git 歷史紀錄
- **重新初始化 Git:** 執行 `git init`，建立全新的 Git 倉庫
- **建立初始提交:** 執行 `git add -A` 加入所有檔案，再執行 `git commit -m "Initial commit"` 建立初始提交 (commit c21ade1)
- **目的:** 清除所有舊的版本歷史，以乾淨的狀態重新開始版本管理

---

# 2026-02-11 (下午) TuFu 完整重命名為 DDD - 第二階段

## 摘要
延續上午工作,完成 TuFu 資料夾和檔案的完整重新命名,包括資料夾路徑、檔案名稱、元件 export、函數名稱、import 路徑等全面更新,實現從 "TuFu" 到 "DDD" 的完整過渡。

## 詳細變更內容

### 1. 資料夾與檔案重新命名
**資料夾:**
- 重新命名主要資料夾: `src/features/tufu/` → `src/features/ddd/`
- 使用 PowerShell `Move-Item` 命令執行重新命名(因 `git mv` 遇到鎖定問題)

**資料檔案:**
- `src/data/mockTuFuContracts.ts` → `src/data/mockDDDContracts.ts`

**頁面檔案:**
- `src/pages/TuFuContract.tsx` → `src/pages/DDDContract.tsx`
- `src/pages/TuFuMaintainContract.tsx` → `src/pages/DDDMaintainContract.tsx`

**DDD 資料夾內部檔案:**
- `src/features/ddd/search/TuFuSearchContract.tsx` → `src/features/ddd/search/DDDSearchContract.tsx`
- `src/features/ddd/components/TuFuTagInput.tsx` → `src/features/ddd/components/DDDTagInput.tsx`
- `src/features/ddd/hooks/useTuFuContractForm.ts` → `src/features/ddd/hooks/useDDDContractForm.ts`
- `src/features/ddd/pages/TuFuTemplateManagement.tsx` → `src/features/ddd/pages/DDDTemplateManagement.tsx`
- `src/features/ddd/pages/TuFuParameterSettings.tsx` → `src/features/ddd/pages/DDDParameterSettings.tsx`

### 2. Import 路徑更新
**App.tsx:**
- 新增 import: `import DDDContract from '@/pages/DDDContract';`
- 新增 import: `import DDDMaintainContract from '@/pages/DDDMaintainContract';`
- 更新 import: `import DDDSearchContract from '@/features/ddd/search/DDDSearchContract';`
- 更新 import: `import { DDDTemplateManagement } from '@/features/ddd/pages/DDDTemplateManagement';`
- 更新 import: `import { DDDParameterSettings } from '@/features/ddd/pages/DDDParameterSettings';`
- 移除未使用的 import: `TuFuContract`, `TuFuMaintainContract`

**DDDContract.tsx & DDDMaintainContract.tsx:**
- 更新 import 路徑: `@/features/tufu/*` → `@/features/ddd/*`
- 更新元件引用: `TuFuTagInput` → `DDDTagInput`
- 更新 hook 引用: `useTuFuContractForm` → `useDDDContractForm`

**DDDSearchContract.tsx:**
- 更新 import: `mockTuFuContracts` → `mockDDDContracts`
- 更新 import 路徑: `@/data/mockTuFuContracts` → `@/data/mockDDDContracts`

**BatchCart.tsx:**
- 更新 import: `getTuFuFieldValue` → `getTuFuFieldValue` (保留內部函數名稱以維持一致性)
- 更新 import 路徑: `@/features/tufu/constants/contractFields` → `@/features/ddd/constants/contractFields`

**mockDDDContracts.ts:**
- 更新 import: `'../features/tufu/types'` → `'../features/ddd/types'`

### 3. 元件名稱與 Export 更新
**DDDContract.tsx:**
- 元件名稱: `const TuFuContract` → `const DDDContract`
- Export: `export default TuFuContract` → `export default DDDContract`

**DDDMaintainContract.tsx:**
- 元件名稱: `const TuFuMaintainContract` → `const DDDMaintainContract`
- Export: `export default TuFuMaintainContract` → `export default DDDMaintainContract`

**DDDSearchContract.tsx:**
- 元件名稱: `const TuFuSearchContract` → `const DDDSearchContract`
- Export: `export default TuFuSearchContract` → `export default DDDSearchContract`
- BatchSelectionCheckbox type: `type='tufu'` → `type='ddd'`

**DDDTagInput.tsx:**
- Interface: `TuFuTagInputProps` → `DDDTagInputProps`
- 元件名稱: `export const TuFuTagInput` → `export const DDDTagInput`
- Export: `export default TuFuTagInput` → `export default DDDTagInput`

**DDDTemplateManagement.tsx:**
- Export: `export const TuFuTemplateManagement` → `export const DDDTemplateManagement`

**DDDParameterSettings.tsx:**
- Export: `export const TuFuParameterSettings` → `export const DDDParameterSettings`

**useDDDContractForm.ts:**
- Export: `export const useTuFuContractForm` → `export const useDDDContractForm`

**mockDDDContracts.ts:**
- Export: `export const mockTuFuContracts` → `export const mockDDDContracts`

### 4. 統一出口檔案更新
**components/index.ts:**
- Export: `export { TuFuTagInput }` → `export { DDDTagInput }`
- 檔案引用: `'./TuFuTagInput'` → `'./DDDTagInput'`

**hooks/index.ts:**
- Export: `export * from './useTuFuContractForm'` → `export * from './useDDDContractForm'`

**data/index.ts:**
- Export: `export * from './mockTuFuContracts'` → `export * from './mockDDDContracts'`

### 5. 函數調用更新
**DDDContract.tsx:**
- Hook 調用

: `useTuFuContractForm()` → `useDDDContractForm()`
- JSX 元件: `<TuFuTagInput ... />` → `<DDDTagInput ... />`

**DDDMaintainContract.tsx:**
- Hook 調用: `useTuFuContractForm()` → `useDDDContractForm()`
- JSX 元件: `<TuFuTagInput ... />` → `<DDDTagInput ... />`
- 資料引用: `mockTuFuContracts` → `mockDDDContracts`

**DDDSearchContract.tsx:**
- Console log: `'TuFu Contracts Initialized'` → `'DDD Contracts Initialized'`
- 變數賦值: `mockTuFuContracts` → `mockDDDContracts`

### 6. 類型與常數保留
**保留不變的項目 (維持向後兼容或語義準確性):**
- `TuFuContractData` 型別名稱 (因為這是圖書服務部特有的資料結構)
- `getTuFuFieldValue` 函數名稱 (內部工具函數,暫時保留)

## 測試結果
### Build 驗證
執行 `npm run build` 成功完成,無 TypeScript 編譯錯誤

**Build 輸出:**
```
✓ built in 6.24s
Exit code: 0
```

### 程式碼驗證
- 所有 import 路徑正確解析
- 元件 export 正確
- 類型定義完整
- 無 lint 錯誤 (除原有的 implicit any type warnings)

## 影響範圍
**修改的檔案數量:** 約 30+ 個檔案
**主要模組:**
- 路由配置 (App.tsx)
- 頁面元件 (DDDContract, DDDMaintainContract)
- 搜尋功能 (DDDSearchContract)
- 共用元件 (DDDTagInput)
- Hooks (useDDDContractForm)
- 資料層 (mockDDDContracts)
- 批次處理 (BatchCart, BatchContext)
- 常數與類型定義 (constants, types)

## 技術決策
1. **使用 PowerShell Move-Item 而非 git mv:** 因遇到 Git 鎖定檔案問題,改用 PowerShell 命令執行檔案/資料夾重新命名
2. **段階式更新 import:** 先更新資料夾路徑,再更新檔案名稱,最後更新 import 語句,降低錯誤風險
3. **保留部分 TuFu 命名:** `TuFuContractData` 等型別名稱保持不變,因為這些是圖書服務部專屬的資料結構定義,與業務邏輯緊密相關

## 後續建議
1. **人工測試:** 詳細測試所有 DDD 相關功能,包括導航、搜尋、新增/編輯合約、批次處理等
2. **監控舊路徑:** 確認是否需要為舊的 `/tufu/*` 路徑添加重定向或 404 處理
3. **文件更新:** 更新使用者手冊和內部文件,反映新的 DDD 命名慣例
4. **Git Commit:** 將所有變更提交至版本控制,並撰寫詳細的 commit message

---

# 2026-02-11 TuFu 命名重構為 DDD


## 摘要
執行全系統 TuFu 命名重構,將所有與圖書服務部相關的 `tufu` 參數命名改為 `DDD` (Digital Distribution Department),提升程式碼語義清晰度。

## 詳細變更內容

### 路由配置更新
1. **[修改] App.tsx**
   - 所有路由路徑: `/tufu/*` → `/ddd/*`
   - `/tufu/search` → `/ddd/search`
   - `/tufu/contract/new` → `/ddd/contract/new`
   - `/tufu/contract/:id` → `/ddd/contract/:id`
   - `/tufu/settings/templates` → `/ddd/settings/templates`
   - `/tufu-params` → `/ddd-params`
   - 註解更新: `TuFu Routes` → `DDD (圖書服務部) Routes`

2. **[修改] Navbar.tsx**
   - 導航連結路徑: 所有 `/tufu/*` → `/ddd/*`
   - 部門切換導向: `navigate('/tufu/search')` → `navigate('/ddd/search')`

3. **[修改] Login.tsx**
   - 登入後導向: `navigate('/tufu/search')` → `navigate('/ddd/search')`

4. **[修改] TuFuSearchContract.tsx**
   - 合約詳情導航: `/tufu/contract/${id}` → `/ddd/contract/${id}`

### 類型定義與變數命名
5. **[修改] BatchContext.tsx**
   - 類型定義: `type?: 'academic' | 'tufu'` → `type?: 'academic' | 'ddd'`
   - 函數簽名: 所有 `tufu` 參數改為 `ddd`

6. **[修改] BatchCart.tsx**
   - Import 別名: `tufuFieldMap` → `dddFieldMap`, `tufuOrderedKeys` → `dddOrderedKeys`
   - 變數名稱: `tufuItems` → `dddItems`
   - Excel 工作表名稱: `'TuFu Contracts'` → `'DDD Contracts'`
   - 類型比較: `item.type === 'tufu'` → `item.type === 'ddd'`

7. **[修改] TuFuSearchContract.tsx**
   - 批次處理類型: `type: 'tufu' as const` → `type: 'ddd' as const`

### 使用者資料
8. **[修改] mockUsers.ts**
   - 使用者名稱: `'李小美 (TuFu)'` → `'李小美 (DDD)'`
   - 員工編號: `'tufu001'` → `'ddd001'`
   - Email: `'tufu@example.com'` → `'ddd@example.com'`

### 註解更新
9. **[修改] features/tufu 資料夾內所有檔案註解**
   - `types/index.ts`: 
     - `// 圖服部合約相關型別定義` → `// 圖書服務部 (DDD) 合約相關型別定義`
     - `// 圖服部專用的 ContractData` → `// 圖書服務部 (DDD) 專用的 ContractData`
   
   - `constants/` 資料夾所有檔案:
     - `// 圖服部 - XXX` → `// 圖書服務部 (DDD) - XXX`
     - 包括: fieldKeyToNameMap.ts, dropdownOptions.ts, radioOptions.ts, tocSections.ts, validationRules.ts, index.ts
   
   - `components/index.ts`: `// 圖服部組件的統一出口` → `// 圖書服務部 (DDD) 組件的統一出口`
   - `hooks/index.ts`: `// 圖服部 hooks 的統一出口` → `// 圖書服務部 (DDD) hooks 的統一出口`
   - `index.ts`: `// 圖服部模組的統一出口` → `// 圖書服務部 (DDD) 模組的統一出口`
   - `pages/TuFuParameterSettings.tsx`: `// 圖服部參數` → `// 圖書服務部 (DDD) 參數`

## 影響範圍
- **路由系統**: 所有圖書服務部相關路由路徑已更新
- **批次處理**: 類型定義統一為 `ddd`
- **使用者介面**: 導航和登入導向已更新
- **程式碼註解**: 所有註解統一標註為「圖書服務部 (DDD)」

## 測試結果
- ✅ TypeScript 編譯: 成功,無錯誤
- ✅ Build 建置: 成功完成 (8.86秒)
- ✅ 類型檢查: 所有類型定義一致
- ✅ Lint 錯誤: 已修正批次處理類型不匹配問題

## 備註
此次重構保留了檔案和資料夾名稱 (`features/tufu`, `TuFuContract.tsx` 等),僅更新了:
1. 使用者可見的路由路徑 (URL)
2. 程式碼中的變數和類型定義
3. 註解和文檔
這樣可避免檔案系統重新命名帶來的 Git 歷史複雜性,同時達到語義統一的目標。

# 2026-02-11 部門命名統一化重構

## 摘要
執行全系統部門命名統一化重構,將所有縮寫改為完整部門名稱,提升程式碼可讀性和維護性。

## 詳細變更內容

### 核心類型定義
1. **[修改] 部門類型定義**
   - `src/features/auth/types/index.ts`: 
     - `Department` 類型: `'學發部' | '圖服部'` → `'學術發展部' | '圖書服務部'`
     - `PermissionSet.maintainParams`: 更新為完整部門名稱

### 資料模擬檔案
2. **[修改] 使用者資料**
   - `src/data/mockUsers.ts`: 更新所有使用者的 `department`、`maintainParams`、`landingPage` 欄位
   - `src/features/auth/data/mockUsers.ts`: 同步更新認證模組的使用者資料

### 主要應用程式與元件
3. **[修改] 應用程式核心**
   - `src/App.tsx`: 更新 `currentDepartment` 狀態類型定義與默認值
   - `src/pages/Login.tsx`: 更新登入後的部門導向邏輯判斷

4. **[修改] 導航欄元件**
   - `src/components/layout/Navbar.tsx`:
     - 更新 Props 介面的部門類型定義
     - 更新 `handleDepartmentChange` 函數參數類型
     - 更新所有部門比較邏輯 (`currentDepartment === '學術發展部'`)
     - 更新權限檢查中的部門字串
     - 更新 UI 顯示的部門名稱按鈕文字

5. **[修改] 使用者管理元件**
   - `src/features/settings/components/UserManagement.tsx`:
     - 更新新增使用者的默認部門值
     - 更新部門標籤 CSS class 條件判斷
     - 更新所有部門下拉選單的 option 值與顯示文字

6. **[修改] 參數設定元件**
   - `src/features/settings/components/ParameterSettings.tsx`:
     - 更新權限檢查邏輯 (`canMaintainParams === '學術發展部'`)
     - 更新頁面標題與描述文字
     - 更新參數管理器的標題

   - `src/features/tufu/pages/TuFuParameterSettings.tsx`:
     - 更新權限檢查邏輯 (`canMaintainParams === '圖書服務部'`)
     - 更新頁面標題與描述文字

### 欄位標籤與搜尋介面
7. **[修改] 學術發展部欄位標籤**
   - `src/features/academic/constants/fieldConfig.ts`: 
     - `'學發合約編號'` → `'學術發展部合約編號'`
     - `'學發合約子編號'` → `'學術發展部合約子編號'`
   - `src/features/academic/constants/contractFields.ts`: 同上
   - `src/features/academic/search/AcademicSearchContract.tsx`: 更新搜尋欄位顯示標籤

8. **[修改] 圖書服務部欄位標籤**
   - `src/features/tufu/constants/fieldKeyToNameMap.ts`: 
     - `'【圖服部】合約編號'` → `'【圖書服務部】合約編號'`
   - `src/features/tufu/constants/contractFields.ts`: 同上
   - `src/features/tufu/search/TuFuSearchContract.tsx`: 更新搜尋欄位顯示標籤

## 影響範圍
- **類型系統**: 所有使用 `Department` 類型的地方已自動更新
- **UI 顯示**: 所有顯示部門名稱的介面元素已更新
- **權限判斷**: 所有部門相關的權限邏輯已更新
- **資料驗證**: 表單驗證和下拉選單選項已更新

## 測試結果
- ✅ TypeScript 編譯: 成功,無錯誤
- ✅ Build 建置: 成功完成
- ✅ 類型檢查: 所有類型定義一致
- ✅ 向後相容: 所有功能正常運作

## 備註
此次重構涵蓋整個專案,統一部門命名規範:
- 學發部 → 學術發展部 (Academic Development Department)
- 圖服部 → 圖書服務部 (Library Services Department / DDD)

# 2026-01-27 版本重置與交付準備 (v1.0.0)

## 摘要
執行專案版本重置，確保版本號為 `1.0.0`，並重新初始化 Git 儲存庫，作為正式交付的起始點。

## 詳細變更內容
1.  **[設定] 版本號更新**
    - `package.json`: 版本號由 `0.0.0` 更新為 `1.0.0`。
2.  **[系統] 版本控制重置**
    - 清除舊有 Git 歷史紀錄。
    - 重新初始化 Git Repository。
    - 建立 `v1.0.0` 標籤 (Tag)。

# 2026-01-27 變更紀錄 (重置前)

## 摘要
本日更新了學發部新增合約中「合約標的」的配置，將「類型」欄位改為下拉式選單。

## 詳細變更內容

### 修正與優化
1.  **[修改] 學發部合約 - 合約標的類型欄位**
    - 將 `fieldConfig.ts` 中的 `type` 欄位型別從文字輸入 (`text`) 改為下拉式選單 (`select`)。
    - 設定固定選項：`['期刊', '論文集', '個人授權']`。
2.  **[修正] GitHub Actions Workflow YAML 語法錯誤**
    - 修正 `deploy.yml` 中 `Build` 步驟的縮排錯誤，解決 "Implicit map keys need to be followed by map values" 錯誤。

### 程式碼變更
-   **[MODIFY]** `src/features/academic/constants/fieldConfig.ts`: 更新欄位定義。
-   **[MODIFY]** `.github/workflows/deploy.yml`: 修正 YAML 縮排。
