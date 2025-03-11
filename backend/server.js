const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Разрешить все CORS-запросы
app.use(cors({ origin: '*' }));

// API для получения данных
app.get('/api/yields', async (req, res) => {
  try {
    const response = await axios.get('https://yields.llama.fi/pools');
    const data = response.data.data.filter(item => 
      ['BTC', 'ETH', 'USDT'].includes(item.symbol?.toUpperCase())
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: 'Ошибка при получении данных',
      details: error.message 
    });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});