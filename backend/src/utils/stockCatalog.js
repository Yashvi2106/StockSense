const DEFAULT_STOCKS = [
  { symbol: 'TCS', yahooSymbol: 'TCS.NS', companyName: 'Tata Consultancy Services Ltd', exchange: 'NSE', sector: 'Technology', industry: 'IT Services' },
  { symbol: 'INFY', yahooSymbol: 'INFY.NS', companyName: 'Infosys Ltd', exchange: 'NSE', sector: 'Technology', industry: 'IT Services' },
  { symbol: 'RELIANCE', yahooSymbol: 'RELIANCE.NS', companyName: 'Reliance Industries Ltd', exchange: 'NSE', sector: 'Energy', industry: 'Oil & Gas Refining' },
  { symbol: 'HDFCBANK', yahooSymbol: 'HDFCBANK.NS', companyName: 'HDFC Bank Ltd', exchange: 'NSE', sector: 'Financial Services', industry: 'Private Bank' },
  { symbol: 'ICICIBANK', yahooSymbol: 'ICICIBANK.NS', companyName: 'ICICI Bank Ltd', exchange: 'NSE', sector: 'Financial Services', industry: 'Private Bank' },
  { symbol: 'TATAMOTORS', yahooSymbol: 'TATAMOTORS.NS', companyName: 'Tata Motors Ltd', exchange: 'NSE', sector: 'Consumer Cyclical', industry: 'Auto Manufacturers' },
  { symbol: 'SBIN', yahooSymbol: 'SBIN.NS', companyName: 'State Bank of India', exchange: 'NSE', sector: 'Financial Services', industry: 'Public Bank' },
  { symbol: 'BHARTIARTL', yahooSymbol: 'BHARTIARTL.NS', companyName: 'Bharti Airtel Ltd', exchange: 'NSE', sector: 'Telecom', industry: 'Telecom Services' },
  { symbol: 'ITC', yahooSymbol: 'ITC.NS', companyName: 'ITC Ltd', exchange: 'NSE', sector: 'Consumer Defensive', industry: 'FMCG' },
  { symbol: 'WIPRO', yahooSymbol: 'WIPRO.NS', companyName: 'Wipro Ltd', exchange: 'NSE', sector: 'Technology', industry: 'IT Services' },
  { symbol: 'AAPL', yahooSymbol: 'AAPL', companyName: 'Apple Inc.', exchange: 'NASDAQ', sector: 'Technology', industry: 'Consumer Electronics' },
  { symbol: 'MSFT', yahooSymbol: 'MSFT', companyName: 'Microsoft Corporation', exchange: 'NASDAQ', sector: 'Technology', industry: 'Software' },
  { symbol: 'NVDA', yahooSymbol: 'NVDA', companyName: 'NVIDIA Corporation', exchange: 'NASDAQ', sector: 'Technology', industry: 'Semiconductors' },
  { symbol: 'GOOGL', yahooSymbol: 'GOOGL', companyName: 'Alphabet Inc.', exchange: 'NASDAQ', sector: 'Communication Services', industry: 'Internet Content' },
  { symbol: 'AMZN', yahooSymbol: 'AMZN', companyName: 'Amazon.com Inc.', exchange: 'NASDAQ', sector: 'Consumer Cyclical', industry: 'Internet Retail' },
  { symbol: 'TSLA', yahooSymbol: 'TSLA', companyName: 'Tesla Inc.', exchange: 'NASDAQ', sector: 'Consumer Cyclical', industry: 'Auto Manufacturers' }
];

const getNormalizedSymbol = (rawSymbol) => {
  if (!rawSymbol) return '';
  const clean = rawSymbol.trim().toUpperCase().replace(/\.NS$/, '').replace(/\.BO$/, '');
  return clean;
};

const getYahooSymbol = (symbol) => {
  const norm = getNormalizedSymbol(symbol);
  const found = DEFAULT_STOCKS.find((s) => s.symbol === norm);
  if (found) return found.yahooSymbol;

  // If already ends in .NS or .BO or is NASDAQ/NYSE ticker (typically 1-5 chars)
  if (symbol.includes('.')) return symbol;
  // If Indian style ticker (no dot and in known Indian exchanges or default to NSE if length > 4 and uppercase)
  const isUS = ['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NFLX', 'AMD', 'INTC'].includes(norm);
  return isUS ? norm : `${norm}.NS`;
};

module.exports = {
  DEFAULT_STOCKS,
  getNormalizedSymbol,
  getYahooSymbol
};
