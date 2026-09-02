-- AlterTable
ALTER TABLE "Evento" ADD COLUMN     "restantePago" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "restantePagoEm" TIMESTAMP(3),
ADD COLUMN     "sinalPago" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sinalPagoEm" TIMESTAMP(3),
ADD COLUMN     "valorSinal" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");
