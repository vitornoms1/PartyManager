import type { Dashboard, Evento, Gasto, Plano } from "./api";

const KEYS = {
  eventos: "demo_eventos",
  planos: "demo_planos",
  gastos: "demo_gastos",
  seeded: "demo_seeded",
};

function ler<T>(chave: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(chave) ?? "[]");
  } catch {
    return [];
  }
}

function salvar<T>(chave: string, dados: T[]) {
  localStorage.setItem(chave, JSON.stringify(dados));
}

function novoId(): string {
  return crypto.randomUUID();
}

function semeaDemoInicial() {
  if (localStorage.getItem(KEYS.seeded)) return;
  localStorage.setItem(KEYS.seeded, "1");

  const eventoExemplo: Evento = {
    id: novoId(),
    cliente: "Maria Silva (exemplo)",
    telefone: "51999999999",
    tipoEvento: "Aniversário de 15 anos",
    data: new Date().toISOString().slice(0, 10),
    status: "REALIZADO",
    valor: 3000,
    valorSinal: 1000,
    sinalPago: true,
    restantePago: false,
    observacoes: "Este é um exemplo — os dados aqui ficam só neste aparelho.",
  };
  salvar(KEYS.eventos, [eventoExemplo]);

  const planoExemplo: Plano = {
    id: novoId(),
    nome: "Pacote Completo (exemplo)",
    descricao: "Buffet + decoração + som",
    preco: 3500,
    itens: "Buffet, decoração temática, som e iluminação",
    ativo: true,
  };
  salvar(KEYS.planos, [planoExemplo]);

  const gastoExemplo: Gasto = {
    id: novoId(),
    descricao: "Conta de luz (exemplo)",
    categoria: "Manutenção",
    tipo: "FIXO",
    valor: 350,
    data: new Date().toISOString().slice(0, 10),
    eventoId: null,
  };
  salvar(KEYS.gastos, [gastoExemplo]);
}

function calcularDashboard(): Dashboard {
  const eventos = ler<Evento>(KEYS.eventos);
  const gastos = ler<Gasto>(KEYS.gastos);

  const realizados = eventos.filter((e) => e.status === "REALIZADO");
  const receitaTotal = realizados.reduce((s, e) => s + e.valor, 0);
  const gastoTotal = gastos.reduce((s, g) => s + g.valor, 0);

  const chaveMes = (iso: string) => iso.slice(0, 7);
  const porMesMap = new Map<string, { receita: number; gasto: number }>();

  for (const e of realizados) {
    const k = chaveMes(e.data);
    const atual = porMesMap.get(k) ?? { receita: 0, gasto: 0 };
    atual.receita += e.valor;
    porMesMap.set(k, atual);
  }
  for (const g of gastos) {
    const k = chaveMes(g.data);
    const atual = porMesMap.get(k) ?? { receita: 0, gasto: 0 };
    atual.gasto += g.valor;
    porMesMap.set(k, atual);
  }

  const meses = Array.from(porMesMap.entries())
    .map(([mes, v]) => ({ mes, receita: v.receita, gasto: v.gasto, lucro: v.receita - v.gasto }))
    .sort((a, b) => a.mes.localeCompare(b.mes));

  const porFesta = realizados
    .map((e) => {
      const gastosEvento = gastos.filter((g) => g.eventoId === e.id).reduce((s, g) => s + g.valor, 0);
      return {
        eventoId: e.id,
        cliente: e.cliente,
        tipoEvento: e.tipoEvento,
        data: e.data,
        receita: e.valor,
        gastos: gastosEvento,
        lucro: e.valor - gastosEvento,
      };
    })
    .sort((a, b) => a.data.localeCompare(b.data));

  const pendencias = eventos
    .filter((e) => (e.status === "CONFIRMADO" || e.status === "REALIZADO") && (!e.sinalPago || !e.restantePago))
    .map((e) => ({
      eventoId: e.id,
      cliente: e.cliente,
      tipoEvento: e.tipoEvento,
      data: e.data,
      sinalPago: e.sinalPago,
      restantePago: e.restantePago,
      valorPendente: !e.sinalPago ? e.valor : e.valor - e.valorSinal,
    }))
    .sort((a, b) => a.data.localeCompare(b.data));

  return { receitaTotal, gastoTotal, lucroTotal: receitaTotal - gastoTotal, meses, porFesta, pendencias };
}

