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
