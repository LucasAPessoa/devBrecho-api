/*
  Warnings:

  - A unique constraint covering the columns `[codigo]` on the table `Fornecedora` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `codigo` to the `Fornecedora` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Fornecedora" ADD COLUMN     "codigo" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Fornecedora_codigo_key" ON "Fornecedora"("codigo");
