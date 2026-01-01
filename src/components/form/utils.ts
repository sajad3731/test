export const formatNumber = (value: number, decimals: number): string => {
  if (isNaN(value) || value === 0) return "";
  return value.toFixed(decimals);
};

export const parseNumber = (value: string): number => {
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num;
};