function resposta<T>(data: T) {
  return Promise.resolve({ data });
}

function idDaUrl(url: string): string {
  return url.split("/").filter(Boolean).pop()!;
}

export const localApi = {
  async get(url: string) {
    semeaDemoInicial();
    if (url === "/eventos") return resposta(ler<Evento>(KEYS.eventos).sort((a, b) => a.data.localeCompare(b.data)));
    if (url === "/planos") return resposta(ler<Plano>(KEYS.planos));
    if (url === "/gastos") {
      const eventos = ler<Evento>(KEYS.eventos);
      const gastos = ler<Gasto>(KEYS.gastos).map((g) => {
        const evento = eventos.find((e) => e.id === g.eventoId);
        return { ...g, evento: evento ? { cliente: evento.cliente, tipoEvento: evento.tipoEvento } : null };
      });
      return resposta(gastos.sort((a, b) => b.data.localeCompare(a.data)));
    }
    if (url === "/dashboard") return resposta(calcularDashboard());
    throw new Error(`Rota demo não implementada: GET ${url}`);
  },

  async post(url: string, body: any) {
    semeaDemoInicial();
    if (url === "/auth/login") {
      return resposta({ token: "demo-token", nome: "Modo Demonstração" });
    }
    if (url === "/eventos") {
      const eventos = ler<Evento>(KEYS.eventos);
      const novo: Evento = { id: novoId(), ...body };
      salvar(KEYS.eventos, [...eventos, novo]);
      return resposta(novo);
    }
    if (url === "/planos") {
      const planos = ler<Plano>(KEYS.planos);
      const novo: Plano = { id: novoId(), ...body };
      salvar(KEYS.planos, [...planos, novo]);
      return resposta(novo);
    }
    if (url === "/gastos") {
      const gastos = ler<Gasto>(KEYS.gastos);
      const novo: Gasto = { id: novoId(), ...body };
      salvar(KEYS.gastos, [...gastos, novo]);
      return resposta(novo);
    }
    throw new Error(`Rota demo não implementada: POST ${url}`);
  },

  async put(url: string, body: any) {
    if (url.startsWith("/eventos/")) {
      const id = idDaUrl(url);
      const eventos = ler<Evento>(KEYS.eventos);
      const atualizado = { ...eventos.find((e) => e.id === id), ...body, id };
      salvar(
        KEYS.eventos,
        eventos.map((e) => (e.id === id ? atualizado : e))
      );
      return resposta(atualizado);
    }
    throw new Error(`Rota demo não implementada: PUT ${url}`);
  },

  async delete(url: string) {
    if (url.startsWith("/eventos/")) {
      const id = idDaUrl(url);
      salvar(KEYS.eventos, ler<Evento>(KEYS.eventos).filter((e) => e.id !== id));
      return resposta(null);
    }
    if (url.startsWith("/planos/")) {
      const id = idDaUrl(url);
      salvar(KEYS.planos, ler<Plano>(KEYS.planos).filter((p) => p.id !== id));
      return resposta(null);
    }
    if (url.startsWith("/gastos/")) {
      const id = idDaUrl(url);
      salvar(KEYS.gastos, ler<Gasto>(KEYS.gastos).filter((g) => g.id !== id));
      return resposta(null);
    }
    throw new Error(`Rota demo não implementada: DELETE ${url}`);
  },

  interceptors: {
    request: { use: () => {} },
    response: { use: () => {} },
  },
};
