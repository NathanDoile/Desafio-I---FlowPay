/** Formata uma duração em segundos como "MM:SS" ou "HH:MM:SS". */
export function formatDuration(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;
  
  const pad = (n) => n.toString().padStart(2, "0");
  
  if (hours > 0) return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  return `${pad(minutes)}:${pad(seconds)}`;
}

/** Formata de forma compacta e legível, ex: "3 min 42 s" ou "1 h 05 min". */
export function formatHumanDuration(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;
  
  if (hours > 0) return `${hours} h ${minutes.toString().padStart(2, "0")} min`;
  if (minutes > 0) return `${minutes} min ${seconds.toString().padStart(2, "0")} s`;
  return `${seconds} s`;
}

/** Segundos decorridos desde um instante ISO até "now" (ms). */
export function elapsedSeconds(isoDate, now) {
  return (now - new Date(isoDate).getTime()) / 1000;
}

/** Formata um horário ISO como "HH:MM:SS". */
export function formatClock(isoDate) {
  return new Date(isoDate).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/** Formata um timestamp em ms como "HH:MM:SS". */
export function formatClockMs(ms) {
  return new Date(ms).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/** Segundos decorridos considerando um offset em minutos a partir da âncora. */
export function elapsedFromMinsAgo(anchorMs, now, minsAgo) {
  return minsAgo * 60 + (now - anchorMs) / 1000;
}

/** Segundos decorridos considerando um offset em segundos a partir da âncora. */
export function elapsedFromSecsAgo(anchorMs, now, secsAgo) {
  return secsAgo + (now - anchorMs) / 1000;
}