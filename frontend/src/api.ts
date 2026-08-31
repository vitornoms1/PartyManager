import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3333/api",
});

export type StatusEvento = "ORCAMENTO" | "CONFIRMADO" | "REALIZADO" | "CANCELADO";

export interface Evento {
  id: string;
  cliente: string;
  telefone?: string | null;
  tipoEvento: string;
  data: string;
  status: StatusEvento;
  valor: number;
  observacoes?: string | null;
}

export type EventoInput = Omit<Evento, "id">;
