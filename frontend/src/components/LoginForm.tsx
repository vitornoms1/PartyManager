import { useState } from "react";
import { login, MODO_DEMO } from "../api";
import { setSessao } from "../auth";
import { INPUT_CLASS, LABEL_CLASS } from "../utils";

interface Props {
  onLogin: () => void;
}

export function LoginForm({ onLogin }: Props) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setEnviando(true);
    try {
      const { token, nome } = await login(email, senha);
      setSessao(token, nome);
      onLogin();
    } catch {
      setErro("Email ou senha inválidos.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 w-full max-w-sm space-y-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-rose-600">Salão de Festas</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Entre para continuar</p>
        </div>

        {MODO_DEMO && (
          <p className="text-xs text-center text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/40 rounded p-2">
            Modo demonstração: preencha qualquer email e senha para entrar
          </p>
        )}

        <div>
          <label className={LABEL_CLASS}>Email</label>
          <input
            required
            type="email"
            className={INPUT_CLASS}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className={LABEL_CLASS}>Senha</label>
          <input
            required
            type="password"
            className={INPUT_CLASS}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>

        {erro && <p className="text-sm text-red-600 dark:text-red-400">{erro}</p>}

        <button
          type="submit"
          disabled={enviando}
          className="w-full bg-rose-600 text-white rounded-lg py-2 font-medium hover:bg-rose-700 disabled:opacity-50"
        >
          {enviando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
