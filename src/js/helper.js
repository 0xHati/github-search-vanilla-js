export function formatNumber(number) {
  return number > 1000 ? `${+(number / 1000).toFixed(2)}k` : +number;
}
