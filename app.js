import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import db from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// 新增 API 路由
app.get('/api/insert', (req, res) => {
  const { date, product_name, price } = req.query;

  if (!date || !product_name || !price) {
    return res.status(400).json({ error: '缺少必要欄位 (date, product_name, price)' });
  }

  const stmt = db.prepare("INSERT INTO cola_prices (date, product_name, price) VALUES (?, ?, ?)");
  stmt.run(date, product_name, price, function(err) {
    if (err) {
      return res.status(500).json({ error: '新增資料失敗' });
    }
    res.json({ message: `資料新增成功！ ID: ${this.lastID}` });
  });
  stmt.finalize();
});

// 新增獲取所有可樂價格資料的 API
app.get('/api/quotes', (req, res) => {
  db.all("SELECT * FROM cola_prices", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: '讀取資料失敗' });
    }
    res.json(rows);
  });
});

export default app;
