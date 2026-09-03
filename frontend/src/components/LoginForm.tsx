import { useState } from "react";

import { login } from "../api";
import { setSessao } from "../auth";
import {
  CARD_CLASS,
  INPUT_CLASS,
  LABEL_CLASS,
} from "../utils";

import { toast } from "sonner";

interface Props {
  onLogin: () => void;
}

function LogoMark() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3c2 2.5 3 4.6 3 6.3a3 3 0 1 1-6 0C9 7.6 10 5.5 12 3Z" />
      <path d="M6.5 13.5a5.5 5.5 0 0 0 11 0" />
      <path d="M12 19v2" />
    </svg>
  );
}

export function LoginForm({ onLogin }: Props) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (email.trim() === "") {
      toast.error("Informe seu email.");
      return;
    }

    if (senha === "") {
      toast.error("Informe sua senha.");
      return;
    }

    setEnviando(true);

    try {
      const { token, nome } = await login(
        email.trim(),
        senha
      );

      setSessao(token, nome);
      onLogin();
    } catch {
      toast.error("Email ou senha inválidos.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div
      className="
        min-h-screen
        bg-gray-50
        px-4
        flex
        items-center
        justify-center
        dark:bg-gray-950
      "
      style={{
        fontFamily:
          "'Archivo', ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div
            className="
              mx-auto
              mb-3
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              bg-rose-600
              text-white
              shadow-sm
              shadow-rose-600/20
            "
          >
            <LogoMark />
          </div>

          <h1 className="text-[21px] font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Alecrim
          </h1>

          <p className="mt-0.5 text-[12.5px] font-medium text-gray-400 dark:text-gray-500">
            Casa de Festas
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className={`${CARD_CLASS} space-y-4`}
        >
          <div>
            <h2 className="text-[17px] font-bold tracking-tight text-gray-800 dark:text-gray-100">
              Entrar
            </h2>

            <p className="mt-0.5 text-[12.5px] text-gray-400 dark:text-gray-500">
              Entre para acessar sua conta.
            </p>
          </div>

          <div>
            <label className={LABEL_CLASS}>
              Email
            </label>

            <input
              required
              type="email"
              autoComplete="email"
              placeholder="seu@email.com"
              className={INPUT_CLASS}
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />
          </div>

          <div>
            <label className={LABEL_CLASS}>
              Senha
            </label>

            <input
              required
              type="password"
              autoComplete="current-password"
              placeholder="Digite sua senha"
              className={INPUT_CLASS}
              value={senha}
              onChange={(e) =>
                setSenha(e.target.value)
              }
            />
          </div>

          <div className="pt-1">
            <button
              type="submit"
              disabled={enviando}
              className="
                w-full
                rounded-xl
                bg-rose-600
                px-5
                py-2.5
                text-[13.5px]
                font-semibold
                text-white
                shadow-sm
                transition-all
                hover:bg-rose-700
                active:scale-[0.98]
                disabled:cursor-not-allowed
                disabled:opacity-50
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-rose-300
                focus-visible:ring-offset-2
                dark:focus-visible:ring-offset-gray-950
              "
            >
              {enviando ? "Entrando..." : "Entrar"}
            </button>
          </div>
        </form>

        <p className="mt-5 text-center text-[11.5px] text-gray-400 dark:text-gray-600">
          Alecrim Casa de Festas
        </p>
      </div>
    </div>
  );
}