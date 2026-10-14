const { DEFAULT_STOCKS } = require('../../utils/stockCatalog');

const normalizeSymbol = (rawSymbol) => String(rawSymbol || '').trim().toUpperCase().replace(/\.(NS|BO)$/, '');

const resolveSymbol = (rawSymbol, exchange = 'NSE') => {
  const raw = String(rawSymbol || '').trim().toUpperCase();
  const explicitExchange = raw.endsWith('.BO') ? 'BSE' : raw.endsWith('.NS') ? 'NSE' : exchange;
  const symbol = normalizeSymbol(raw);
  const catalogItem = DEFAULT_STOCKS.find((item) => item.symbol === symbol);
  if (catalogItem && !raw.endsWith('.BO')) return { symbol, providerSymbol: catalogItem.yahooSymbol, exchange: catalogItem.exchange };
  if (raw.endsWith('.NS') || raw.endsWith('.BO')) return { symbol, providerSymbol: `${symbol}.${explicitExchange === 'BSE' ? 'BO' : 'NS'}`, exchange: explicitExchange };
  if (symbol.includes('.')) return { symbol, providerSymbol: symbol, exchange: explicitExchange };
  const isUsSymbol = ['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NFLX', 'AMD', 'INTC'].includes(symbol);
  return { symbol, providerSymbol: isUsSymbol ? symbol : `${symbol}.${explicitExchange === 'BSE' ? 'BO' : 'NS'}`, exchange: explicitExchange };
};

module.exports = { normalizeSymbol, resolveSymbol };