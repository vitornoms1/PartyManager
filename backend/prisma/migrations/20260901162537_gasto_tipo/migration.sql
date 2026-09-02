-- CreateEnum
CREATE TYPE "TipoGasto" AS ENUM ('FIXO', 'EVENTO');

-- AlterTable
ALTER TABLE "Gasto" ADD COLUMN     "tipo" "TipoGasto" NOT NULL DEFAULT 'FIXO';
