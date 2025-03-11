const state = {
  limits: { BTC: 3, ETH: 3, USDT: 3 },
  initialLimit: 3
};

const formatNumber = (num) => 
  num?.toLocaleString('en-US', { maximumFractionDigits: 0 }) || 'N/A';

const createCard = (item) => `
  <div class="card">
    <h3>${item.project || 'Unknown'}</h3>
    <p>APY: <b>${item.apy?.toFixed(2) ?? 'N/A'}%</b></p>
    <p>TVL: $${formatNumber(item.tvlUsd)}</p>
  </div>
`;

const renderData = (data) => {
  const dashboard = document.querySelector('.dashboard');
  dashboard.innerHTML = '';

  ['BTC', 'ETH', 'USDT'].forEach(symbol => {
    const column = document.createElement('div');
    column.className = 'column';
    column.innerHTML = `
      <h2 class="column-title ${symbol.toLowerCase()}">${symbol}</h2>
      <div class="coin-container"></div>
    `;

    const container = column.querySelector('.coin-container');
    const items = data
      .filter(item => item.symbol?.toUpperCase() === symbol)
      .sort((a, b) => (b.apy || 0) - (a.apy || 0))
      .slice(0, state.limits[symbol]);

    container.innerHTML = items.map(createCard).join('');

    if (items.length >= state.initialLimit) {
      const btn = document.createElement('button');
      btn.className = `toggle-btn ${state.limits[symbol] > state.initialLimit ? 'collapse' : ''}`;
      btn.textContent = state.limits[symbol] > state.initialLimit ? 'Скрыть' : 'Показать ещё';
      btn.onclick = () => {
        state.limits[symbol] = btn.classList.contains('collapse') 
          ? state.initialLimit 
          : state.limits[symbol] + 3;
        renderData(data);
      };
      container.appendChild(btn);
    }

    dashboard.appendChild(column);
  });
};

// Загрузка данных
fetch('http://localhost:3001/api/yields')
  .then(response => response.json())
  .then(renderData)
  .catch(error => console.error('Ошибка:', error));

// Автообновление каждые 5 минут
setInterval(() => {
  fetch('http://localhost:3001/api/yields')
    .then(response => response.json())
    .then(renderData)
    .catch(console.error);
}, 300000);