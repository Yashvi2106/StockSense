const TIMEZONE = 'Asia/Kolkata';

const getIndiaParts = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false
  }).formatToParts(date).reduce((result, part) => ({ ...result, [part.type]: part.value }), {});
  return { weekday: parts.weekday, hour: Number(parts.hour), minute: Number(parts.minute) };
};

const getMarketStatus = (date = new Date(), exchange = 'NSE', providerMarketState = '') => {
  if (exchange !== 'NSE') return 'MARKET_CLOSED';
  if (providerMarketState && ['CLOSED', 'POST', 'PRE'].includes(providerMarketState.toUpperCase())) return 'MARKET_CLOSED';
  const { weekday, hour, minute } = getIndiaParts(date);
  const isWeekday = !['Sat', 'Sun'].includes(weekday);
  const minutes = hour * 60 + minute;
  return isWeekday && minutes >= 555 && minutes < 930 ? 'OPEN' : 'MARKET_CLOSED';
};

const getDataStatus = ({ marketStatus, providerTimestamp, delayedBy }) => {
  if (marketStatus === 'MARKET_CLOSED') return 'LATEST_AVAILABLE';
  if (delayedBy > 0 || !providerTimestamp || Date.now() - new Date(providerTimestamp).getTime() > 15 * 60 * 1000) return 'DELAYED';
  return 'LIVE';
};

module.exports = { TIMEZONE, getMarketStatus, getDataStatus };