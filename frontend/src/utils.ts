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

// Substitui só estas 3 constantes no teu utils.ts — mantém o resto (chaveMes, etc.) como está.

export const CARD_CLASS =
  "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4";

export const INPUT_CLASS =
  "w-full mt-1 px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 " +
  "bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 text-[14px] " +
  "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-400 " +
  "focus:border-transparent transition-shadow";

export const LABEL_CLASS =
  "block text-[12.5px] font-semibold text-gray-500 dark:text-gray-400 mb-0.5";