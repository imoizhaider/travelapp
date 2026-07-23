export const formatMoney = (value, currency = 'USD') => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '-';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(Number(value));
};

export const formatDate = (value) => {
  if (!value) return '-';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(value));
};

export const formatRelativeDate = (value) => {
  if (!value) return '-';
  const diff = Date.now() - new Date(value).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days <= 0) return 'Today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
};
