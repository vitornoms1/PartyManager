# Salão de Festas

MVP de controle de festas/eventos.

## Backend (Node + TypeScript + Express + Prisma)

```bash
cd backend
npm install
cp .env.example .env   # edite DATABASE_URL com seu Postgres (ex: Supabase/Neon)
npx prisma migrate dev --name init
npm run dev
```

Roda em `http://localhost:3333`.

## Frontend (React + Vite + Tailwind)

```bash
cd frontend
npm install
npm run dev
```

Roda em `http://localhost:5173`.

## Próximos passos

- Módulo de planos/pacotes
- Módulo de controle de gastos
- Dashboard de lucro (receita - gastos)
- Deploy: Supabase/Neon (banco) + Render/Railway (backend) + Vercel (frontend)
