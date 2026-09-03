import { Plano } from "../api";
import { CARD_CLASS } from "../utils";

function TrashIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" />
    </svg>
  );
}

interface Props {
  planos: Plano[];
  onDelete: (id: string) => void;
}

export function PlanoList({ planos, onDelete }: Props) {
  if (planos.length === 0) {
    return (
      <p className="text-gray-400 dark:text-gray-500 text-sm text-center py-10">
        Nenhum plano cadastrado ainda.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {planos.map((plano) => (
        <div
          key={plano.id}
          className={`${CARD_CLASS} hover:border-gray-200 dark:hover:border-gray-600 transition-colors`}
        >
          <div className="flex justify-between items-start gap-3">
            <div className="min-w-0">
              <h3 className="text-[15px] font-bold text-gray-800 dark:text-gray-100 tracking-tight">
                {plano.nome}
              </h3>

              {plano.descricao && (
                <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-0.5">
                  {plano.descricao}
                </p>
              )}

              {plano.itens && (
                <p className="text-[13px] text-gray-400 dark:text-gray-500 mt-1 leading-5">
                  {plano.itens}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
            <span className="text-[15px] font-bold text-gray-800 dark:text-gray-100 tabular-nums">
              R${" "}
              {plano.preco.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </span>

            <button
              type="button"
              onClick={() => onDelete(plano.id)}
              aria-label={`Excluir plano ${plano.nome}`}
              className="
                w-8 h-8
                flex items-center justify-center
                rounded-full
                text-red-600
                dark:text-red-400
                hover:bg-red-50
                dark:hover:bg-red-900/30
                transition-colors
              "
            >
              <TrashIcon />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}