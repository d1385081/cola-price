# 肥宅快樂水 - 可樂歷年價格查詢系統實作紀錄 (OpenSpec)

本文檔記錄了「肥宅快樂水」專案的實作過程、技術架構與 API 規格。

## 1. 專案概述
本專案旨在建立一個輕量級的 Web 應用程式，用於追蹤與記錄可樂歷年的價格變化。使用者可以透過前端介面查詢歷史價格，並新增最新的價格資訊。

## 2. 技術棧 (Tech Stack)
- **Runtime**: Node.js
- **Framework**: Express.js (ES Modules)
- **Database**: SQLite3
- **Frontend**: HTML5, Vanilla JavaScript, Fetch API

## 3. 實作過程紀錄

### 第一階段：環境初始化與資料庫設定
1.  **專案結構建立**：初始化 Express 專案，並設定為 ESM (`"type": "module"`)。
2.  **資料庫配置 (`db.js`)**：
    *   使用 `sqlite3` 套件。
    *   自動建立 `db/` 目錄與 `sqlite.db` 檔案。
    *   實作 `CREATE TABLE IF NOT EXISTS cola_prices` 確保資料表結構（包含 `date`, `product_name`, `price`）。
    *   **Seed Data**：若資料表為空，自動插入 1990、2005、2011、2022 年的預設資料。

### 第二階段：後端 API 開發 (`app.js`)
實作兩組核心端點：
1.  **新增資料 (`GET /api/insert`)**：
    *   接收 Query Parameters：`date`, `product_name`, `price`。
    *   驗證欄位後寫入資料庫，回傳 JSON 格式的成功訊息與 ID。
2.  **讀取資料 (`GET /api/quotes`)**：
    *   從伺服器撈取所有 `cola_prices` 紀錄並以陣列形式回傳。

### 第三階段：前端介面開發 (`index.html`)
1.  **UI 界面設計**：以「肥宅快樂水」為主題，建立乾淨直觀的輸入表單。
2.  **動態互動**：
    *   使用 `async/await` Fetch API 發送請求。
    *   實作 **即時過濾功能**：透過 JavaScript 手法過濾 `allData` 陣列，使用者在搜尋框輸入文字時，表格會即時反應搜尋結果。
    *   表單送出後自動重新整理列表並重置輸入框。

## 4. API 規格說明

### 4.1 新增價格資訊
- **URL**: `/api/insert`
- **Method**: `GET`
- **Params**:
  - `date`: String (年分)
  - `product_name`: String (商品名稱)
  - `price`: Number/String (價格)
- **Success Response**: `{ "message": "資料新增成功！ ID: 5" }`

### 4.2 獲取價格列表
- **URL**: `/api/quotes`
- **Method**: `GET`
- **Success Response**: `[{ "id": 1, "date": "1990", "product_name": "600ml可樂", "price": 18 }, ...]`

## 5. 總結
本專案成功整合了前端展示與後端資料庫操作。透過 SQLite 的自動建立特性與 Express 的簡潔路由，達成了一個可擴充且易於維護的物價追蹤系統。
