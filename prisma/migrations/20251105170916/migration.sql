/*
  Warnings:

  - A unique constraint covering the columns `[codigoDaPeca]` on the table `PecaCadastrada` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PecaCadastrada_codigoDaPeca_key" ON "PecaCadastrada"("codigoDaPeca");
