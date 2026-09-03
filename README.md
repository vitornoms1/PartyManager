# Alecrim Casa de Festas

Sistema de gestão completo para um salão de festas: controle de eventos, planos, gastos e lucro, com autenticação, agenda visual e modo escuro.

## Funcionalidades

- **Festas/eventos** — cadastro completo (cliente, tipo, data, valor), edição, exclusão e filtro por mês
- **Controle de pagamento** — valor de sinal e restante, com marcação de pago/pendente
- **Planos/pacotes** — cadastro de pacotes oferecidos pelo salão
- **Gastos** — despesas fixas do salão (ex: aluguel, luz) ou vinculadas a uma festa específica (ex: decoração, buffet)
- **Dashboard de lucro** — receita, gastos e lucro total, por mês e por festa individual, além de pendências de pagamento
- **Agenda visual** — calendário mensal com as festas marcadas por status
- **Login** — acesso protegido por usuário e senha (JWT)
- **Modo escuro** — com preferência salva por dispositivo
- **Modo demonstração** — versão do frontend que roda sem backend, salvando os dados no navegador (útil para apresentações)

## Stack

- **Backend**: Node.js, TypeScript, Express, Prisma ORM, PostgreSQL
- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Autenticação**: JWT + bcrypt
- **Segurança**: CORS restrito por domínio, rate limiting, validação de entrada com Zod

## Rodando localmente

### Backend

```bash
cd backend
npm install
cp .env.example .env   # preencha DATABASE_URL (Postgres, ex: Supabase/Neon), JWT_SECRET e ADMIN_*
npx prisma migrate dev --name init
npm run seed            # cria o usuário inicial de login
npm run dev
```

Roda em `http://localhost:3333`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Roda em `http://localhost:5173`.

### Modo demonstração (sem backend)

Para rodar o frontend sozinho, com dados salvos apenas no navegador:

```bash
cd frontend
echo "VITE_DEMO_MODE=true" > .env.local
npm run dev
```

## Deploy

- **Banco de dados**: Supabase ou Neon (PostgreSQL gerenciado)
- **Backend**: Railway ou Render — configure as variáveis de ambiente do `backend/.env.example`, com `Build Command: npm install && npm run build` e `Start Command: npm run start`
- **Frontend**: Vercel ou Netlify — configure `VITE_API_URL` apontando para a URL pública do backend

## Estrutura do projeto

```
backend/
  prisma/         schema do banco e script de seed
  src/
    routes/       endpoints da API (auth, eventos, planos, gastos, dashboard)
    middleware/   autenticação (JWT)
frontend/
  src/
    components/   telas e formulários
    api.ts        cliente HTTP e tipos compartilhados
    localApi.ts   implementação do modo demonstração (localStorage)
```

---

🤖 Projeto desenvolvido com o suporte do [Claude Code](https://claude.com/claude-code).
