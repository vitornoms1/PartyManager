import { formatMesLabel } from "../utils";

interface Props {
  meses: string[];
  value: string;
  onChange: (value: string) => void;
}

export function MonthFilter({ meses, value, onChange }: Props) {
  if (meses.length === 0) return null;

  return (
    <select
      className="border dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-gray-100"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Todos os meses</option>
      {meses.map((m) => (
        <option key={m} value={m}>
          {formatMesLabel(m)}
        </option>
      ))}
    </select>
  );
}
