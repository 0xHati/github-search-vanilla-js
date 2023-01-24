export function formatNumber(number) {
  return number > 1000 ? `${+(number / 1000).toFixed(2)}k` : +number;
}

//TODO: show one day ago or 1 week ago, etc
export function formatDate(date) {
  return new Date(date).toLocaleDateString(navigator.language);
}
