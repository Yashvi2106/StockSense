/**
 * Formats numbers into currency strings (INR or USD)
 */
export const formatCurrency = (val, currency = 'INR') => {
  if (val == null || isNaN(val)) return '—';
  const isUSD = currency === 'USD';
  const symbol = isUSD ? '$' : '₹';

  return `${symbol}${Number(val).toLocaleString(isUSD ? 'en-US' : 'en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

/**
 * Formats percentage with + or - sign
 */
export const formatPercent = (val) => {
  if (val == null || isNaN(val)) return '—';
  const sign = val > 0 ? '+' : '';
  return `${sign}${Number(val).toFixed(2)}%`;
};

/**
 * Formats large numbers compactly (e.g. 1.2M, 50.4B)
 */
export const formatCompact = (val) => {
  if (val == null || isNaN(val)) return '—';
  return Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 2
  }).format(val);
};

/**
 * Formats date to human-readable format
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
};

export const formatMarketTimestamp = (dateStr) => {
  if (!dateStr) return 'Unavailable';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return 'Unavailable';
  return `${new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date)} IST`;
};
