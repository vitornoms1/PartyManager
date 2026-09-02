import { Plano } from "../api";
import { CARD_CLASS } from "../utils";

interface Props {
  planos: Plano[];
  onDelete: (id: string) => void;
}

export function PlanoList({ planos, onDelete }: Props) {
  if (planos.length === 0) {
    return <p className="text-gray-500 dark:text-gray-400 text-center py-8">Nenhum plano cadastrado ainda.</p>;
  }

  return (
    <div className="space-y-3">
      {planos.map((plano) => (
        <div key={plano.id} className={CARD_CLASS}>
          <div className="flex justify-between items-start gap-2">
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">{plano.nome}</h3>
              {plano.descricao && <p className="text-sm text-gray-500 dark:text-gray-400">{plano.descricao}</p>}
              {plano.itens && <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{plano.itens}</p>}
            </div>
          </div>

          <div className="flex justify-between items-center mt-3">
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              R$ {plano.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
            <button
              onClick={() => onDelete(plano.id)}
              className="text-sm text-red-600 dark:text-red-400 hover:underline"
            >
              Excluir
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
