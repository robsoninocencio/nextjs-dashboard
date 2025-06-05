/*
  Warnings:

  - You are about to drop the column `saldo` on the `investimentos` table. All the data in the column will be lost.
  - You are about to drop the column `valorDoImposto` on the `investimentos` table. All the data in the column will be lost.
  - Added the required column `impostoIncorrido` to the `investimentos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `impostoPrevisto` to the `investimentos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rendimentoDoMes` to the `investimentos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `saldoBruto` to the `investimentos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `saldoLiquido` to the `investimentos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "investimentos" DROP COLUMN "saldo",
DROP COLUMN "valorDoImposto",
ADD COLUMN     "impostoIncorrido" INTEGER NOT NULL,
ADD COLUMN     "impostoPrevisto" INTEGER NOT NULL,
ADD COLUMN     "rendimentoDoMes" INTEGER NOT NULL,
ADD COLUMN     "saldoBruto" INTEGER NOT NULL,
ADD COLUMN     "saldoLiquido" INTEGER NOT NULL;
