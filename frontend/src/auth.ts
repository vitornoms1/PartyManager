const TOKEN_KEY = "salao_token";
const NOME_KEY = "salao_nome";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getNomeUsuario(): string | null {
  return localStorage.getItem(NOME_KEY);
}

export function setSessao(token: string, nome: string) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(NOME_KEY, nome);
}

export function limparSessao() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(NOME_KEY);
}
