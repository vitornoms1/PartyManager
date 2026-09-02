const NOMES_MES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export function chaveMes(dataISO: string): string {
  return dataISO.slice(0, 7);
}

export function formatMesLabel(chave: string): string {
  const [ano, mes] = chave.split("-");
  return `${NOMES_MES[Number(mes) - 1]}/${ano}`;
}

export const CARD_CLASS = "bg-white dark:bg-gray-800 rounded-lg shadow p-4";
export const INPUT_CLASS =
  "w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100";
export const LABEL_CLASS = "block text-sm text-gray-600 dark:text-gray-300 mb-1";
