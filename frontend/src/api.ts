import axios from "axios";
import { getToken, limparSessao } from "./auth";
import { localApi } from "./localApi";

export const MODO_DEMO = import.meta.env.VITE_DEMO_MODE === "true";

const apiReal = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3333/api",
});

apiReal.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiReal.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) limparSessao();
    return Promise.reject(error);
  }
);

interface ApiClient {
  get<T = any>(url: string): Promise<{ data: T }>;
  post<T = any>(url: string, body?: any): Promise<{ data: T }>;
  put<T = any>(url: string, body?: any): Promise<{ data: T }>;
  delete<T = any>(url: string): Promise<{ data: T }>;
}

export const api: ApiClient = MODO_DEMO ? (localApi as unknown as ApiClient) : apiReal;

export async function login(email: string, senha: string): Promise<{ token: string; nome: string }> {
  const { data } = await api.post("/auth/login", { email, senha });
  return data;
}

export type StatusEvento = "ORCAMENTO" | "CONFIRMADO" | "REALIZADO" | "CANCELADO";

export interface Evento {
  id: string;
  cliente: string;
  telefone?: string | null;
  tipoEvento: string;
  data: string;
  status: StatusEvento;
  valor: number;
  valorSinal: number;
  sinalPago: boolean;
  restantePago: boolean;
  observacoes?: string | null;
}

export type EventoInput = Omit<Evento, "id">;

export interface Plano {
  id: string;
  nome: string;
  descricao?: string | null;
  preco: number;
  itens?: string | null;
  ativo: boolean;
}

export type PlanoInput = Omit<Plano, "id">;

export type TipoGasto = "FIXO" | "EVENTO";

export interface Gasto {
  id: string;
  descricao: string;
  categoria: string;
  tipo: TipoGasto;
  valor: number;
  data: string;
  eventoId?: string | null;
  evento?: { cliente: string; tipoEvento: string } | null;
}

export type GastoInput = Omit<Gasto, "id" | "evento">;

export interface DashboardMes {
  mes: string;
  receita: number;
  gasto: number;
  lucro: number;
}

export interface DashboardFesta {
  eventoId: string;
  cliente: string;
  tipoEvento: string;
  data: string;
  receita: number;
  gastos: number;
  lucro: number;
}

export interface DashboardPendencia {
  eventoId: string;
  cliente: string;
  tipoEvento: string;
  data: string;
  sinalPago: boolean;
  restantePago: boolean;
  valorPendente: number;
}

export interface Dashboard {
  receitaTotal: number;
  gastoTotal: number;
  lucroTotal: number;
  meses: DashboardMes[];
  porFesta: DashboardFesta[];
  pendencias: DashboardPendencia[];
}
