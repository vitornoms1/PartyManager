# Alecrim Casa de Festas

**Sistema de gestão para salão de festas, com controle de eventos, planos, gastos, pagamentos e lucro.**

A aplicação também possui agenda visual, autenticação, modo escuro e um modo de demonstração que permite executar o frontend sem backend ou banco de dados.

## Funcionalidades

* **Festas/eventos** — cadastro de cliente, tipo de evento, data e valor
* **Edição e exclusão de eventos**
* **Filtro por mês**
* **Controle de pagamentos** — sinal, valor restante e situação do pagamento
* **Planos/pacotes** — cadastro dos pacotes oferecidos pelo salão
* **Gastos** — despesas fixas ou vinculadas a uma festa específica
* **Dashboard financeiro** — receitas, gastos e lucro
* **Análise por mês e por festa**
* **Controle de pagamentos pendentes**
* **Agenda visual** — calendário mensal com eventos organizados por status
* **Login** — autenticação com JWT
* **Modo escuro** — preferência salva no dispositivo
* **Modo demonstração** — frontend independente utilizando `localStorage`

## Stack

### Backend

* Node.js
* TypeScript
* Express
* Prisma ORM
* PostgreSQL
* JWT
* bcrypt
* Zod
* CORS
* Rate limiting

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Sonner

## Pré-requisitos

Para executar o projeto completo localmente, você precisa ter:

* Node.js
* npm
* Acesso a um banco PostgreSQL

O PostgreSQL pode ser utilizado de diferentes formas:

* PostgreSQL instalado diretamente no computador
* PostgreSQL executado através do Docker
* PostgreSQL hospedado em serviços como Supabase ou Neon

### Docker é opcional

O Docker **não é obrigatório** para executar o projeto.

Ele é apenas uma alternativa para executar o PostgreSQL localmente através do arquivo `docker-compose.yaml`.

Se você utilizar Supabase, Neon ou outro PostgreSQL hospedado, não precisa instalar Docker.

## Rodando localmente

### 1. Backend

Entre na pasta do backend:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

### 2. Configuração do ambiente

Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

Configure as variáveis de ambiente necessárias.

Exemplo:

```env
DATABASE_URL="sua_url_do_postgresql"
JWT_SECRET="sua_chave_secreta"
ADMIN_EMAIL="admin@email.com"
ADMIN_PASSWORD="sua_senha"
```

> Os nomes e valores das variáveis devem seguir o arquivo `backend/.env.example`.

## Configurando o PostgreSQL

Você pode escolher uma das opções abaixo.

### Opção 1 — PostgreSQL hospedado

Você pode utilizar serviços como:

* Supabase
* Neon
* Outro provedor PostgreSQL compatível

Nesse caso, basta colocar a URL de conexão fornecida pelo serviço na variável `DATABASE_URL` do arquivo `.env`.

Depois execute:

```bash
npx prisma migrate dev --name init
npm run seed
```

### Opção 2 — PostgreSQL instalado localmente

Se você já possui o PostgreSQL instalado no computador, configure a `DATABASE_URL` apontando para sua instância local.

Depois execute:

```bash
npx prisma migrate dev --name init
npm run seed
```

### Opção 3 — PostgreSQL com Docker

O projeto possui um `docker-compose.yaml` para facilitar a execução de um PostgreSQL local.

Com o Docker Desktop instalado e em execução:

```bash
cd backend
docker compose up -d
```

Verifique os containers:

```bash
docker compose ps
```

Depois configure a `DATABASE_URL` no `.env` de acordo com as configurações do `docker-compose.yaml`.

Execute as migrations:

```bash
npx prisma migrate dev --name init
```

Crie o usuário inicial:

```bash
npm run seed
```

Para parar o PostgreSQL:

```bash
docker compose down
```

Para iniciar novamente:

```bash
docker compose up -d
```

## Iniciando o backend

Com o PostgreSQL configurado e em execução:

```bash
cd backend
npm run dev
```

O backend estará disponível em:

```text
http://localhost:3333
```

## Iniciando o frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O frontend estará disponível em:

```text
http://localhost:5173
```

## Modo demonstração

O projeto possui um modo de demonstração que permite executar o frontend **sem backend e sem PostgreSQL**.

Nesse modo, os dados são armazenados localmente no navegador através do `localStorage`.

Entre na pasta do frontend:

```bash
cd frontend
```

Crie o arquivo `.env.local`:

```bash
echo "VITE_DEMO_MODE=true" > .env.local
```

Depois execute:

```bash
npm run dev
```

Acesse:

```text
http://localhost:5173
```

### Quando usar o modo demonstração?

O modo demonstração é útil para:

* Apresentações
* Testes rápidos
* Demonstrações do sistema
* Avaliação da interface sem configurar backend
* Execução em ambientes onde não existe banco PostgreSQL disponível

> Os dados do modo demonstração ficam apenas no navegador e não são persistidos no banco de dados do backend.

## Deploy

### Banco de dados

O backend pode utilizar qualquer PostgreSQL compatível.

Algumas opções:

* Supabase
* Neon
* PostgreSQL próprio
* Outro serviço de PostgreSQL gerenciado

### Backend

O backend pode ser hospedado em serviços como:

* Railway
* Render

Configure as variáveis de ambiente presentes em:

```text
backend/.env.example
```

**Build Command:**

```bash
npm install && npm run build
```

**Start Command:**

```bash
npm run start
```

### Frontend

O frontend pode ser hospedado em serviços como:

* Vercel
* Netlify

Configure a variável:

```env
VITE_API_URL=https://sua-api.com
```

apontando para a URL pública do backend.

## Estrutura do projeto

```text
PartyManager/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.*
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth/
│   │   │   ├── eventos/
│   │   │   ├── planos/
│   │   │   ├── gastos/
│   │   │   └── dashboard/
│   │   └── middleware/
│   └── docker-compose.yaml
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── api.ts
    │   ├── localApi.ts
    │   └── ...
    ├── index.html
    └── package.json
```

## Desenvolvimento

O projeto foi desenvolvido para centralizar a gestão de um salão de festas em uma única aplicação.

A plataforma permite acompanhar eventos, clientes, pagamentos, planos, despesas e resultados financeiros, oferecendo uma visão simples e organizada da operação do salão.

