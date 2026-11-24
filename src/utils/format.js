export function parseApiDate(value) {
  if (!value) return null;
  const hasZone = /([zZ]|[+-]\d{2}:\d{2})$/.test(value);
  return new Date(hasZone ? value : `${value}Z`);
}

export function timeAgo(value, now = Date.now()) {
  const date = parseApiDate(value);
  if (!date) return null;

  const seconds = Math.max(0, Math.round((now - date.getTime()) / 1000));
  if (seconds < 60) return `${seconds} s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h ago`;

  const days = Math.floor(hours / 24);
  return `${days} d ago`;
}

const shortFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

const longFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatShort(value) {
  const date = parseApiDate(value);
  return date ? shortFormat.format(date) : null;
}

export function formatLong(value) {
  const date = parseApiDate(value);
  return date ? longFormat.format(date) : null;
}
