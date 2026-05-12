import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 資料庫檔案位置
const dbPath = path.join(__dirname, 'db', 'sqlite.db');

// 開啟資料庫
// 如果資料庫不存在，sqlite3.Database 會自動建立它
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('無法開啟資料庫:', err.message);
  } else {
    console.log('已成功連接到 SQLite 資料庫:', dbPath);
    // 建立資料表 (如果不存在)
    db.run(`CREATE TABLE IF NOT EXISTS cola_prices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      product_name TEXT NOT NULL,
      price REAL NOT NULL
    )`, (err) => {
      if (err) {
        console.error('建立資料表失敗:', err.message);
      } else {
        console.log('資料表 cola_prices 已就緒');
        
        // 檢查是否已有資料，若無則新增預設資料
        db.get(`SELECT COUNT(*) as count FROM cola_prices`, (err, row) => {
          if (!err && row.count === 0) {
            const insert = 'INSERT INTO cola_prices (date, product_name, price) VALUES (?, ?, ?)';
            db.run(insert, ['1990', '600ml可樂', 18]);
            db.run(insert, ['2005', '600ml可樂', 25]);
            db.run(insert, ['2011', '600ml可樂', 29]);
            db.run(insert, ['2022', '600ml可樂', 35]);
            console.log('已新增預設可樂價格資料');
          }
        });
      }
    });
  }
});

export default db;
