const DEFAULT_STOCKS = [
  { symbol: 'TCS', yahooSymbol: 'TCS.NS', companyName: 'Tata Consultancy Services Ltd', exchange: 'NSE', sector: 'Technology', industry: 'IT Services', basePrice: 4120.50, peRatio: 29.8, fiftyTwoWeekHigh: 4592.25, fiftyTwoWeekLow: 3313.00, marketCap: 14900000000000 },
  { symbol: 'INFY', yahooSymbol: 'INFY.NS', companyName: 'Infosys Ltd', exchange: 'NSE', sector: 'Technology', industry: 'IT Services', basePrice: 1875.20, peRatio: 27.4, fiftyTwoWeekHigh: 1991.45, fiftyTwoWeekLow: 1358.35, marketCap: 7800000000000 },
  { symbol: 'RELIANCE', yahooSymbol: 'RELIANCE.NS', companyName: 'Reliance Industries Ltd', exchange: 'NSE', sector: 'Energy', industry: 'Oil & Gas Refining', basePrice: 2960.00, peRatio: 28.5, fiftyTwoWeekHigh: 3217.90, fiftyTwoWeekLow: 2220.30, marketCap: 20000000000000 },
  { symbol: 'HDFCBANK', yahooSymbol: 'HDFCBANK.NS', companyName: 'HDFC Bank Ltd', exchange: 'NSE', sector: 'Financial Services', industry: 'Private Bank', basePrice: 1665.40, peRatio: 19.2, fiftyTwoWeekHigh: 1794.00, fiftyTwoWeekLow: 1363.55, marketCap: 12600000000000 },
  { symbol: 'ICICIBANK', yahooSymbol: 'ICICIBANK.NS', companyName: 'ICICI Bank Ltd', exchange: 'NSE', sector: 'Financial Services', industry: 'Private Bank', basePrice: 1245.80, peRatio: 18.6, fiftyTwoWeekHigh: 1332.00, fiftyTwoWeekLow: 915.00, marketCap: 8700000000000 },
  { symbol: 'TATAMOTORS', yahooSymbol: 'TATAMOTORS.NS', companyName: 'Tata Motors Ltd', exchange: 'NSE', sector: 'Consumer Cyclical', industry: 'Auto Manufacturers', basePrice: 975.30, peRatio: 10.4, fiftyTwoWeekHigh: 1179.05, fiftyTwoWeekLow: 618.00, marketCap: 3500000000000 },
  { symbol: 'SBIN', yahooSymbol: 'SBIN.NS', companyName: 'State Bank of India', exchange: 'NSE', sector: 'Financial Services', industry: 'Public Bank', basePrice: 815.10, peRatio: 11.2, fiftyTwoWeekHigh: 912.00, fiftyTwoWeekLow: 543.15, marketCap: 7200000000000 },
  { symbol: 'BHARTIARTL', yahooSymbol: 'BHARTIARTL.NS', companyName: 'Bharti Airtel Ltd', exchange: 'NSE', sector: 'Telecom', industry: 'Telecom Services', basePrice: 1680.00, peRatio: 64.0, fiftyTwoWeekHigh: 1779.00, fiftyTwoWeekLow: 912.00, marketCap: 9900000000000 },
  { symbol: 'ITC', yahooSymbol: 'ITC.NS', companyName: 'ITC Ltd', exchange: 'NSE', sector: 'Consumer Defensive', industry: 'FMCG', basePrice: 495.25, peRatio: 28.1, fiftyTwoWeekHigh: 526.55, fiftyTwoWeekLow: 399.30, marketCap: 6100000000000 },
  { symbol: 'WIPRO', yahooSymbol: 'WIPRO.NS', companyName: 'Wipro Ltd', exchange: 'NSE', sector: 'Technology', industry: 'IT Services', basePrice: 535.40, peRatio: 24.3, fiftyTwoWeekHigh: 580.00, fiftyTwoWeekLow: 375.00, marketCap: 2800000000000 },
  { symbol: 'AAPL', yahooSymbol: 'AAPL', companyName: 'Apple Inc.', exchange: 'NASDAQ', sector: 'Technology', industry: 'Consumer Electronics', basePrice: 228.50, peRatio: 33.5, fiftyTwoWeekHigh: 237.23, fiftyTwoWeekLow: 164.08, marketCap: 3480000000000 },
  { symbol: 'MSFT', yahooSymbol: 'MSFT', companyName: 'Microsoft Corporation', exchange: 'NASDAQ', sector: 'Technology', industry: 'Software', basePrice: 425.80, peRatio: 35.8, fiftyTwoWeekHigh: 468.35, fiftyTwoWeekLow: 326.93, marketCap: 3160000000000 },
  { symbol: 'NVDA', yahooSymbol: 'NVDA', companyName: 'NVIDIA Corporation', exchange: 'NASDAQ', sector: 'Technology', industry: 'Semiconductors', basePrice: 132.40, peRatio: 52.4, fiftyTwoWeekHigh: 140.76, fiftyTwoWeekLow: 39.23, marketCap: 3250000000000 },
  { symbol: 'GOOGL', yahooSymbol: 'GOOGL', companyName: 'Alphabet Inc.', exchange: 'NASDAQ', sector: 'Communication Services', industry: 'Internet Content', basePrice: 165.20, peRatio: 23.4, fiftyTwoWeekHigh: 191.75, fiftyTwoWeekLow: 120.21, marketCap: 2040000000000 },
  { symbol: 'AMZN', yahooSymbol: 'AMZN', companyName: 'Amazon.com Inc.', exchange: 'NASDAQ', sector: 'Consumer Cyclical', industry: 'Internet Retail', basePrice: 186.50, peRatio: 44.1, fiftyTwoWeekHigh: 201.20, fiftyTwoWeekLow: 118.35, marketCap: 1940000000000 },
  { symbol: 'TSLA', yahooSymbol: 'TSLA', companyName: 'Tesla Inc.', exchange: 'NASDAQ', sector: 'Consumer Cyclical', industry: 'Auto Manufacturers', basePrice: 218.40, peRatio: 61.2, fiftyTwoWeekHigh: 271.00, fiftyTwoWeekLow: 138.80, marketCap: 695000000000 }
];

module.exports = {
  DEFAULT_STOCKS
};
