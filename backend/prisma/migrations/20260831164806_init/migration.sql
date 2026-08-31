-- CreateEnum
CREATE TYPE "StatusEvento" AS ENUM ('ORCAMENTO', 'CONFIRMADO', 'REALIZADO', 'CANCELADO');

-- CreateTable
CREATE TABLE "Evento" (
    "id" TEXT NOT NULL,
    "cliente" TEXT NOT NULL,
    "telefone" TEXT,
    "tipoEvento" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "status" "StatusEvento" NOT NULL DEFAULT 'ORCAMENTO',
    "valor" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "observacoes" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id")
);
