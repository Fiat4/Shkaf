export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '—';
  if (bytes === 0) return '0 Б';

  const units = ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ'];
  const exp = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exp;
  const digits = value >= 100 || exp === 0 ? 0 : value >= 10 ? 1 : 2;
  return `${value.toFixed(digits)} ${units[exp]}`;
}

export function formatPercent(part: number, whole: number): string {
  if (!whole) return '0%';
  const pct = (part / whole) * 100;
  if (pct < 0.1) return '<0.1%';
  if (pct >= 10) return `${pct.toFixed(0)}%`;
  return `${pct.toFixed(1)}%`;
}
