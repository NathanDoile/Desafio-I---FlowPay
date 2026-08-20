const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export function converterDataParaSeletor(data) {
  if (!data) return "";
  
  const [ano, mes] = data.split("-");
  // 🔄 Mudança aqui: de parseInt para Number.parseInt
  const indiceMes = Number.parseInt(mes, 10) - 1;
  const nomeMes = MESES[indiceMes] || "";

  return `${nomeMes} de ${ano}`;
}

export function converterSeletorParaData(mesAno) {
  if (!mesAno) return "";

  const [nomeMes, , ano] = mesAno.split(" ");
  const indiceMes = MESES.indexOf(nomeMes);

  if (indiceMes === -1) return "";

  const mesFormatado = String(indiceMes + 1).padStart(2, "0");
  return `${ano}-${mesFormatado}-01`;
}