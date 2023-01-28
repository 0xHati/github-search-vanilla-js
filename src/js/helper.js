export function formatNumber(number) {
  return number > 1000 ? `${+(number / 1000).toFixed(2)}k` : +number;
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString(navigator.language);
}

export function relativeDate(date) {
  const long = new Intl.RelativeTimeFormat("en-US", { style: "long", numeric: "auto" });
  const msWeek = 1000 * 60 * 60 * 24 * 7;
  const msDay = 1000 * 60 * 60 * 24;
  const msMonth = 1000 * 60 * 60 * 24 * 7 * 30;

  const rDate = new Date(date);
  const today = new Date();

  // Discard the time and time-zone information.
  const utc1 = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const utc2 = Date.UTC(rDate.getFullYear(), rDate.getMonth(), rDate.getDate());

  let difference = Math.floor((utc2 - utc1) / msDay);
  if (difference < -30) {
    difference = Math.floor((utc2 - utc1) / msMonth);
    return long.format(difference, "weeks");
  }
  if (difference < -7) {
    difference = Math.floor((utc2 - utc1) / msWeek);
    return long.format(difference, "weeks");
  }
  if (difference <= 0) {
    return long.format(difference, "days");
  }
}
