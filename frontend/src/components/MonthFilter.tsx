import { formatMesLabel } from "../utils";

interface Props {
  meses: string[];
  value: string;
  onChange: (value: string) => void;
}

export function MonthFilter({
  meses,
  value,
  onChange,
}: Props) {
  if (meses.length === 0) return null;

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Filtrar por mês"
        className="
          h-9
          min-w-[150px]
          appearance-none
          rounded-xl
          border
          border-gray-200
          bg-white
          pl-3.5
          pr-9
          text-[12.5px]
          font-semibold
          text-gray-600
          shadow-sm
          outline-none
          transition-all
          hover:border-gray-300
          focus:border-rose-400
          focus:ring-2
          focus:ring-rose-100
          dark:border-gray-700
          dark:bg-gray-900
          dark:text-gray-300
          dark:hover:border-gray-600
          dark:focus:border-rose-500
          dark:focus:ring-rose-900/30
        "
      >
        <option value="">Todos os meses</option>

        {meses.map((mes) => (
          <option key={mes} value={mes}>
            {formatMesLabel(mes)}
          </option>
        ))}
      </select>

      <svg
        className="
          pointer-events-none
          absolute
          right-3
          top-1/2
          h-3.5
          w-3.5
          -translate-y-1/2
          text-gray-400
          dark:text-gray-500
        "
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  );
}