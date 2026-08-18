function round(n, decimals = 1) {
  const f = 10 ** decimals;
  return Math.round(n * f) / f;
}

export function formatNumber(n) {
  return new Intl.NumberFormat("pt-BR").format(n);
}

export function formatMinutes(n) {
  const min = Math.floor(n);
  const seg = Math.round((n - min) * 60);
  
  if (seg === 0) return `${min}min`;
  return `${min}min ${seg.toString().padStart(2, "0")}s`;
}